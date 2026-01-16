import { useState, useEffect, useRef } from "react";
import { question } from "../questions";

const Questions = ({ setPage, topic, setScore }) => {
  const questions = question[topic];

  const [selected, setSelected] = useState("");
  const [timer, setTimer] = useState(30);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scoreCount, setScoreCount] = useState(0);

 
  const timerRef = useRef(null);
  const answeredRef = useRef(false);

 
  useEffect(() => {
    setTimer(30);
    setSelected("");
    answeredRef.current = false;
  }, [questionIndex]);


  useEffect(() => {
    if (timer === 0) {
      handleNext();
      return;
    }

    timerRef.current = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timer]);

  function finishQuiz(finalScore) {
    setScore(finalScore);
    setPage("Result");
  }

  function handleNext() {
   
    if (answeredRef.current) return;
    answeredRef.current = true;

    let newScore = scoreCount;

    if (selected && selected === questions[questionIndex].correct) {
      newScore += 1;
      setScoreCount(newScore);
    }
    if (questionIndex === questions.length - 1) {
      finishQuiz(newScore);
    } else {
      setQuestionIndex((prev) => prev + 1);
    }
  }

  return (
   <div className="quiz-main-container">

    <div className="quiz-container">
      <h3>Question {questionIndex + 1}</h3>
      <span>{timer}s</span>

      <h4>{questions[questionIndex].q}</h4>

      {questions[questionIndex].options.map((opt) => (
        <label
          key={opt}
          className={`option ${selected === opt ? "selected" : ""}`}
        >
          <input
            type="radio"
            name="option"
            checked={selected === opt}
            onChange={() => setSelected(opt)}
          />
          {opt}
        </label>
      ))}

      <div className="btn-group">
        <button className="btn-que" onClick={handleNext}>
          Skip
        </button>
        <button
          className="btn-que"
          disabled={!selected}
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
    </div>
  );
};

export default Questions;
