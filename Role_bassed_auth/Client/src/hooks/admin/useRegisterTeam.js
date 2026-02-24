import { useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/services/api";

const registerTeam = async (data)=>{

    // console.log("data from register team " , data)
  
        const res = await api.post("/admin/addteam", data);
        // console.log("res from rt", res);
        return res.data
   
}

export const useRegisterTeam = ()=>{
    const qc = useQueryClient();
    return useMutation({
       
        mutationFn : registerTeam,
        onSuccess : (data) =>{
            qc.invalidateQueries(['admin-teams'])
            qc.invalidateQueries(['manager-teams'])
            toast.success(data?.message || "Team created successfully");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to create team");
        },
    })
}