import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest } from "../lib/api";
import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  UserCheckIcon,
} from "lucide-react";
import { capitialize, getLanguageFlag } from "../lib/utils";
import useFriendRequest from "../hooks/useFriendRequest";

export const NotificationPage = () => {
  const queryClient = useQueryClient();

  const { userFriendRequest, isLoading } = useFriendRequest();

  const { mutate: acceptFriendRequestMutation } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequest"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  console.log(userFriendRequest);

  const incomingFriendRequest = userFriendRequest?.incomingRequest || [];
  const acceptedFriendRequest = userFriendRequest?.acceptedRequest || [];

  return (
    <div className="container mx-auto max-w-4xl space-y-8">
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          Notifications
        </h1>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {incomingFriendRequest.length > 0 ? (
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
            ) : (
              <div className="card bg-base-200 p-6 text-center">
                <h3 className="font-semibold text-lg mb-2">
                  You're all caught up 🎉
                </h3>
                <p className="text-base-content opacity-70">
                  No new notifications right now. We'll let you know when
                  something arrives.
                </p>
              </div>
            )}
            {/* ACCEPTED REQUESDT NOTIFICATION */}
            {acceptedFriendRequest.length > 0 && (
              <section className="space-y-4 mt-5">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connection
                </h2>
                <div className="space-y-3">
                  {acceptedFriendRequest.map((notification) => (
                    <div
                      key={notification._id}
                      className="card bg-base-200 shadow-sm"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center gap-3">
                          <div className="avatar mt-1 size-10 rounded-full">
                            <img
                              src={notification.recipient.profilePic}
                              alt={notification.recipient.fullName}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-base-content">
                              {notification.recipient.fullName}
                            </h3>
                            <p className="text-sm my-1 mb-1"></p>
                            Accepted your friend request
                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              Recently
                            </p>
                          </div>
                          <div className="badge badge-success">
                            <MessageSquareIcon className="h-3 w-3 mr-1" />
                            New Friend
                          </div>
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
