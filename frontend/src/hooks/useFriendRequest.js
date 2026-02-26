import { useQuery } from "@tanstack/react-query";
import { getUserFriendRequest } from "../lib/api";
const useFriendRequest = () => {
  const { data: userFriendRequest, isLoading } = useQuery({
    queryKey: ["friendRequest"],
    queryFn: getUserFriendRequest,
  });

  return { userFriendRequest, isLoading };
};
export default useFriendRequest;
