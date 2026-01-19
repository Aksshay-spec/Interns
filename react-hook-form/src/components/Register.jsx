
import { useForm } from "react-hook-form";

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors } 
  } = useForm();

  const password = watch("password");

  const onSubmit = (data) => {
    console.log("Register Data:", data);
  };

  return (
    <div className="form-box">
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="Username"
          {...register("username", {
            required: "Username required",
            minLength: {
              value: 3,
              message: "Minimum 3 characters"
            }
          })}
        />
        {errors.username && (
          <p className="error">{errors.username.message}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          {...register("email", {
            required: "Email required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email"
            }
          })}
        />
        {errors.email && <p className="error">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password"
          {...register("password", {
            required: "Password required",
            minLength: {
              value: 6,
              message: "Minimum 6 characters"
            }
          })}
        />
        {errors.password && (
          <p className="error">{errors.password.message}</p>
        )}

        <input
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword", {
            required: "Confirm password",
            validate: (value) =>
              value === password || "Passwords do not match"
          })}
        />
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword.message}</p>
        )}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
