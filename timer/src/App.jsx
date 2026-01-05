import { useState,useEffect } from 'react'

import './App.css'

function App() {
  const [timer, setTimer] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
      console.log("stop");
    };
  }, []);
  return (
    <div className="main">
      <h2>Timer: {timer}s</h2>
    </div>
  );
}

export default App
