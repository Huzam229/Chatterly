import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";
const useLogout = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["authUser"], null); // clear cache
      queryClient.invalidateQueries(["authUser"]); // optional
    },
  });
  return { logoutMutation: mutate };
};

export default useLogout;
