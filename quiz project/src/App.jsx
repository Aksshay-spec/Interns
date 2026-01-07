import { useState } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Quiz from './components/Quiz'
import Result from './components/Result'

export default function App(){
  const [page,setPage]=useState('login')
  const [subject,setSubject]=useState('')
  const [score,setScore]=useState(0)

  return (
    <>
      {page==='login' && <Login onLogin={()=>setPage('dashboard')} />}
      {page==='dashboard' && (
        <Dashboard onSelect={(s)=>{setSubject(s);setScore(0);setPage('quiz')}} />
      )}
      {page==='quiz' && (
        <Quiz subject={subject} setScore={setScore} onFinish={()=>setPage('result')} />
      )}
      {page==='result' && (
        <Result score={score} onRestart={()=>setPage('dashboard')} />
      )}
    </>
  )
}
