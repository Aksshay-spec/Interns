import { useSelector, useDispatch } from "react-redux"
import { toggleTheme } from "./redux/actions"
import "./App.css"

function App() {
  const darkMode = useSelector(state => state.darkMode)
  const dispatch = useDispatch()

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <div className="card">
        <h1>{darkMode ? "Dark Mode 🌙" : "Light Mode ☀️"}</h1>
        <p>Redux without Toolkit</p>
        <button onClick={() => dispatch(toggleTheme())}>
          Toggle Theme
        </button>
      </div>
    </div>
  )
}

export default App
