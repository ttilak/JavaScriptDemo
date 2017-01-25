import expect from "expect";
import deepFreeze from "deep-freeze";
import { createStore } from "redux";


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
}

const todoApp = (state = [], action) => {
  return {
    todos: todos(state, action),
    visibilityFilter: visibilityFilter(state.visibilityFilter, action)
  };
}

const testAddTodo = () => {
  const stateBefore = [];
  const action = {
    type: "ADD_TODO",
    text: "test",
    id: 0
  };
  const stateAfter = [{
    text: "test",
    id: 0,
    completed: false
  }];

  deepFreeze(action);
  deepFreeze(stateBefore);

  expect(todos(stateBefore, action)).toEqual(stateAfter);
};

const testToggleTodo = () => {
  const stateBefore = [
    {
      id: 0,
      text: "Buy Apples",
      completed: false
    },
    {
      id: 1,
      text: "Buy Milk",
      completed: false
    }
  ];

  const action = {
    type: "TOGGLE_TODO",
    id: 1
  };

  const stateAfter = [
    {
      id: 0,
      text: "Buy Apples",
      completed: false
    },
    {
      id: 1,
      text: "Buy Milk",
      completed: true
    }
  ];

  deepFreeze(action);
  deepFreeze(stateBefore);

  expect(todos(stateBefore, action)).toEqual(stateAfter);
}

testAddTodo();
testToggleTodo();

console.log("All tests passed");
