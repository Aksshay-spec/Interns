import { useEffect, useState } from 'react'
import { quizData } from '../data'

export default function Quiz({subject,setScore,onFinish}){
  const q=quizData[subject]
  const [i,setI]=useState(0)
  const [sel,setSel]=useState('')
  const [t,setT]=useState(300)

  useEffect(()=>{
    const timer=setInterval(()=>{
      setT(v=>{
        if(v===1) onFinish()
        return v-1
      })
    },1000)
    return ()=>clearInterval(timer)
  },[onFinish])

  const next=()=>{
    if(sel===q[i].ans) setScore(s=>s+1)
    setSel('')
    if(i===q.length-1) onFinish()
    else setI(i+1)
  }

  return (
    <div className="container">
      <div className="timer">Time Left: {Math.floor(t/60)}:{t%60}</div>
      <h3>{q[i].q}</h3>
      {q[i].options.map(o=>(
        <div className="option" key={o}>
          <input type="radio" checked={sel===o} onChange={()=>setSel(o)} /> {o}
        </div>
      ))}
      <button onClick={next} disabled={!sel}>Next</button>
    </div>
  )
}
