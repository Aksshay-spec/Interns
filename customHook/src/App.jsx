import { useCounter } from "./useCounter";
import "./App.css";

function App() {
  const { count, message, increment, decrement } = useCounter();

  return (
    <div className="container">
      <div>
        <h1>Counter</h1>

        <div className="counter">
          {count}
        </div>

        <div className="buttons">
          <button
            className="btn"
            onClick={decrement}
            disabled={count === 0}
          >
            –
          </button>

          <button
            className="btn"
            onClick={increment}
            disabled={count === 50}
          >
            +
          </button>
        </div>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default App;
