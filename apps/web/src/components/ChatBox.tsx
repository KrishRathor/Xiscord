import { ChatMessageProps } from "@/enums";
import { trpc } from "@/utils/trpc";
import React, { useEffect, useState } from "react";

interface ChatBoxProps {
  email: string,
}

export const ChatBox: React.FC<ChatBoxProps> = (props) => {

  const { email } = props;

  const messages = [
    {
      message: "Hello there!",
      isCurrentUser: true,
      username: "Krish",
      image: undefined,
    },
    {
      message: "Hey Krish, how are you?",
      isCurrentUser: false,
      username: "Kushal",
      image: undefined,
    },
    {
      message: "I am doing great, thanks for asking!",
      isCurrentUser: true,
      username: "Krish",
      image: undefined,
    },
    {
      message: "That's good to hear!",
      isCurrentUser: false,
      username: "Kushal",
      image: undefined,
    },
    {
      message: "By the way, did you finish that project?",
      isCurrentUser: true,
      username: "Krish",
      image: undefined,
    },
    {
      message: "Not yet, but I'm almost done.",
      isCurrentUser: false,
      username: "Kushal",
      image: undefined,
    },
    {
      message: "Great! Let me know if you need any help.",
      isCurrentUser: true,
      username: "Krish",
      image: undefined,
    },
    {
      message: "Sure thing, thanks!",
      isCurrentUser: false,
      username: "Kushal",
      image: undefined,
    },
    {
      message: "Hey, do you want to grab lunch today?",
      isCurrentUser: true,
      username: "Krish",
      image: undefined,
    },
    {
      message: "Sounds good, where do you want to go?",
      isCurrentUser: false,
      username: "Kushal",
      image: undefined,
    },
    {
      message: "How about that new Italian place downtown?",
      isCurrentUser: true,
      username: "Krish",
      image: undefined,
    },
    {
      message: "That works for me!",
      isCurrentUser: false,
      username: "Kushal",
      image: undefined,
    },
    {
      message: "Okay, let's meet there at 12:30.",
      isCurrentUser: true,
      username: "Krish",
      image: undefined,
    },
    {
      message: "See you then!",
      isCurrentUser: false,
      username: "Kushal",
      image: undefined,
    },
    {
      message: "Hey, I'm running a bit late, can we push it to 1:00?",
      isCurrentUser: true,
      username: "Krish",
      image: undefined,
    },
    {
      message: "Okay, let's meet there at 12:30.",
      isCurrentUser: true,
      username: "Krish",
      image: undefined,
    },
    {
      message: "See you then!",
      isCurrentUser: false,
      username: "Kushal",
      image: undefined,
    },
    {
      message: "Hey, I'm running a bit late, can we push it to 1:00?",
      isCurrentUser: true,
      username: "Krish",
      image: undefined,
    },
    {
      message: "Okay, let's meet there at 12:30.",
      isCurrentUser: true,
      username: "Krish",
      image: undefined,
    },
    {
      message: "See you then!",
      isCurrentUser: false,
      username: "Kushal",
      image: undefined,
    },
    {
      message: "Hey, I'm running a bit late, can we push it to 1:00?",
      isCurrentUser: true,
      username: "Krish",
      image: undefined,
    },
    {
      message: "Okay, let's meet there at 12:30.",
      isCurrentUser: true,
      username: "Krish",
      image: undefined,
    },
    {
      message: "See you then!",
      isCurrentUser: false,
      username: "Kushal",
      image: undefined,
    },
    {
      message: "Hey, I'm running a bit late, can we push it to 1:00?",
      isCurrentUser: true,
      username: "Krish",
      image: undefined,
    },
  ];

  const [m, setM] = useState(messages);

  const getConversation = trpc.chat.getAllMessages.useMutation({
    onSuccess: data => {
      console.log(data);
    }
  })

  useEffect(() => {
    const getMessages = async () => {
      await getConversation.mutate({
        fromEmail: email
      })
    }
    getMessages();
  }, []);

  return (
    <div className="w-full">
      <div style={{ background: "#1E1F22" }} className="h-[9vh] flex align-middle items-center justify-start">
        <span className=" ml-2 text-black rounded-full h-8 w-8 flex items-center justify-center bg-gray-300">
          K
        </span>
        <p className="text-xl ml-2">Kushal</p>
      </div>

      <div className="flex flex-col space-y-4 p-3 overflow-y-auto w-full h-[82vh]">
        {messages.map((msg) => (
          <ChatMessage
            username={msg.username}
            image={msg.image}
            isCurrentUser={msg.isCurrentUser}
            message={msg.message}
          />
        ))}
      </div>
      <div style={{ background: "#1E1F22" }} className="h-[9vh]">
        <MessageBox />
      </div>
    </div>
  );
};

const MessageBox: React.FC = () => {
  return (
    <div>
      <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
        <div className="relative flex">
          <input
            type="text"
            placeholder="Write your message!"
            className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
          />
          <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-gray-600"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                ></path>
              </svg>
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-gray-600"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
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
