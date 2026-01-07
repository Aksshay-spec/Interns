import {useState} from 'react';

export const Login = ({setPage}) => {
  const [data,setData] = useState({
    email : "",
    password : ""
  })
  const email = "ak@gmail.com";
  const password = "12345678";

  const onSubmitHandler = (e)=>{
    e.preventDefault();
    if(email == data.email && password == data.password){
      setPage("DashBord")
    }else{
      alert("Enter Valid email or password")
      setData({
        email : "",
        password : ""
      })
    }
    
  }
  return (
    <div className="login-container">
      <div className="aside-image">
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/003/689/228/small/online-registration-or-sign-up-login-for-account-on-smartphone-app-user-interface-with-secure-password-mobile-application-for-ui-web-banner-access-cartoon-people-illustration-vector.jpg"
          alt="login-image"
        />
      </div>
      <div className="form">
        <form onSubmit={onSubmitHandler} autoComplete="off" method="post">
          <h2 className='title'>Login</h2>
          <div className="email-input">
            <label className='label' htmlFor="email">Email</label>
            <br />
            <input
            className='input-login'
              id="email"
              type="email"
              value={data.email}
              onChange={(e)=>setData({...data,email : e.target.value})}
              placeholder="Enter Email"
              required
            />
          </div>
          <div className="pass-input">
            <label className='label' htmlFor="password">Password</label>
            <br />
            <input
              id="password"
              type="password"
              className='input-login'
              value = {data.password}
              onChange = {(e)=>setData({...data,password : e.target.value})}
              placeholder="Enter Your Password"
              required
            />
          </div>
          <button className='btn-login' type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login
