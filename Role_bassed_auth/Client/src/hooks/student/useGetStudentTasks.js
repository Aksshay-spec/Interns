import { useQuery } from "@tanstack/react-query";
import { studentTasks } from "../../services/student.api";

export const useGetStudentTasks = () => {
  return useQuery({
    queryKey: ["student-tasks"],
    queryFn: studentTasks,
  });
};

