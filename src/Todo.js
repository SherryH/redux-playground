import React from 'react';
import expect from 'expect';
import deepFreeze from 'deep-freeze';
import { createStore, combineReducers } from 'redux';


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
// const todoApp = (state = {}, action) => {
//   return {
//     todos: todos(state.todos, action),
//     visibilityFilter: visibilityFilter(state.visibilityFilter, action)
//   };
// };

// we can use a function to combine reducers - return obj with mapping between state and reducer
// we can implement our own combineReducers
// I: an obj of reducers
// O: a final reducer function taking state and action as input
const myCombineReducersForEach = (reducers) => {
  return (state = {}, action) => {
    //this myCombineReducer function, when called
    // pass the state and action to the list of reducers
    // mutate the state according to the action accordingly, returns the state
    let nextState = {};
    Object.keys(reducers).forEach((reducer)=>{
      nextState[reducer] = reducers[reducer](state[reducer], action);
    });
    return nextState;
  };
};

//use Array reduce to produce final state
// iterate through each reducer, updating the state
const myCombineReducers = (reducers) => {
  return (state = {}, action) => {
    return Object.keys(reducers).reduce((nextState, reducer)=>{
      nextState[reducer] = reducers[reducer](state[reducer], action);
      return nextState;
    }, {});
  };
};

const todoApp = myCombineReducers({
  todos,
  visibilityFilter
});

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
const todoStore = createStore(todoApp);

console.log('Initial State:');
console.log(todoStore.getState()); //empty array
console.log('Dispatching ADD_TODO');
todoStore.dispatch({
  type: 'ADD_TODO',
  id:2,
  text: 'Learn German'
});
console.log('Current State:');
console.log(todoStore.getState()); //[{todo 2}]
console.log('--------------');
console.log('Dispatching ADD_TODO');
todoStore.dispatch({
  type: 'ADD_TODO',
  id:3,
  text: 'Practice Speech'
});
console.log(todoStore.getState()); //[{todo 2}, {todo 3}]
console.log('--------------');
console.log('Dispatching Toggle Todo');
todoStore.dispatch({
  type: 'TOGGLE_TODO',
  id: 3
});
console.log(todoStore.getState()); //[{todo 2}, {todo 3 done}]
console.log('---------------');
console.log('Dispatching Visibility Filter');
todoStore.dispatch({
  type: 'SET_VISIBILITY_FILTER',
  filter: 'SHOW_COMPLETED'
});
console.log(todoStore.getState());
console.log('---------------');
console.log('');

const generateId = () => {
  let todoId = 4;
  const obj = {};
  obj.id = 4;
  obj.getId = () => {
    return obj.id++;
  }
  return obj;
};

const idGenerator = generateId();

// class Todo extends React.Component {
//   constructor(props){
//     super(props);
//     this.textInput = null;
//   }
//   componentDillMount() {
//     this.textInput.focus();
//   }
//   render(){
//     return (
//       <div>
//         <div>This is an todo app </div>
//         <input type="text" ref={input=>{this.textInput=input;}} />
//         <button onClick={()=>{
//           todoStore.dispatch({
//             type: 'ADD_TODO',
//             text: this.textInput.value,
//             id: idGenerator.getId()
//           });
//           console.log(todoStore.getState());
//           console.log('todo input');
//         }}>Add todo</button>
//         <ul>
//           {this.props.todos.map(todo=><li key={todo.id}>{todo.text}{todo.id}</li>)}

//         </ul>
//       </div>
//     );
//   }
// }

//content between JSX open/closing tags are passed as props.children
// a link component dispatching filter action, rendering custom text passed beteen FilterText

//Have a presentational link component and filter link container
const Link = ({active, children, onFilterClick}) => {
  if (active) {
    return <span>{children}</span>
  }
  return (
    <a href='#' onClick={onFilterClick}>{children}</a>
  );
}

//Create the new FilterLink as a class container component
class FilterLink extends React.Component {

  componentDidMount(){
    this.unsubscribe = store.subscribe(()=>{
      this.forceUpdate();
    });
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  render(){
    const {filter, children} = this.props;
    const state = store.getState();
    const onFilterClick = (e)=>{
      e.preventDefault();
      store.dispatch({
        type: "SET_VISIBILITY_FILTER",
        filter
      });
    };
    return(
      <Link active={filter===state.visibilityFilter} onFilterClick={onFilterClick}>
        {children}
      </Link>
    );

  }
}

// a function that filters the todos to display based on the filter state
const getVisibleTodos = (todos, filter) => {
  switch(filter) {
    case "SHOW_COMPLETED":
      return todos.filter(todo=>todo.completed);
    case "SHOW_ACTIVE":
      return todos.filter(todo=>!todo.completed);
    default:
      return todos;
  }
};


// const TodoItem = ({todo}) => {
//   if (todo.completed){
//     return <strike>{todo.text}</strike>;
//   }
//   return <span>{todo.text}</span>;
// };

const Todo = ({onClick, completed, text}) => {
  return (
    <li
      onClick={onClick}
      style={{textDecoration: completed?'line-through': 'none'}}>
      {text}
    </li>
  );
};

const TodoList = ({todos, onClick}) => {
  console.log('todolist debug',todos);
  return (
    <ul>
      {todos.map(todo=><Todo key={todo.id} {...todo} onClick={()=>onClick(todo)}/>)}
    </ul>
  );
};

const TodoPanel = ({store}) => {
  let textInput = null;
  const onAddClick = (textInput)=>{
    store.dispatch({
      type: 'ADD_TODO',
      text: textInput.value,
      id: idGenerator.getId()
    });
    textInput.value = '';
  };

  return (
    <div>
      <div>This is an todo app </div>
      <input type="text" ref={input=>{textInput=input;}} />
      <button onClick={()=>onAddClick(textInput)}>Add todo</button>
    </div>
  );
};

const Footer = ({store}) => {
  return (
    <p>
      <FilterLink filter={'SHOW_ALL'} store={store}>All</FilterLink>{',  '}
      <FilterLink filter={'SHOW_COMPLETED'} store={store}>Completed</FilterLink>{',  '}
      <FilterLink filter={'SHOW_ACTIVE'} store={store}>Active</FilterLink>
    </p>
  );
};

// Separate TodoList into a separate VisibleTodo container and presenatational component
class VisibleTodoList extends React.Component {
  componentDidMount(){
    this.unsubscribe = store.subscribe(()=>{
      this.forceUpdate();
    });
  }
  componentWillUnmount(){
    this.unsubscribe();
  }
  render(){
    const {todos, visibilityFilter} = store.getState();
    const filteredTodos = getVisibleTodos(todos, visibilityFilter);
    const onClick = (todo)=>{store.dispatch({
      type:'TOGGLE_TODO',
      id: todo.id
    });}
    return (
      <TodoList todos={filteredTodos} onClick={onClick}/>
    )

  }
}

const TodoApp = ({store}) => {

    return (
      <div>
        <TodoPanel store={store}/>
        <VisibleTodoList store={store}/>
        <Footer store={store}/>
      </div>
    );
};


export {TodoApp, todoStore};