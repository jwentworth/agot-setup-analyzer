/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */

/// <reference path="../interfaces.d.ts"/>

import * as React from "react";
import * as ReactDOM from "react-dom";


import AppDispatcher = require('../dispatcher/AppDispatcher');
import DeckActionID = require('../actions/deckActionID');
import SetupActionID = require('../actions/setupActionID');
import { SetupActions } from '../actions/setupActions';


interface IDeckImportProps {
  deck : IDeckStore;
}

interface IDeckImportState {
}

class DeckImport extends React.Component<IDeckImportProps, IDeckImportState> {

  public state : ICardItemState;

  constructor(props : IDeckImportProps){
    super(props);
  }


  public handleImportDeck(event: any){
    var el:HTMLTextAreaElement = ReactDOM.findDOMNode(this.refs["deckText"]) as HTMLTextAreaElement;

    var text = el.value;

    SetupActions.test("actions");

    AppDispatcher.dispatch({
      actionType: SetupActionID.TEST,
      data: "direct"
    });

    AppDispatcher.dispatch({
      actionType: DeckActionID.LOAD_DECK,
      data: text
    });
    //
    AppDispatcher.dispatch({
      actionType: SetupActionID.PERFORM_SIMULATIONS,
      data: 5000
    })
  }

  public render() {
    return (
      <section className="import">
        <button onClick={ e => this.handleImportDeck(e)}>Load</button>

        <textarea
          ref="deckText"
          className="deck-import"
          placeholder="Copy your decklist here"
          autoFocus={true} />
      </section>
    );
  }
}

AppDispatcher.dispatch({
  actionType: "SETUP",
  data: null
});

export { DeckImport };
