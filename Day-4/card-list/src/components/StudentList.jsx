import React, { useState } from "react";
import StudentCard from "./StudentCard";

const Day4StudentList = () => {
  const [students] = useState([
    { id: 2, name: "akshay", age: 22, course: "react" },
    { id: 3, name: "sunil", age: 20, course: "node" }
  ]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Student Card List</h2>

      {students.map((student) => (
        <StudentCard
          key={student.id}
          name={student.name}
          age={student.age}
          course={student.course}
        />
      ))}
    </div>
  );
};

export default Day4StudentList;
