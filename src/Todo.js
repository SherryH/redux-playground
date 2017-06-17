import React from 'react';
import expect from 'expect';
import deepFreeze from 'deep-freeze';
import { createStore } from 'redux';

const Todo = () => {

  return (
    <div>This is an todo app </div>
  );
};


//Avoid Object mutation
// toggleTodo with Object.assign
const toggleTodo = (todo) => {
  return Object.assign({}, todo, {completed: !todo.completed});
  // return {...todo, {completed: !todo.completed}}; //available in babel stage 2 preset ES7
};

const testToggleTodo = () => {
  const todoBefore = {
    id: 1,
    text: 'Learn Redux',
    completed: false
  };
  const todoAfter = {
    id: 1,
    text: 'Learn Redux',
    completed: true
  };
  deepFreeze(todoBefore);
  expect(toggleTodo(todoBefore)).toEqual(todoAfter, 'todo not Equal after toggle');
};
testToggleTodo();

//Add a todo List Reducer
const todos_old = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':{
      // const newState = state.slice();
      // newState.push({id: action.id, text: action.text, completed: false});
      // return newState;
      return [...state, {id: action.id, text: action.text, completed: false}];
    }
    case 'TOGGLE_TODO':{
      return state.map(todo => {
        if (todo.id !== action.id) {
          return todo;
        }
        return {
          ...todo,
          completed: !todo.completed
        };
      });
    }
    default:
      return state;
  }
};

// Reducer composition arrays
// the above reducer is hard to read. it mixes 2 concerns: updating the todo array and updating individual todos. So break 'updating individual todo' to a separate function
//the state here is a todo
const todo = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {id: action.id, text: action.text, completed: false};
    case 'TOGGLE_TODO':{
      if (state.id !== action.id) {
        return state;
      }
      return {
        ...state,
        completed: !state.completed
      };
    }
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':{
      return [...state, todo({},action)];
    }
    case 'TOGGLE_TODO':{
      return state.map(t => todo(t, action));
    }
    default:
      return state;
  }
};

//Visibility Filter Reducer - a reducer that decides what todo to show
const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

//combine todo Reducer and Visibility Filter Reducer
// returns a combined state with todos and visibilityFilter as key
const todoApp = (state = {}, action) => {
  return {
    todos: todos(state.todos, action),
    visibilityFilter: visibilityFilter(state.visibilityFilter, action)
  };
};

const testAddTodo = () => {
  const stateBefore = [];
  const action = {
    type: 'ADD_TODO',
    id: 1,
    text: 'Learn Redux'
  };
  const stateAfter = [{
    id: 1,
    text: 'Learn Redux',
    completed: false
  }];
  deepFreeze(stateBefore);
  deepFreeze(action);
  expect(todos(stateBefore, action)).toEqual(stateAfter,'add todo Reducer test failed');
};

testAddTodo();

// Add a toggle todoList test
const testToggleTodo2 = () => {
  const stateBefore = [{
    id: 0,
    text: 'Learn Redux',
    completed: false
  },{
    id: 1,
    text: 'Cook dinner',
    completed: false
  }];
  const action = {
    type: 'TOGGLE_TODO',
    id: 1
  };
  const stateAfter = [{
    id: 0,
    text: 'Learn Redux',
    completed: false
  },{
    id: 1,
    text: 'Cook dinner',
    completed: true
  }];
  deepFreeze(stateBefore);
  deepFreeze(action);
  expect(todos(stateBefore, action)).toEqual(stateAfter,'toggle todo Reducer test failed');
};
testToggleTodo2();


// create a store with the todos reducer
const store = createStore(todoApp);
console.log('Initial State:');
console.log(store.getState()); //empty array
console.log('Dispatching ADD_TODO');
store.dispatch({
  type: 'ADD_TODO',
  id:2,
  text: 'Learn German'
});
console.log('Current State:');
console.log(store.getState()); //[{todo 2}]
console.log('--------------');
console.log('Dispatching ADD_TODO');
store.dispatch({
  type: 'ADD_TODO',
  id:3,
  text: 'Practice Speech'
});
console.log(store.getState()); //[{todo 2}, {todo 3}]
console.log('--------------');
console.log('Dispatching Toggle Todo');
store.dispatch({
  type: 'TOGGLE_TODO',
  id: 3
});
console.log(store.getState()); //[{todo 2}, {todo 3 done}]
console.log('---------------');
console.log('Dispatching Visibility Filter');
store.dispatch({
  type: 'SET_VISIBILITY_FILTER',
  filter: 'SHOW_COMPLETED'
});
console.log(store.getState());
console.log('---------------');
console.log('');

export default Todo;