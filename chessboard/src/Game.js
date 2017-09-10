//let state = [0,0]; //knightPosition

//createStore function, this is the system dispatching actions and listens for actions
// input: reducer, output: single source of truth
const createStore = (reducer) => {
  let state;
  let currentListeners = [];

  const getState = () => state;

  const subscribe = (listener) => {
    currentListeners.push(listener);
    return ()=>{
      currentListeners.filter((thisListener)=>thisListener!==listener);
    };
  };

  const dispatch = (action) => {
    //action is dispatched, call reducer to change state
    state = reducer(state, action);
    //call listeners subscribing to the change
    currentListeners.forEach(listener=>listener());
  };
  //call reducer to initialise state
  dispatch({});

  return {
    getState,
    subscribe,
    dispatch
  };
};

const reducer = (state=[1,0], action) =>{
  switch(action.type) {
    case 'MOVE':
      return action.payload;
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;