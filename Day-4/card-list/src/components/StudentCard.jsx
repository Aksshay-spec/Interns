import React from "react";

const StudentCard = ({ name, age, course }) => {
  return (
    <div style={{
      border: "1px solid #ccc",
      padding: "10px",
      marginBottom: "10px",
      borderRadius: "6px"
    }}>
      <h3>{name}</h3>
      <p>Age: {age}</p>
      <p>Course: {course}</p>
    </div>
  );
};

export default StudentCard;
