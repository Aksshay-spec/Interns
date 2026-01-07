export default function Result({score,onRestart}){
  return (
    <div className="container">
      <h2>Quiz Completed 🎉</h2>
      <h3>Your Score: {score} / 5</h3>
      <div className="link" onClick={onRestart}>Go to Dashboard</div>
    </div>
  )
}
