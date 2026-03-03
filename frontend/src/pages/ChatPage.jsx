import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getStreamToken } from "../lib/api";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

export const ChatPage = () => {
  const { id: userId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(null);
  const { authUser } = useAuthUser();
  const { data: streamToken } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // this will run only when authUser is available. This will convert anything into boolean either true or false
  });
  const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

  useEffect(() => {
    const initChat = async () => {
      if (!streamToken?.token || !authUser) return;

      try {
        console.log("Initializing the stream chat client....");
        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          streamToken.token,
        );
        // Create a Channel
        const channelId = [authUser._id, userId.sort().join("-")];
        // if I start the chat channelId : [myId, userId]
        // if you start the chat channelId : [yourId, myId]

        const currChannel = client.channel("message", channelId, {
          members: [authUser._id, userId],
        });
        await currChannel.watch();
        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.log("Error initializing chat: ", error);
        toast.error("Could not connect to chat. Please try again");
      } finally {
        setLoading(false);
      }
    };
  }, []);

  console.log(streamToken);

  return <div>ChatPage</div>;
};
