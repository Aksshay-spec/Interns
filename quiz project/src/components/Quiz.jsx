import { useEffect, useState, useRef } from "react";
import { quizData } from "../data";

export default function Quiz({ subject, setScore, onFinish }) {
  const q = quizData[subject];

  const [i, setI] = useState(0);
  const [sel, setSel] = useState("");
  const [t, setT] = useState(300);

  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setT((v) => {
        if (v === 1) {
          clearInterval(timerRef.current);
          onFinish();
        }
        return v - 1;
      });
    }, 1000);
    
    return () => clearInterval(timerRef.current);
  }, [onFinish]);

  const next = () => {
    if (sel === q[i].ans) setScore((s) => s + 1);
    setSel("");

    if (i === q.length - 1) {
      clearInterval(timerRef.current);
      onFinish();
    } else {
      setI(i + 1);
    }
  };

  return (
    <div className="container">
      <div className="timer">
        Time Left: {Math.floor(t / 60)}:{String(t % 60).padStart(2, "0")}
      </div>

      <h3>{q[i].q}</h3>

      {q[i].options.map((o) => (
        <div className="option" key={o}>
          <input
            type="radio"
            checked={sel === o}
            onChange={() => setSel(o)}
          />{" "}
          {o}
        </div>
      ))}

      <button onClick={next} disabled={!sel}>
        {i === q.length - 1 ? "Finish" : "Next"}
      </button>
    </div>
  );
}
