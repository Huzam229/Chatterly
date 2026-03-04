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
import ChatLoader from "../components/ChatLoader";
import VideoCallButton from "../components/VideoCallButton";

export const ChatPage = () => {
  const { id: userId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(null);
  const { authUser } = useAuthUser();
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // this will run only when authUser is available. This will convert anything into boolean either true or false
  });
  const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;
      try {
        console.log("Initializing the stream chat client....");
        const client = StreamChat.getInstance(STREAM_API_KEY);
        // 🔴 Disconnect if already connected (important)
        if (client.userID) {
          await client.disconnectUser();
        }

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token,
        );
        // Create a Channel
        const channelId = [authUser._id, userId].sort().join("-");
        // if I start the chat channelId : [myId, userId]
        // if you start the chat channelId : [yourId, myId]
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, userId],
        });
        await currChannel.watch();
        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.log("Error initializing chat: ", error);
      } finally {
        setLoading(false);
      }
    };
    initChat();
  }, [tokenData, authUser, userId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });
      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-full w-full flex flex-1 min-h-0">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full h-full relative flex flex-col min-h-0">
            <VideoCallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};
