import { createStore } from 'redux';

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

const store = createStore(counter);
console.log('state1', state = counter(state, { type: 'DECREMENT' }));
console.log('state2', state = counter(state, { type: 'DECREMENT' }));
console.log('state3', state = counter(state, { type: 'INCREMENT' }));
console.log('state4', state = counter(state, { type: 'INCREMENT' }));
console.log('state5', state = counter(state, { type: 'INCREMENT' }));

  console.log('get state',store.getState());
document.addEventListener('click', () => {
  store.dispatch({type: 'INCREMENT'});
});
store.subscribe(() => {
  document.body.innerText = store.getState();
});
