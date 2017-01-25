import { createStore, combineReducers } from "Redux";


const todo = (state = {}, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return {text: action.text, id: action.id, completed:false};
    case "TOGGLE_TODO":
      if(state.id != action.id) {
        return state;
      } else {
        return Object.assign({}, state, {completed: !state.completed});
      }
    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch(action.type) {
    case "ADD_TODO":
      return [...state,
        todo(undefined, action)
      ];
    case "TOGGLE_TODO":
      return state.map(todo1 => todo(todo1, action));
    default:
      return state;
  }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case "SET_VISIBILITY_FILTER":
      return action.filter;
    default:
      return state;
  }
};

const todoApp = combineReducers({
  todos,
  visibilityFilter
});

// const todoApp = (state = [], action) => {
//   return {
//     todos: todos(state.todos, action),
//     visibilityFilter: visibilityFilter(state.visibilityFilter, action)
//   };
// };


let store = createStore(todoApp);

console.log("------Initial state------");
console.log(store.getState());

store.dispatch({
  type: "ADD_TODO",
  text: "Buy Eggs",
  id: 0
});
console.log("------After 1st ADD_TODO------");
console.log(store.getState());

store.dispatch({
  type: "ADD_TODO",
  text: "Buy Milk",
  id: 1
});
console.log("------After 2nd ADD_TODO------");
console.log(store.getState());

store.dispatch({
  type: "TOGGLE_TODO",
  id: 1
});

console.log("------After TOGGLE_TODO------");
console.log(store.getState());

store.dispatch({
  type: "SET_VISIBILITY_FILTER",
  filter: "SHOW_COMPLETED"
});

console.log("------After SET_VISIBILITY_FILTER------");
console.log(store.getState());
