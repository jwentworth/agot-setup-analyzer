/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */

/// <reference path="../interfaces.d.ts"/>

import AppDispatcher = require('../dispatcher/AppDispatcher');
import SetupActionID = require('./setupActionID');

class SetupActionsStatic {

  // so jshint won't bark
  public SetupActionID = SetupActionID;

  public dispatcher;

  constructor(dispatcher){
    this.dispatcher = dispatcher;
  }


  public runSimulations(runs:number){
    this.dispatcher.dispatch({
      actionType: SetupActionID.PERFORM_SIMULATIONS,
      data: runs
    });
  }

  public test(from:string){
    this.dispatcher.dispatch({
      actionType: SetupActionID.TEST,
      data: from
    })
  }
}

var SetupActions: SetupActionsStatic = new SetupActionsStatic(AppDispatcher);

AppDispatcher.dispatch({
  actionType: "SETUP",
  data: null
});

export { SetupActions };
