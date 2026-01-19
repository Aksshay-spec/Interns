import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              placeholder="Username"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register("username", {
                required: "Username required",
                minLength: {
                  value: 3,
                  message: "Minimum 3 characters"
                }
              })}
            />
            {errors.username && (
              <p className="text-sm text-red-500 mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register("email", {
                required: "Email required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email"
                }
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register("password", {
                required: "Password required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters"
                }
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register("confirmPassword", {
                required: "Confirm password",
                validate: (value) =>
                  value === password || "Passwords do not match"
              })}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition">
            Register
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?
          <Link to="/login" className="text-indigo-600 font-semibold ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
