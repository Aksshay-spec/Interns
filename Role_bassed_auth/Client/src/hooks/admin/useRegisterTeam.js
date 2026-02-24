import { useQueryClient, useMutation } from "@tanstack/react-query";
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
        onSuccess : ()=>{
            qc.invalidateQueries(['admin-teams'])
            qc.invalidateQueries(['manager-teams'])
        }
    })
}