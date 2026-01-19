
import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";

export default function App() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="container">
      {isLogin ? <Login /> : <Register />}
      <p className="toggle">
        {isLogin ? "New user?" : "Already have an account?"}
        <span onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? " Register" : " Login"}
        </span>
      </p>
    </div>
  );
}
