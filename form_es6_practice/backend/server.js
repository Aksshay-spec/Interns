import express from 'express';
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


app.post("/add", (req, res) => {
   try {
     const { name, age, phone } = req.body;
    if (!name || !age || !phone) {
        return res.status(400).json({
            success: false,
            message: "please enter all field"
        })
    }

    fs.readFile("./data.json", (err, data) => {
        const students = data ? JSON.parse(data) : [];

        const newStudent = {
            id: Math.floor(Math.random() * 10000),
            name,
            age,
            phone
        }
        students.push(newStudent);
        fs.writeFile("./data.json", JSON.stringify(students, null, 2), () => {
            res.status(200).json({
                success: true,
                message: "Student added successfully",
                students
            });
        });

    })
   } catch (error) {
    console.log("Error in adding student" , error.message);
   }
})

app.get("/students",(req,res)=>{
   try {
     return fs.readFile("./data.json",(err,data)=>{
        res.status(200).json({
            success : true , 
            message : "successfully fetched students",
            data : JSON.parse(data)
        })
    })
   } catch (error) {
        console.log("Error in fetching students" , error.message);

   }
})

app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`)
})