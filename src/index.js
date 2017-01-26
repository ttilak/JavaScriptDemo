import { createStore, combineReducers } from "Redux";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';


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

let store = createStore(todoApp);

let nextTodoId = 0;


const getVisibleTodos = (filter, todos) => {
  switch(filter) {
    case "SHOW_ALL":
      return todos;
    case "SHOW_COMPLETED":
      return todos.filter(todo => todo.completed);
    case "SHOW_ACTIVE":
      return todos.filter(todo => !todo.completed);
    }
}

const Todo = ({
    onClick,
    completed,
    text
  }) => {
    return (
      <li onClick={onClick}
        style = {{textDecoration: completed ? 'line-through': 'none'}}>
        {text}
      </li>
    );
};

const TodoList = ({
  todos,
  onTodosClick
}) => {
  return (
    <ul>
      {todos.map(todo =>
        <Todo
          key={todo.id}
          onClick={() => onTodosClick(todo.id)}
          {...todo}/>
      )}
    </ul>
  );
};

const AddTodo = ({
  onAddClick
}) => {
  let input;
  return (
    <div>
      <input ref={node => {
        input=node;
      }}/>
      <button onClick={() => {
            onAddClick(input.value);
            input.value = '';
          }
        }>
        Add Todo
      </button>
    </div>
  );
};

const FilterLink = ({
  filter,
  currentFilter,
  children,
  onClick
}) => {
  if (filter === currentFilter) {
    return <span>{children}</span>;
  };

  return (
    <a href="#" onClick={e => {
      e.preventDefault();
      onClick(filter)
    }}>
      {children}
    </a>
  );
};

const Footer = ({
  visibilityFilter,
  onFilterClick
}) => (
    <p>
      Show
      {' '}
      <FilterLink filter="SHOW_ALL" currentFilter={visibilityFilter} onClick={onFilterClick}>All</FilterLink>
      {' '}
      <FilterLink filter="SHOW_COMPLETED" currentFilter={visibilityFilter} onClick={onFilterClick}>Completed</FilterLink>
      {' '}
      <FilterLink filter="SHOW_ACTIVE" currentFilter={visibilityFilter} onClick={onFilterClick}>Active</FilterLink>
    </p>
);

const TodoApp = ({
  todos,
  visibilityFilter
}) => (
  <div>
    <AddTodo onAddClick={text =>
      store.dispatch({
        type: "ADD_TODO",
        id: nextTodoId++,
        text
      })
    }/>
    <TodoList
      todos={getVisibleTodos(visibilityFilter, todos)}
      onTodosClick={id => store.dispatch({
        type: "TOGGLE_TODO",
        id
      })}/>
    <Footer
      visibilityFilter={visibilityFilter}
      onFilterClick={filter => {
      store.dispatch({
        type: "SET_VISIBILITY_FILTER",
        filter
      });
    }}/>
  </div>
);

const render = () => {
  ReactDOM.render(
    <div>
      <TodoApp {...store.getState()}/>
    </div>,
    document.getElementById('root')
  );
};

store.subscribe(render);

render();
