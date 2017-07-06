import React from 'react';
import {render} from 'react-dom';
import expect from 'expect';
import deepFreeze from 'deep-freeze';
// import { createStore } from 'redux';
import {TodoApp, todoStore } from './Todo';

let state = 0;

//create a reducer
const counter = (state = 0, action) => {
  switch(action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }
};

console.log('state1', state = counter(state, { type: 'DECREMENT' }));
console.log('state2', state = counter(state, { type: 'DECREMENT' }));
console.log('state3', state = counter(state, { type: 'INCREMENT' }));
console.log('state4', state = counter(state, { type: 'INCREMENT' }));
console.log('state5', state = counter(state, { type: 'INCREMENT' }));


//create the createStore function
const createStore = (reducer) => {
  let state;
  let currentListeners = [];

  console.log('called');

  const getState = () => state;

  const subscribe = (listener) => {
    currentListeners.push(listener);
    //returns an unsubscribe method that removes the listener from currentListeners array
    return () => {
      currentListeners.filter(thisListener => thisListener !== listener);
    };
  };

  const dispatch = (action) => {
    //an action is dispatched
    //call the reducer to change the state
    state = reducer(state, action);
    //call the listener subscribe to the chage of state
    currentListeners.forEach(listener=>listener());
  };

  // to initialise the initial state, call the reducer function
  dispatch({});

  return {
    getState,
    subscribe,
    dispatch
  };
};

const store = createStore(counter);
console.log('state',store.getState());

//Use React to make counter example
//Added increment and decrement button
const Counter = ({value, increment, decrement})=>(
  <div>
    <h1>{value}</h1>
    <button onClick={increment}>increment</button>
    <button onClick={decrement}>decrement</button>
  </div>
);



const renderElem = () =>{
  const state = store.getState();
  // return <Counter value= {state} />;
  render(<Counter value={state}
     increment = {() => {store.dispatch({type: 'INCREMENT'});}}
     decrement = {() => {store.dispatch({type: 'DECREMENT'});}}

    />, document.getElementById('app'));
};

console.log('get state',store.getState());
// document.addEventListener('click', () => {
//   store.dispatch({type: 'INCREMENT'});
// });

//We need to subscribe to the redux store so our render function would re-render when any state is changed
store.subscribe(renderElem);
renderElem();



//Avoid Array mutation
//Add a state of 0 to list of Counters

const addCounter = (list) => {
  // return list.concat(0);
  return [...list ,0]; //ES6 way of concatnating using spread
};

const testAddCounter = () => {
  const listBefore = [];
  const listAfter = [0];
  deepFreeze(listBefore); // prevent list from being mutated
  const newList = addCounter(listBefore);
  expect(newList).toEqual(listAfter, 'List not equal');
};
testAddCounter();

//Remove a counter from the list
const removeCounter = (list, index) =>{
  console.log([...list.slice(0, index), ...list.slice(index+1)])
  return [...list.slice(0, index), ...list.slice(index+1)];
};

const testRemoveCounter = () => {
  const listBefore = [0, 10, 20];
  const listAfter = [0, 20];
  deepFreeze(listBefore);
  expect(removeCounter(listBefore, 1)).toEqual(listAfter,'List not equal after removal');
};
testRemoveCounter();

//Increment a counter
const incrementCounter = (list, index) => {
  var newList = list.slice();
  newList[index]++;
  return newList;
};

const testIncrementCounter = () => {
  const listBefore = [0, 10, 20];
  const listAfter = [0, 11, 20];
  deepFreeze(listBefore);
  expect(incrementCounter(listBefore, 1)).toEqual(listAfter,'List not equal after Increment')
};
testIncrementCounter();




// render a todo App
render(<TodoApp />, document.getElementById('todoapp'));

// //subscribe to the state change and update view
// todoStore.subscribe(renderTodo);


