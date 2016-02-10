/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../interfaces.d.ts"/>
/// <reference path="../libs/react-d3.d.ts" />

import { CardSettings } from "./cardSettings";
import DeckStore = require('../stores/deckStore')
import SetupStore = require('../stores/setupStore')
import AppDispatcher = require('../dispatcher/AppDispatcher');
import SetupActionID = require('../actions/SetupActionID');

interface IConfigureProps {
  settings : ISetupSettings;
  displayDeck : Array<ICard>;
}

interface IConfigureState {
}

class Configure extends React.Component<IConfigureProps, IConfigureState> {

  public state : IConfigureState;

  constructor(props : IConfigureProps){
    super(props);
  }

  /**
   * This is a completely optional performance enhancement that you can
   * implement on any React component. If you were to delete this method
   * the app would still work correctly (and still be very performant!), we
   * just use it as an example of how little code it takes to get an order
   * of magnitude performance improvement.
   */
  // public shouldComponentUpdate(nextProps : ICardItemProps, nextState : ICardItemState) {
  //   return false;
  // }

  private cardSort(c1, c2) {
    // if (c1.is_restricted && !c2.is_restricted){
    //   return 1;
    // } else if (c2.is_restricted && !c1.is_restricted){
    //   return -1;
    // }
    //
    // if (c1.is_key_card && !c2.is_key_card){
    //   return -1;
    // } else if (c2.is_key_card && !c2.is_key_card){
    //   return 1;
    // }
    //
    // if (c1.is_avoided && !c2.is_avoided){
    //   return -1;
    // } else if (c2.is_avoided && !c2.is_avoided){
    //   return 1;
    // }

    if (c1.cost != c2.cost){
      return c2.cost - c1.cost;
    } else if (c1.name < c2.name) {
       return 1;
    }
    return -1;
  }

  private toggleMulliganOnPoor(){
    AppDispatcher.dispatch({
      actionType: SetupActionID.TOGGLE_MULIGAN_ON_POOR,
      data: null
    })
  }

  private toggleMulliganWithoutKey(){
    AppDispatcher.dispatch({
      actionType: SetupActionID.TOGGLE_MULIGAN_WITHOUT_KEY,
      data: null
    })
  }

  private toggleMulliganIfNotGreat(){
    AppDispatcher.dispatch({
      actionType: SetupActionID.TOGGLE_MULIGAN_IF_NOT_GREAT,
      data: null
    })
  }

  public render() {
    var displayDeck = this.props.displayDeck;

    var i = 0;

    var avoidedCards = displayDeck.filter((card) => card.is_avoided).sort(this.cardSort);
    var avoidedItems = avoidedCards.sort(this.cardSort).map((card) => {
      i++;
      return (
        <CardSettings key={card.code} card={card} />
      );
    });

    var keyCards = displayDeck.filter((card) => card.is_key_card).sort(this.cardSort);
    var keyItems = keyCards.sort(this.cardSort).map((card) => {
      i++;
      return (
        <CardSettings key={card.code} card={card} />
      );
    });

    var restrictedCards = displayDeck.filter((card) => card.is_restricted).sort(this.cardSort);
    var restrictedItems = restrictedCards.sort(this.cardSort).map((card) => {
      i++;
      return (
        <CardSettings key={card.code} card={card} />
      );
    });

    var cards = displayDeck.sort(this.cardSort);
    var allCards = cards.map((card) => {
      return (
        <CardSettings key={card.code} card={card}/>
      );
    });

    return (
      <section className="content">
        <section className="configure">
          <p>Mulligan Settings</p>
          <div>
            <input id="mulligan-if-poor" type="checkbox" checked={this.props.settings.mulliganOnPoor} onClick={this.toggleMulliganOnPoor} />
            <label htmlFor="mulligan-if-poor">Mulligan if Poor Setup</label>
          </div>

          <div>
            <input id="mulligan-if-not-great" type="checkbox" checked={this.props.settings.mulliganIfNotGreat} onClick={this.toggleMulliganIfNotGreat} />
            <label htmlFor="mulligan-if-not-great">Mulligan if Not Great Setup</label>
          </div>

          <div>
            <input id="mulligan-without-key" type="checkbox" checked={this.props.settings.mulliganWithoutKey} onClick={this.toggleMulliganWithoutKey} />
            <label htmlFor="mulligan-without-key">Mulligan if No Key Character</label>
          </div>

          <p>This section is a work in progress. You can configure cards as being <i className="fa fa-key fa-fw"></i> Key cards, <i className="fa fa-exclamation-triangle fa-fw"></i> Try to Avoid Cards, and <i className="fa fa-ban fa-fw"></i>Restricted Cards</p>
          <p>Key Cards will be set up as often as possible. As long as you can set up at least 2 total characters, a set up with a key card will be used if available</p>
          <p>Try to Avoid Cards will be avoided unless there is nothing else that can be used. For example, if you have only 3 gold worth of characters to set up, and a 5 cost try to avoid character, it will set up the character. By default this includes characters with positive enter play abilities</p>
          <p>Restricted cards will never be set up under any circumstances. By default this includes negative attachments</p>

          <div>Key cards:</div>
          <div className="card-list">
            {keyItems}
          </div>

          <div>Try to Avoid Cards:</div>
          <div className="card-list">
            {avoidedItems}
          </div>

          <div>Restricted Cards:</div>
          <div className="card-list">
            {restrictedItems}
          </div>
          <p>This section is a work in progress, and will soon be the home of configuration settings...</p>
          <div className="card-list">
            {allCards}
          </div>
        </section>
      </section>
    );
  }
}

export { Configure };