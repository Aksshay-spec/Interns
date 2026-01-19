import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors , isSubmitting },
    reset
  } = useForm();

  const onSubmit = (data) => {
    console.log(" login data", data);
    reset();
  };

  return (
    <div className="main-con">
      <form className="form-card" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="title">Login</h2>

        <div className="input-con">
          <label>Email</label>
          <input
            type="text"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value:
                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Email is invalid",
              },
            })}
          />
          {errors.email && (
            <p className="err-msg">{errors.email.message}</p>
          )}
        </div>

        <div className="input-con">
          <label>Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 4,
                message: "Password must be at least 4 characters",
              },
            })}
          />
          {errors.password && (
            <p className="err-msg">{errors.password.message}</p>
          )}
        </div>

        <button type="submit"  disabled={isSubmitting} className="btn">
            {isSubmitting ? "Lo gging in..." : "Login"}
        </button>
        <p>Don't have account? <Link to={'/register'}>Register</Link></p>
      </form>
    </div>
  );
};

export default Login;
