import Team from "../models/Team.js";
import Student from "../models/Student.js"


export const addTeam = async (req,res)=>{
    const {teamName , teamLeader} = req.body;

    if(!teamName || !teamLeader) {
        return res.status(400).json({
            success : false,
            message : "fields cannot be empty"
        })
    }

    const team = await Team.create({
        teamName,
        teamLeader,
        createdBy : req.user.id
    })
    // console.log("data",teamLeader)

    return res.status(200).json({
        success : true,
        team,
        message : "Team Created Successfully"
    })
}

export const getTeams = async (req,res) =>{
    const teams = await Team.find({createdBy : req.user.id}).populate("createdBy").populate("teamLeader").populate("teamMembers")
    return res.status(200).json({
        success : true , 
        teams,
    })
}

export const addTeamMembers = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { studentIds } = req.body;
    const managerId = req.user.id; 

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({
        message: "Please select at least one student",
      });
    }


    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

 
    if (team.teamLeader.toString() !== managerId.toString()) {
      return res.status(403).json({
        message: "You are not allowed to add members to this team",
      });
    }


    const availableStudents = await Student.find({
      _id: { $in: studentIds },
      isAvailable: true,
    });

    if (availableStudents.length !== studentIds.length) {
      return res.status(400).json({
        message: "One or more students are already assigned to another team",
      });
    }

    const availableStudentIds = availableStudents.map(
      (student) => student._id
    );

  
    await Team.findByIdAndUpdate(
      teamId,
      {
        $addToSet: {
          teamMembers: { $each: availableStudentIds },
        },
      },
      { new: true }
    );

   
    await Student.updateMany(
      { _id: { $in: availableStudentIds } },
      { $set: { isAvailable: false } }
    );

    return res.status(200).json({
      message: "Team members added successfully",
    });
  } catch (error) {
    console.error("Add team members error:", error);
    return res.status(500).json({
      message: "Server error while adding team members",
    });
  }
};

export const removeTeamMember = async (req, res) => {
  try {
    const { teamId, studentId } = req.params;
    const managerId = req.user.id;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    if (team.teamLeader.toString() !== managerId.toString()) {
      return res.status(403).json({
        message: "You are not allowed to remove members from this team",
      });
    }

    if (!team.teamMembers.includes(studentId)) {
      return res.status(400).json({
        message: "This student is not a member of this team",
      });
    }

    // Remove student from team
    await Team.findByIdAndUpdate(
      teamId,
      {
        $pull: {
          teamMembers: studentId,
        },
      },
      { new: true }
    );

    // Set student as available for other teams
    await Student.findByIdAndUpdate(
      studentId,
      { $set: { isAvailable: true } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Team member removed successfully",
    });
  } catch (error) {
    console.error("Remove team member error:", error);
    return res.status(500).json({
      message: "Server error while removing team member",
    });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const managerId = req.user.id;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    if (team.teamLeader.toString() !== managerId.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete this team",
      });
    }

    if (team.teamMembers && team.teamMembers.length > 0) {
      await Student.updateMany(
        { _id: { $in: team.teamMembers } },
        { $set: { isAvailable: true } }
      );
    }

    await Team.findByIdAndDelete(teamId);

    return res.status(200).json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (error) {
    console.error("Delete team error:", error);
    return res.status(500).json({
      message: "Server error while deleting team",
    });
  }
};
