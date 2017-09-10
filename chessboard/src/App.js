import React, { Component } from 'react';
import Board from './Board';
import store from './Game';
import './App.css';

class App extends Component {
  render() {
    return (
      <div id="app">
         <Board store={store} dispatch={store.dispatch}/>
      </div>
    );
  }
}

export default App;
