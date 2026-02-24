import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    teamName : {type : String },
    teamLeader : {type: mongoose.Schema.Types.ObjectId, ref: "Manager"},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    teamMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student", 
      },
    ],
},{
    timestamps : true
})

export default mongoose.model('Team' , teamSchema)