import { createStore, combineReducers } from "Redux";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';

let nextTodoId = 0;

const setVisibilityFilter = (filter) => {
  return ({
    type: "SET_VISIBILITY_FILTER",
    filter
  });
};

const addTodo = (text) => {
  return({
    type: "ADD_TODO",
    id: nextTodoId++,
    text
  });
};

const toggleTodo = (id) => {
  return ({
    type: "TOGGLE_TODO",
    id
  });
}

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

const mapStateToLinkProps = (state, ownProps) => {
  return ({
    active: state.visibilityFilter === ownProps.filter,
    children: ownProps.children
  });
}

const mapDispatchToLinkProps = (dispatch, ownProps) => {
  return ({
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter))
    }
  });
}

const FilterLink = connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(Link);

// class FilterLink extends Component {
//
//   componentDidMount() {
//     const { store } = this.context;
//     this.unsubscribe = store.subscribe(() => {
//       this.forceUpdate();
//     })
//   }
//
//   componentWillUnMount() {
//     this.unsubscribe();
//   }
//
//   render () {
//     const props = this.props;
//     const store = this.context.store;
//     const state = store.getState();
//
//     return (
//       <Link active = {state.visibilityFilter === props.filter}
//       onClick={() => {
//         store.dispatch({
//           type: "SET_VISIBILITY_FILTER",
//           filter: props.filter
//         })
//       }}>
//         {props.children}
//       </Link>
//     );
//   }
// }

const Footer = () => (
    <p>
      Show
      {' '}
      <FilterLink filter="SHOW_ALL">All</FilterLink>
      {' '}
      <FilterLink filter="SHOW_COMPLETED">Completed</FilterLink>
      {' '}
      <FilterLink filter="SHOW_ACTIVE">Active</FilterLink>
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

let AddTodo = ({ dispatch }) => {
  let input;
  return (
    <div>
      <input ref={node => {
        input=node;
      }}/>
      <button onClick={() => {
            dispatch(addTodo(input.value));
            input.value = '';
          }
        }>
        Add Todo
      </button>
    </div>
  );
};

AddTodo = connect()(AddTodo);

const mapStateToTodoListProps = (state) => {
  return ({
    todos: getVisibleTodos(state.visibilityFilter, state.todos)
  });
}
const mapDispatchToTodoListProps = (dispatch) => {
  return ({
    onTodosClick: (id) => {
      dispatch(toggleTodo(id))}
  });
}
const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
)(TodoList);

// class VisibleTodoList extends Component {
//   componentDidMount() {
//     const { store } = this.context;
//     this.unsubscribe = store.subscribe(() => {
//       this.forceUpdate();
//     })
//   }
//
//   componentWillUnMount() {
//     this.unsubscribe();
//   }
//
//   render () {
//     const props = this.props;
//     const store = this.context.store;
//     const state = store.getState();
//     return (
//       <TodoList
//         todos={getVisibleTodos(state.visibilityFilter, state.todos)}
//         onTodosClick={id => store.dispatch({
//           type: "TOGGLE_TODO",
//           id
//         })}/>
//     );
//   }
// }
//
// VisibleTodoList.contextTypes = {
//   store: React.PropTypes.object
// }

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

const TodoApp = () => (
  <div>
    <AddTodo/>
    <VisibleTodoList/>
    <Footer/>
  </div>
);

ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp/>
  </Provider>,
  document.getElementById('root')
);
