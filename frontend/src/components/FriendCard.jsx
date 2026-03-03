import { Link, useLocation } from "react-router";
import { capitialize, getLanguageFlag } from "../lib/utils";
import { useState } from "react";
import useRemoveFriend from "../hooks/useRemoveFriend";
import ConfirmModal from "./ConfirmModal";

const FriendCard = ({ friend }) => {
  const [expanded, setExpanded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const nativeFlag = getLanguageFlag(friend.nativeLanguage);
  const learningFlag = getLanguageFlag(friend.learningLanguage);
  const location = useLocation();
  const currentPath = location.pathname;
  const { removeFriendMutation } = useRemoveFriend();

  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* User Info */}

        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img src={friend.profilePic} alt={friend.fullName} />
          </div>
          <h3 className="font-semibold truncate">
            {capitialize(friend.fullName)}
          </h3>
        </div>

        {/* Country Flag  */}

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {nativeFlag && (
              <img
                src={nativeFlag}
                alt="flag"
                className="h-3 mr-1 inline-block"
              />
            )}
            Native: {capitialize(friend.nativeLanguage)}
          </span>
          <span className="badge badge-secondary text-xs">
            {learningFlag && (
              <img
                src={learningFlag}
                alt="flag"
                className="h-3 mr-1 inline-block"
              />
            )}{" "}
            Learning: {capitialize(friend.learningLanguage)}
          </span>
        </div>

        {currentPath.includes("/friends") && friend.bio && (
          <div>
            <p
              className={`text-sm opacity-70 ${!expanded ? "line-clamp-2" : "line-clamp-none"}`}
            >
              {friend.bio}
            </p>

            {friend.bio.length > 100 && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent event bubbling
                  setExpanded(!expanded);
                }}
                className="text-xs text-blue-500 mt-1"
              >
                {expanded ? "Show Less" : "More"}
              </button>
            )}
          </div>
        )}

        {currentPath.includes("/friends") ? (
          <div className="flex items-center justify-center flex-row gap-4">
            <Link
              to={`/chat/${friend._id}`}
              className="btn btn-outline btn-md "
            >
              Message
            </Link>
            <button
              className="btn btn-warning btn-md"
              onClick={() => setShowConfirm(true)}
            >
              Remove
            </button>
          </div>
        ) : (
          <Link
            to={`/chat/${friend._id}`}
            className="btn btn-outline fixed-bottom w-full"
          >
            Message
          </Link>
        )}
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          removeFriendMutation(friend._id);
          setShowConfirm(false);
        }}
        friendName={capitialize(friend.fullName)}
      />
    </div>
  );
};

export default FriendCard;
