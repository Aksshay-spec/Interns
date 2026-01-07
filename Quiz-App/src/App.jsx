import {useState} from "react"
import Login from "./pages/Login"
import DashBord from "./pages/DashBord"
import Question from "./pages/Questions"
import Result from "./pages/Result"
import './App.css'

function App() {
  
   const [page,setPage] = useState("login");
   const [topic,setTopic] = useState("");
   const [score,setScore] = useState(0);




  return (
    <>
      {page === "login" && <Login  setPage={setPage} />}
      {page === "DashBord" &&  <DashBord setTopic={setTopic}  setPage={setPage} /> }
      {page == "Questions" && <Question topic={topic} setPage={setPage} setScore={setScore} />}
      {page == "Result" && <Result topic={topic} setPage={setPage} score = {score}/>}
    </>
  )
}

export default App
