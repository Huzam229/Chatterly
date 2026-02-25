import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getRecommendedUser,
  getUserFriends,
  outgoingFriendRequest,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { UserIcon } from "lucide-react";
import FriendCard from "../components/FriendCard";
import NoFriendYet from "../components/NoFriendYet";

export const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequest, setOutgoingReguest] = useState(new Set());
  const { isLoading: loadingFriend = false, data: friends = [] } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const {
    isLoading: loadingRecommendedUser = false,
    data: recommendedUser = [],
  } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUser,
  });

  const { data: outgoingFriendReq } = useQuery({
    queryKey: ["outgoingFriendRequest"],
    queryFn: outgoingFriendRequest,
  });

  const { mutate: friendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendRequest"] });
    },
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReq && outgoingFriendReq.length > 0) {
      outgoingFriendReq.forEach((req) => {
        outgoingIds.add(req.id);
      });
    }
    setOutgoingReguest(outgoingIds);
  }, [outgoingFriendReq]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UserIcon className="size-4 mr-2" />
            Friend Requests
          </Link>
        </div>
        {loadingFriend ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendYet />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friends} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
