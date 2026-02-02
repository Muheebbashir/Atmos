import {useQuery} from "@tanstack/react-query";
import { fetchUserPlaylist } from "../api/userApi";

export const useUserPlaylist = (token: string | null) => {
    return useQuery({
        queryKey: ['userPlaylist', token],
        queryFn: async () => {
            if (!token) {
                throw new Error("No token provided");
            }
            const result = await fetchUserPlaylist(token);
            return result;
        },
        enabled: !!token,
        retry: false,
        staleTime: 0,
        refetchOnMount: true,
    });
}