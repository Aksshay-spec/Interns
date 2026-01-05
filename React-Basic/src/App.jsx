import { useState,useEffect } from 'react'
import SideBar from "./components/SideBar"
import Header from "./components/Header"

import './App.css'

function App() {
 const [data, setData] = useState(null);
  const fetchData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/students")
      const result = await response.json();
      setData(result);
      
      }catch (error) {
      console.error("Error fetching data:", error);
    }}
  useEffect(() => {
    
    fetchData();
  
  } , []);
  return (
    <>
    <Header />
    <SideBar data={data} />
    </>
  )
}

export default App
