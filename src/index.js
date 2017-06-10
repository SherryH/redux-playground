// import { createStore } from 'redux';

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

  const getState = () => {
    return reducer(state, {type:null}); //ugly
  };

  const subscribe = (listener) => {
    currentListeners.push(listener);
  };

  const dispatch = (action) => {
    //an action is dispatched
    //call the reducer to change the state
    state = reducer(state, action);
    //call the listener subscribe to the chage of state
    currentListeners.forEach(listener=>listener());
  };
  return {
    getState,
    subscribe,
    dispatch
  };
};

const store = createStore(counter);
console.log('state',store.getState());

const render = () =>{
  document.body.innerText = store.getState();
};

console.log('get state',store.getState());
document.addEventListener('click', () => {
  store.dispatch({type: 'INCREMENT'});
});
store.subscribe(render);
render();
