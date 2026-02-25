import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getRecommendedUser,
  getUserFriends,
  outgoingFriendRequest,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserIcon,
  UserPlusIcon,
} from "lucide-react";
import FriendCard from "../components/FriendCard";
import NoFriendYet from "../components/NoFriendYet";
import { LANGUAGE_TO_FLAG } from "../constants";

export const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequest, setOutgoingReguest] = useState(new Set());
  const { isLoading: loadingFriend = false, data: friends = [] } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { isLoading: loadingRecommendedUser, data: recommendedUser } = useQuery(
    {
      queryKey: ["users"],
      queryFn: getRecommendedUser,
    },
  );

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
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendYet />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Meet New Learners
                </h2>
                <p className="opacity-70 mt-1">
                  Discover perfect language exchange partners based on your
                  profile
                </p>
              </div>
            </div>
          </div>

          {loadingRecommendedUser ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUser.recommendedUser.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">
                {" "}
                No recommendations available
              </h3>
              <p className="text-base-content opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {recommendedUser.recommendedUser.map((users) => {
                const hasRequestBeenSent = outgoingRequest.has(users._id);

                return (
                  <div
                    key={users._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar size-16 rounded-full">
                          <img src={users.profilePic} alt={users.fullName} />
                        </div>
                        <h3 className="font-semibold truncate">
                          {users.fullName}
                        </h3>
                        {users.location && (
                          <div className="flex items-center text-xs opacity-70 mt-1">
                            <MapPinIcon className="size-3 mr-1" />
                            {users.location}
                          </div>
                        )}
                      </div>
                      {/* Languages with Flag */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary text-xs">
                          {getLanguageFlag(users.nativeLanguage)}
                          Native: {capitialize(users.nativeLanguage)}
                        </span>
                        <span className="badge badge-secondary text-xs">
                          {getLanguageFlag(users.learningLanguage)}
                          Learning: {capitialize(users.learningLanguage)}
                        </span>
                      </div>

                      {/* Bio */}
                      {users.bio && (
                        <p className="text-sm opacity-70 line-clamp-2">
                          {users.bio}
                        </p>
                      )}

                      {/* Action Button - pushed to bottom */}
                      <button
                        className={`btn w-full mt-auto ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                        }`}
                        onClick={() => friendRequestMutation(users._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

function getLanguageFlag(language) {
  if (!language) return null;
  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];
  if (countryCode) {
    return (
      <img
        src={`http://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
}

const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
