/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */

/// <reference path="../interfaces.d.ts"/>

import AppDispatcher = require('../dispatcher/AppDispatcher');
import DeckActionID = require('../actions/deckActionID');

/*
 * Stores direct information about the currently loaded Deck
 */
class DeckStoreStatic implements IDeckStore {
  private allCards : { [id: string] : ICard };
  public drawDeck : Array<ICard>;
  public plotDeck : Array<ICard>;
  public displayDeck : Array<ICard>;
  public onChanges : Array<any>;

  constructor() {
    this.drawDeck = [];
    this.displayDeck = [];
    this.onChanges = [];
    this.allCards = {};
    var self = this;

    //TODO: Move cards to their own store, and move API call to it's own API
    var req = $.get("dist/cards.json", function (result) {
      result.forEach((cardData) => {
        self.allCards[cardData['pack_name'] + " - " + cardData['name']] = cardData;
      });
    });
  }

  public subscribe(onChange) {
    this.onChanges.push(onChange);
  }

  public inform() {
    this.onChanges.forEach(function (cb) { cb(); });
  }

  public getDisplayDeck() : Array<ICard>{
    return this.displayDeck;
  }

  public getDrawDeck() : Array<ICard>{
    return this.drawDeck;
  }

  public getCard(code) : ICard{
    var cards = this.getDisplayDeck().filter(c => c.code == code)

    if (cards.length >= 0){
      return cards[0];
    }
    return null;
  }

  public markKeyCard(code){
    var card = this.getCard(code);
    card.is_key_card = !card.is_key_card;
    card.is_avoided = false;
    card.never_setup = false;

    this.inform();
  }

  public markAvoidedCard(code){
    var card = this.getCard(code);
    card.is_key_card = false;
    card.is_avoided = !card.is_avoided;
    card.never_setup = false;

    this.inform();
  }

  public markRestrictedCard(code){
    var card = this.getCard(code);
    card.is_key_card = false;
    card.is_avoided = false;
    card.never_setup = !card.never_setup;

    this.inform();
  }

  public markEcon(code){
    var card = this.getCard(code);
    card.is_econ = !card.is_econ;

    this.inform();
  }

  public markSetupLock(code){
    var card = this.getCard(code);

    // this if for House of Red Door exclusively now

    if (card.cost > 3 || card.type_code != 'location' || !card.is_unique || card.is_limited){
      return;
    }

    this.getDisplayDeck().forEach(function(c){
      c.is_setup_locked = false;
    })

    card.is_setup_locked = !card.is_setup_locked;

    this.inform();
  }

  public loadDeck(text : string) {
    //var regexp = new RegExp('([0-9])x ([^(]+) \\(([^)]+)?\\)', 'g');
    var regexp = new RegExp('([0-9])x[ ]+([^(\\n]+)(\\([^)\\n]+\\))?', 'g')

    this.drawDeck = [];
    this.plotDeck = [];
    this.displayDeck = [];

      var cardToAdd = regexp.exec(text);

      while (cardToAdd){
        var cardCount = cardToAdd[1];
        var cardName = cardToAdd[2].trim();
        var cardPack = cardToAdd[3] ? cardToAdd[3].trim().substr(1, cardToAdd[3].length - 2) : "";


        var card = this.allCards[cardPack + " - " + cardName];

        if (!card){
          //simple find didn't work

          for (var key in this.allCards) {
              var searchCard = this.allCards[key];

              if (searchCard.name == cardName && (!cardPack || cardPack.toLowerCase() == searchCard.pack_code.toLowerCase())){
                card = searchCard;
                break;
              }
          }
        }

        if (card &&card.type_code == "plot"){
          this.plotDeck.push(card);
        }
        else if (card){
          card.count = +cardToAdd[1];
          card.setup_count = 0;

          card.is_key_card = false;
          card.is_avoided = false;

          this.addLimitedStatus(card);
          this.addIncomeBonus(card);
          this.addMarshalEffects(card);
          this.addAttachmentRestrictions(card);

          if (card.enter_play_effect){
            card.is_avoided = true;
          }

          this.displayDeck.push(card);
          for (var i = 0; i < card.count; i++){
            this.drawDeck.push(card);
          }
        }
        cardToAdd = regexp.exec(text);
      }

      this.inform();
    }


  private addLimitedStatus(card:ICard){
    card.is_limited = card.text.includes('Limited.');
  }

  private addIncomeBonus(card:ICard){
    var incomeRegex = new RegExp('\\+([0-9]) Income', 'g');
    var incomeMatches = incomeRegex.exec(card.text);

    if (card.hasOwnProperty('is_econ')){
      //data is manually set, don't determine it now
      return;
    }

    card.income = 0;
    card.is_econ = false;
    if (incomeMatches){
      card.income = +incomeMatches[1];
      card.is_econ = true;
      return;
    }

    var reduceRegex = new RegExp('reduce the cost', 'g');
    var reduceMatches = reduceRegex.exec(card.text);

    if (reduceMatches){
      card.is_econ = true;
    }
  }

  private addAttachmentRestrictions(card:ICard){
    card.attachmentRestriction = [];
    if (card.type_code == 'attachment') {
      var restrictionRegex = new RegExp('(.*) character only');
      var restrictionMatches = restrictionRegex.exec(card.text);

      if (restrictionMatches){
        if (restrictionMatches[1] == '<i>Lord</i> or <i>Lady</i>'
            || restrictionMatches[1] == 'Lord or Lady'){
          card.attachmentRestriction = ['Lord', 'Lady'];
        } else{
          var restriction = restrictionMatches[1];
          restriction = restriction.replace(/\[|\]/g, "");
          restriction = restriction.replace(/<i>/g, "");
          restriction = restriction.replace(/<\/i>/g, "");
          card.attachmentRestriction = [restriction];
        }
      }
    } else if (card.type_code == 'character'){
      var restrictionRegex = new RegExp('No attachments( except <i>Weapon<\\/i>)?');
      var restrictionMatches = restrictionRegex.exec(card.text);

      if (restrictionMatches){

        if (restrictionMatches[1]){
          card.attachmentRestriction = ['Weapon'];
        } else {
          card.attachmentRestriction = ['NO ATTACHMENTS'];
        }
      }
    }
  }

  private addMarshalEffects(card:ICard){
    var marshalEffectRegex = new RegExp('(After you marshal ' + card.name + ')|(After ' + card.name + ' enters play)');
    var marshalMatches = marshalEffectRegex.exec(card.text);

    card.enter_play_effect = marshalEffectRegex.test(card.text);
    if (card.enter_play_effect){
    }
  }
}

var DeckStore:DeckStoreStatic = new DeckStoreStatic();

AppDispatcher.register(function(payload:IActionPayload){
  if (payload.actionType == DeckActionID.LOAD_DECK){
    DeckStore.loadDeck(payload.data);
  } else if (payload.actionType == DeckActionID.MARK_KEY_CARD){
    DeckStore.markKeyCard(payload.data);
  } else if (payload.actionType == DeckActionID.MARK_AVOID_CARD){
    DeckStore.markAvoidedCard(payload.data);
  } else if (payload.actionType == DeckActionID.MARK_NEVER_CARD){
    DeckStore.markRestrictedCard(payload.data);
  } else if (payload.actionType == DeckActionID.MARK_ECON){
    DeckStore.markEcon(payload.data);
  } else if (payload.actionType == DeckActionID.MARK_SETUP_LOCKED){
    DeckStore.markSetupLock(payload.data);
  }
});


export = DeckStore;
