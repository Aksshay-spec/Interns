export const redirectByRole = (role, navigate) => {
  if (role === "admin") {
    navigate("/admin/dashboard");
  } else if (role === "manager") {
    navigate("/manager/dashboard");
  } else if (role === "student") {
    navigate("/student/dashboard");
  } else {
    navigate("/login");
  }
};
