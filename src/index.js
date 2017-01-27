import { createStore, combineReducers } from "Redux";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const Link = ({
  active,
  children,
  onClick
}) => {
  if (active) {
    return <span>{children}</span>;
  };

  return (
    <a href="#" onClick={e => {
      e.preventDefault();
      onClick()
    }}>
      {children}
    </a>
  );
};

class FilterLink extends Component {

  componentDidMount() {
    const { store } = this.props;
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate();
    })
  }

  componentWillUnMount() {
    this.unsubscribe();
  }

  render () {
    const props = this.props;
    const store = props.store;
    const state = store.getState();

    return (
      <Link active = {state.visibilityFilter === props.filter}
      onClick={() => {
        store.dispatch({
          type: "SET_VISIBILITY_FILTER",
          filter: props.filter
        })
      }}>
        {props.children}
      </Link>
    );
  }
}

const Footer = ({store}) => (
    <p>
      Show
      {' '}
      <FilterLink store={store} filter="SHOW_ALL">All</FilterLink>
      {' '}
      <FilterLink store={store} filter="SHOW_COMPLETED">Completed</FilterLink>
      {' '}
      <FilterLink store={store} filter="SHOW_ACTIVE">Active</FilterLink>
    </p>
);

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

let nextTodoId = 0;

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

class VisibleTodoList extends Component {
  componentDidMount() {
    const { store } = this.props;
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate();
    })
  }

  componentWillUnMount() {
    this.unsubscribe();
  }

  render () {
    const props = this.props;
    const store = props.store;
    const state = store.getState();
    return (
      <TodoList
        todos={getVisibleTodos(state.visibilityFilter, state.todos)}
        onTodosClick={id => store.dispatch({
          type: "TOGGLE_TODO",
          id
        })}/>
    );
  }
}

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
  store
}) => {
  let input;
  return (
    <div>
      <input ref={node => {
        input=node;
      }}/>
      <button onClick={() => {
            store.dispatch({
              type: "ADD_TODO",
              id: nextTodoId++,
              text: input.value
            });
            input.value = '';
          }
        }>
        Add Todo
      </button>
    </div>
  );
};

const TodoApp = ({store}) => (
  <div>
    <AddTodo store={store}/>
    <VisibleTodoList store={store}/>
    <Footer store={store}/>
  </div>
);

ReactDOM.render(
  <div>
    <TodoApp store={createStore(todoApp)}/>
  </div>,
  document.getElementById('root')
);
