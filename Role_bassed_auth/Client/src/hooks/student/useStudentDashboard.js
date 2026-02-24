import { useQuery } from "@tanstack/react-query";
import { studentDashboard } from "../../services/student.api";

export const useStudentDashboard = () => {
  return useQuery({
    queryKey: ["student-dashboard"],
    queryFn: studentDashboard,
  });
};
