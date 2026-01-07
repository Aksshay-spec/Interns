export default function Login({onLogin}){
  let u='', p=''
  return (
    <div className="container">
      <h2>Login</h2>
      <input placeholder="Username" onChange={e=>u=e.target.value} />
      <input type="password" placeholder="Password" onChange={e=>p=e.target.value} />
      <button onClick={()=>u==='darshit'&&p==='12345'?onLogin():alert('Invalid Credentials')}>
        Login
      </button>
    </div>
  )
}
