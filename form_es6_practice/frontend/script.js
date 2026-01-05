document.addEventListener("DOMContentLoaded", () => {

const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const phoneInput = document.getElementById('phone');
const form = document.getElementById('studentForm');
const tableBody = document.getElementById('tableBody');

const addStudent = async (student)=>{
    await fetch("http://127.0.0.1:5000/add",{
       method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(student)
    })
    console.log("add student")
}

const showStudent = async ()=>{
    const response = await fetch("http://127.0.0.1:5000/students");
    const students = await response.json();
    console.log("students",students)
     tableBody.innerHTML = students.data
        .map(({ name, age, phone }) => `
          <tr>
            <td>${name}</td>
            <td>${age}</td>
            <td>${phone}</td>
          </tr>
        `)
        .join("");


}

form.addEventListener("submit",(e)=>{
    e.preventDefault()
    const name = nameInput.value
    const age = ageInput.value
    const phone = phoneInput.value
    const newStudent = {
        name,
        age,
        phone
    }
    addStudent(newStudent)
form.reset();
    showStudent();
})
showStudent();
});