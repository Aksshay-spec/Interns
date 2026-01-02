import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Main from "./components/Hero";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <div className="layout">
        <Sidebar />
        <Main />
      </div>
    </>
  );
}

export default App;
