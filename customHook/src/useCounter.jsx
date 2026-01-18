import { useReducer, useEffect, useState } from "react";

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

export function useCounter() {
  const [count, dispatch] = useReducer(reducer, 0);
  const [message, setMessage] = useState("");

  // 
  useEffect(() => {
    if (count === 50) {
      setMessage("Max limit reached");
    } else if (count === 0) {
      setMessage("Min limit reached");
    } else {
      setMessage("");
    }
  }, [count]);

  return {
    count,
    message,
    increment: () => dispatch({ type: "INCREMENT" }),
    decrement: () => dispatch({ type: "DECREMENT" }),
  };
}
