export default function Dashboard({onSelect}){
  const subjects=['React','JavaScript','CSS']
  return (
    <div className="card-container">
      {subjects.map(s=>(
        <div className="card" key={s}>
          <h3>{s}</h3>
          <button onClick={()=>onSelect(s)}>Start Quiz</button>
        </div>
      ))}
    </div>
  )
}
