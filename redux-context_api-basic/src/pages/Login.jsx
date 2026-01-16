import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);

  return (
    <>
      <h2>Login</h2>
      <button onClick={login}>Login</button>
    </>
  );
};

export default Login;
