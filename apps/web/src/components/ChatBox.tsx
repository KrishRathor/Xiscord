import { selectedChat } from "@/atoms/selectedChat";
import { useSocket } from "@/context/SocketProvider";
import { ChatMessageProps, MessageProps, UserType } from "@/enums";
import { trpc } from "@/utils/trpc";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import jwt from "jsonwebtoken";
import EmojiPicker from "emoji-picker-react";

interface ChatBoxProps {
  email: string;
}

export const ChatBox: React.FC<ChatBoxProps> = (props) => {
  const currentChat = useRecoilValue(selectedChat);
  const [chat, setChat] = useState<UserType>();
  const [mess, setMsg] = useState<MessageProps[]>([]);

  const { messages } = useSocket();

  useEffect(() => {
    console.log("use", messages, mess);
  }, [messages]);

  const getConversation = trpc.chat.getAllMessages.useMutation({
    onSuccess: (data) => {
      console.log(data);
      if (data?.code === 200) {
        console.log(data.msg);
        const filtered = data.msg?.sort((a, b) => {
          //@ts-ignore
          return new Date(a.createdAt) - new Date(b.createdAt);
        });
        filtered && setMsg((_prev) => filtered);
      }
    },
  });

  useEffect(() => {
    const getMessages = async () => {
      const chat: UserType = currentChat ? JSON.parse(currentChat) : null;
      setChat((_prev) => chat);
      chat.email &&
        (await getConversation.mutate({
          fromEmail: chat.email,
        }));
    };
    getMessages();
  }, [currentChat]);

  return (
    <div className="w-full">
      <div
        style={{ background: "#1E1F22" }}
        className="h-[9vh] flex align-middle items-center justify-start"
      >
        <span className=" ml-2 text-black rounded-full h-8 w-8 flex items-center justify-center bg-gray-300">
          {chat?.username[0]}
        </span>
        <p className="text-xl ml-2">{chat?.username}</p>
      </div>

      <div className="flex flex-col space-y-4 p-3 overflow-y-auto w-full h-[82vh]">
        {mess.map((msg, index) => {
          return (
            <ChatMessage
              username={msg.fromUsername}
              //@ts-ignore
              image={msg.image}
              isCurrentUser={msg.toUsername === chat?.username}
              message={msg.content}
              key={index}
              img=""
            />
          );
        })}
        {messages.map((msg: any, index: number) => {
          return (
            <ChatMessage
              username={msg.fromEmail}
              image={msg.image}
              isCurrentUser={msg.toEmail === chat?.email}
              message={msg.msg}
              key={index}
              img=""
            />
          );
        })}
      </div>

      <div style={{ background: "#1E1F22" }} className="h-[9vh]">
        <MessageBox />
      </div>
    </div>
  );
};

const MessageBox: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const currentChat = useRecoilValue(selectedChat);
  const { sendMessage } = useSocket();
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const sendMessageBackend = trpc.chat.sendMessage.useMutation({
    onSuccess: (data) => {
      console.log("me", data);
    },
  });

  const handleSendMessage = async () => {
    setMessage((_prev) => "");
    const chat: UserType = JSON.parse(currentChat);
    //@ts-ignore
    const token = jwt.decode(localStorage.getItem("token"))?.email;
    console.log(token);

    sendMessage(message, token, chat.email);

    chat.username &&
      (sendMessageBackend.mutateAsync({
        content: message,
        to: chat.username,
      }));
  };

  return (
    <div>
      <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
          <div className="relative flex">
            <input
              type="text"
              placeholder="Write your message!"
              className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
              onChange={(e) => setMessage((_prev) => e.target.value)}
              value={message}
            />
            <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6 text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </button>
              {showEmojiPicker && (
                <EmojiPicker
                  onEmojiClick={(e) => {
                    const emoji = e.emoji;
                    setMessage((prev) => `${prev}${emoji}`);
                  }}
                  className="z-100 absolute bottom-60"
                />
              )}
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                onClick={handleSendMessage}
              >
                <span className="font-bold">Send</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-6 w-6 ml-2 transform rotate-90"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
              </button>
            </div>
          </div>
      </div>
    </div>
  );
};

const ChatMessage: React.FC<ChatMessageProps> = (props) => {
  const { message, isCurrentUser, username, image } = props;

  return (
    <div
      className={`chat-message ${isCurrentUser ? "ml-auto" : ""} mt-4`}
      style={{ maxWidth: "fit-content" }}
    >
      <div className="flex items-end">
        <div
          className={`flex flex-col space-y-2 text-xs max-w-xs mx-2 order-${isCurrentUser ? "1" : "2"} items-${isCurrentUser ? "end" : "start"}`}
        >
          <div>
            <span
              className={`px-4 py-2 rounded-lg inline-block text-xl ${isCurrentUser ? "rounded-br-none bg-blue-600 text-white" : "rounded-bl-none bg-gray-300 text-gray-600 "}`}
            >
              {message}
            </span>
          </div>
        </div>
        {image ? (
          <img src={image} alt="" />
        ) : (
          <span className="text-black rounded-full h-8 w-8 flex items-center justify-center bg-gray-300">
            {username[0]}
          </span>
        )}
      </div>
    </div>
  );
};
