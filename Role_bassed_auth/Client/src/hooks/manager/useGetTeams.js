import { useQuery} from '@tanstack/react-query';
import { getTeamsApi } from "@/services/manager.api";

export const useGetTeams = ()=>{
    return useQuery({
        queryKey : ["manager-teams"],
        queryFn :getTeamsApi

    })
}

