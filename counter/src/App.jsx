/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useReducer, useRef, useState } from "react";
import "./App.css";

const reducer = (state, action) => {
  switch (action.type) {
    case "INCREMENT":
      return state < 50 ? state + 1 : state;
    case "DECREMENT":
      return state > 0 ? state - 1 : state;
    default:
      return state;
  }
};

function App() {

  const [count, dispatch] = useReducer(reducer, 0);

  const [message, setMessage] = useState("");


  const counterRef = useRef(null);

 
  useEffect(() => {
    if (count === 50) {
      setMessage("Max limit reached 🚫");
    } else if (count === 0) {
      setMessage("Min limit reached 🚫");
    } else {
      setMessage("");
    }

    counterRef.current.classList.add("pulse");
    setTimeout(() => {
      counterRef.current.classList.remove("pulse");
    }, 200);
  }, [count]);

  return (
    <div className="container">
      <h1>Counter</h1>

      <div ref={counterRef} className="counter">
        {count}
      </div>

      <div className="buttons">
        <button
          className="btn minus"
          onClick={() => dispatch({ type: "DECREMENT" })}
          disabled={count === 0}
        >
          –
        </button>

        <button
          className="btn plus"
          onClick={() => dispatch({ type: "INCREMENT" })}
          disabled={count === 50}
        >
          +
        </button>
      </div>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default App;
