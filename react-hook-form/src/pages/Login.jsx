
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
    <div className="main-con bg-bluish-500 min-h-screen flex justify-center items-center">
      <form className="form-card w-full max-w-[400px] bg-formcolor p-[30px] rounded-xl shadow-2xl" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="title text-center mb-[25px] text-gray-200 text-xl ">Login</h2>

        <div className="input-con flex flex-col mb-1.5">
          <label className="mb-1.5 text-[14px] text-gray-400">Email</label>
          <input
            type="text"
            placeholder="enter your email"
            className="input "
            {...register("email", {
              required: "Email is required",
              pattern: {
                value:
                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Email format is invalid",
              },
            })}
          />
          {errors.email && (
            <p className="err-msg mt-0.5 text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div className="input-con flex flex-col mb-1.5">
          <label className="mb-1.5 text-[14px] text-gray-400">Password</label>
          <input
            type="password"
            placeholder="enter your password"
             className="input"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 4,
                message: "Password must be at least 4 characters",
              },
            })}
          />
          {errors.password && (
            <p className="err-msg mt-0.5 text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        <button type="submit"  disabled={isSubmitting} className="btn">
            {isSubmitting ? "Logging in..." : "Login"}
        </button>
        <p className="text-gray-400 mt-2">Don't have account? <Link className="no-underline" to={'/register'}>Register</Link></p>
      </form>
    </div>
  );
};

export default Login;
