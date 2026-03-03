import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFriend } from "../lib/api";
import toast from "react-hot-toast";

const useRemoveFriend = () => {
  const queryClient = useQueryClient();

  const { mutate: removeFriendMutation } = useMutation({
    mutationFn: removeFriend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      toast.success("Friend removed");
    },
    onError: () => {
      toast.error("Failed to remove friend");
    },
  });
  return { removeFriendMutation };
};

export default useRemoveFriend;
