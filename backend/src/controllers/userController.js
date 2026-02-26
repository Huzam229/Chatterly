import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export async function getRecommendedUser(req, res) {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;
    const recommendedUser = await User.find({
      _id: {
        $ne: currentUserId,
        $nin: currentUser.friends,
      },
      isOnboarding: true,
    });
    res.status(200).json({
      success: true,
      recommendedUser,
    });
  } catch (error) {
    console.error("Error in getRecommendedUser Controller", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user._id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage",
      );
    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in getting user friends", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const senderId = req.user._id;
    const { id: recipientId } = req.params;
    // prevent sending request to yourself
    if (senderId === recipientId) {
      return res
        .status(400)
        .json({ message: "You Can't send request to youself." });
    }
    // if user not found
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(400).json({ message: "Recipient not found." });
    }
    // if you are already friend of this user
    if (recipient.friends.includes(senderId)) {
      return res
        .status(400)
        .json({ message: "Yor are already friends with this user." });
    }
    // check if a request i already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: senderId, recipient: recipientId },
        { sender: recipientId, recipient: senderId },
      ],
    });
    if (existingRequest) {
      return res.status(400).json({
        message:
          "A friend request is already exists between you and this user.",
      });
    }
    const createFriendRequest = await FriendRequest.create({
      sender: senderId,
      recipient: recipientId,
    });
    res.status(200).json(createFriendRequest);
  } catch (error) {
    console.error("Error is sending Friend Request: ", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(400).json({ message: "Friend Request not Found!" });
    }

    if (friendRequest.recipient.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this request" });
    }
    friendRequest.status = "accepted";
    await friendRequest.save();

    // add user in friend array
    // $addToSet: adds elements to an array only if they do not already exists.
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });
    res.status(200).json({ message: "Friend Request Accepted" });
  } catch (error) {
    console.error(
      "Error in accepting friend request controller:",
      error.message,
    );
    res.status(500).json({ message: "Internal Serevr Error" });
  }
}

export async function getFriendRequest(req, res) {
  try {
    const incomingRequest = await FriendRequest.find({
      recipient: req.user._id,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePic nativeLanguage learningLanguage",
    );
    const acceptedRequest = await FriendRequest.find({
      recipient: req.user._id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({ incomingRequest, acceptedRequest });
  } catch (error) {
    console.error(
      "Error in. getting friend Request controller:",
      error.message,
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getOutgoingFriendRequest(req, res) {
  try {
    const outgoingRequest = await FriendRequest.find({
      sender: req.user._id,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilePic nativeLanguage learningLanguage",
    );

    res.status(200).json(outgoingRequest);
  } catch (error) {
    console.error(
      "Error in getOutgoingFriendRequest controller: ",
      error.message,
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
}
