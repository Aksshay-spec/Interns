import { useReducer } from "react";
import useFetch from "./hooks/useFetch";
import "./App.css";

const ACTIONS = {
  INCREASE: "INCREASE",
  DECREASE: "DECREASE",
  RESET: "RESET",
};

const reducer = (state, action) => {
  console.log("action " , action)
  switch (action.type) {
    case ACTIONS.INCREASE:
      return { count: state.count + 1 };

    case ACTIONS.DECREASE:
      return { count: Math.max(0, state.count - 1) };

    case ACTIONS.RESET:
      return { count: 0 };

    default:
      return state;
  }
};

function App() {
  const { data, loading, error } = useFetch(
    "https://jsonplaceholder.typicode.com/users"
  );

  const [state, dispatch] = useReducer(reducer, { count: 0 });
 
  return (
    <div className="page">
      {/* Counter */}
      <div className="main-con">
        <h1>Counter App</h1>
        <p>{state.count}</p>

        <div className="btn-group">
          <button onClick={() => dispatch({ type: ACTIONS.INCREASE })}>+</button>
          <button onClick={() => dispatch({ type: ACTIONS.RESET })}>
            Reset
          </button>
          <button onClick={() => dispatch({ type: ACTIONS.DECREASE })}>-</button>
        </div>
      </div>

      
      <div className="user-con">
        <h2>User Names</h2>

        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}

        {data &&
          data.map((user) => (
            <p key={user.id} className="user-name">
              {user.name}
            </p>
          ))}
      </div>
    </div>
  );
}

export default App;
