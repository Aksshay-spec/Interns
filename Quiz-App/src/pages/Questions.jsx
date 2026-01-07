import {useState,useEffect} from 'react'
import {question} from "../questions"


export const Questions = ({setPage,topic,setScore}) => {

  const [selected,setSelected] = useState("");
  const [timer,setTimer] = useState(300);
  const [questionIndex,setQuestionIndex] = useState(0);
  const [scoreCount,setScoreCount] = useState(0);

  const questions = question[topic]

    useEffect(() => {
      setTimer(300);
      setSelected("");
  }, [questionIndex]);

 function finishQuiz (){
    setScore(scoreCount);
    setPage("Result");
  }
  function nextQuestion (){
    if (selected) {
      if (selected === questions[questionIndex].correct) {
        setScoreCount(scoreCount + 1);
      }
    }
    setSelected("");
    if (questionIndex === 4) {
      finishQuiz();
    } else {
      setQuestionIndex(questionIndex + 1);
    }
  };

 useEffect(() => {
    if (timer === 0) {
      nextQuestion();
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  

 

  return (
    <div className='quiz-main-container'>
    <div className='quiz-container'>
        <h3>Question {questionIndex + 1}</h3>
      <span>{timer}s</span>
         <h4>{questions[questionIndex].q}</h4>
      {questions[questionIndex].options.map((opt) => (
        <label key={opt} className={`option ${selected === opt ? "selected" : ""}`}>
          <input
            type="radio"
            name="option"
            value={opt}
            checked={selected === opt}
            onChange={() => setSelected(opt)}
          />
          {opt}
        </label>
      ))}
       <div className="btn-group">
        <button className='btn-que' onClick={nextQuestion}>Skip</button>
        <button className='btn-que' disabled={!selected} onClick={nextQuestion}>
          Next
        </button>
      </div>

    </div>
    </div>
  )
}

export default Questions