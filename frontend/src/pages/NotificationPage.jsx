import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest } from "../lib/api";
import { UserCheckIcon } from "lucide-react";
import { capitialize, getLanguageFlag } from "../lib/utils";
import useFriendRequest from "../hooks/useFriendRequest";

export const NotificationPage = () => {
  const queryClient = useQueryClient();

  const { userFriendRequest, isLoading } = useFriendRequest();

  const { mutate: acceptFriendRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequest"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingFriendRequest = userFriendRequest?.incomingRequest || [];
  const acceptedFriendRequest = userFriendRequest?.acceptedRequest || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          Notifications
        </h1>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {incomingFriendRequest.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Friend Request
                  <span className="badge badge-primary ml-2">
                    {incomingFriendRequest.length}
                  </span>
                </h2>
                <div className="space-y-3">
                  {incomingFriendRequest.map((request) => (
                    <div
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                      key={request._id}
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between gap-6">
                          <div className="flex items-center gap-3">
                            <div className="avatar w-14 h-14 rounded-full bg-base-200">
                              <img
                                src={request.sender.profilePic}
                                alt={request.sender.fullName}
                              />
                            </div>
                            <h3 className="font-semibold">
                              {request.sender.fullName}
                            </h3>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              <span className="badge badge-outline badge-md">
                                Native:{" "}
                                <img
                                  src={getLanguageFlag(
                                    request.sender.nativeLanguage,
                                  )}
                                  className="h-3 m-2 inline-block"
                                />
                                {capitialize(request.sender.nativeLanguage)}
                              </span>
                              <span className="badge badge-outline badge-md">
                                Learning:{" "}
                                <img
                                  src={getLanguageFlag(
                                    request.sender.learningLanguage,
                                  )}
                                  className="h-3 m-2 inline-block"
                                />
                                {capitialize(request.sender.learningLanguage)}
                              </span>
                            </div>
                          </div>
                          <button
                            className="btn btn-primary btn-sm px-6"
                            onClick={() =>
                              acceptFriendRequestMutation(request._id)
                            }
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};
