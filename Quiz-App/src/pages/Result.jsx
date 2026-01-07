import React from 'react'

export const Result = ({setPage,score}) => {
  return (
   <div className='quiz-main-container'>
    <div className='result-container'>
      <h4>Your Score</h4>
      <p>{score} / 5</p>
      <button onClick={()=>setPage("DashBord")} className='btn-que'>Go to Home</button>
    </div>
    </div>
  )
}

export default Result