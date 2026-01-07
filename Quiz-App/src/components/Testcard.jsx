import React from 'react'

export const Testcard = ({topic,questions,setPage,setTopic}) => {
 

  const onClickHandler = ()=>{
    setTopic(topic)
    setPage("Questions");
  }

  return (
    <div className="card-container">
      <h3 className="card-title">{topic}</h3>
      <p className="card-questions">
        Questions: <span>{questions}</span>
      </p>
      <button onClick={onClickHandler} className="card-btn">Start Test</button>
    </div>
  )
}

export default Testcard