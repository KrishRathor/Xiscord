import React, { useEffect, useState } from "react";
import TagIcon from "@mui/icons-material/Tag";
import GroupIcon from "@mui/icons-material/Group";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { membersListBool } from "@/atoms/membersListBool";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { ChatMessageProps } from "@/enums";
import { trpc } from "@/utils/trpc";
import { serverName } from "@/atoms/serverName";

interface ServerTypeProps {
  id: number;
  createdAt: string;
  admin: string;
  serverName: string;
  users: string[];
  textChannels: string[];
  voiceChannels: string[];
}

interface ServerProps {
  server: string;
}

export const Server: React.FC<ServerProps> = (props) => {
  const memberList = useRecoilValue(membersListBool);
  const [server, setServer] = useState<ServerTypeProps | undefined>();

  const servername = useRecoilValue(serverName);

  useEffect(() => {
    console.log("first", servername);
  }, [servername]);

  const getServer = trpc.server.getServerByServerName.useMutation({
    onSuccess: (data) => {
      console.log(data);
      if (data?.code === 200) {
        if (data.server) {
          //@ts-ignore
          setServer((prev) => data.server);
        }
      }
    },
  });

  useEffect(() => {
    const server = async () => {
      await getServer.mutate({
        serverName: servername,
      });
    };
    server();
  }, [servername]);

  if (!server) {
    return <div></div>;
  }

  return (
    <div className="flex w-full">
      <SideList
        serverName={server.serverName}
        textChannels={server.textChannels}
      />
      <ChatBox />
      {memberList && <MembersList users={server.users} />}
    </div>
  );
};

interface SideListProps {
  serverName: string;
  textChannels: string[];
}

const SideList: React.FC<SideListProps> = (props) => {
  const { serverName, textChannels } = props;
  const [showTextChannels, setShowTextChannels] = useState(true);
  const [showVoiceChannels, setShowVoiceChannels] = useState(true);

  return (
    <div
      style={{ background: "#2B2D31", borderRight: "2px solid #1E1F22" }}
      className="h-screen w-1/4"
    >
      <div>
        <p className="text-2xl mt-4 mx-auto w-fit">{serverName}</p>
        <hr className="w-[80%] m-auto mt-2" />
      </div>

      <div className="flex mt-16 justify-between">
        <div
          className="flex cursor-pointer"
          onClick={() => setShowTextChannels((prev) => !prev)}
        >
          {showTextChannels ? (
            <ArrowDropDownIcon className="mt-[2px]" />
          ) : (
            <ArrowRightIcon className="mt-[2px]" />
          )}
          <span className="text-xl text-gray-400">Text Channels</span>
        </div>
        <div className="text-2xl mr-2">+</div>
      </div>

      {showTextChannels && (
        <div>
          {textChannels.map((chnl, index) => (
            <div
              key={index}
              className="flex items-center hover:bg-gray-700 hover:cursor-pointer "
            >
              <span className="text-gray-400 text-3xl mt-4 ml-4">#</span>
              <p className="text-gray-400 mt-4 ml-2">{chnl}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex mt-16 justify-between">
        <div
          className="flex cursor-pointer"
          onClick={() => setShowVoiceChannels((prev) => !prev)}
        >
          {showVoiceChannels ? (
            <ArrowDropDownIcon className="mt-[2px]" />
          ) : (
            <ArrowRightIcon className="mt-[2px]" />
          )}
          <span className="text-xl text-gray-400">Voice Channels</span>
        </div>
        <div className="text-2xl mr-2">+</div>
      </div>

      {showVoiceChannels && (
        <div>
          <div className="flex items-center hover:bg-gray-700 hover:cursor-pointer ">
            <span className="text-gray-400 text-3xl mt-4 ml-4">#</span>
            <p className="text-gray-400 mt-4 ml-2">Lounge</p>
          </div>
          <div className="flex items-center hover:bg-gray-700 hover:cursor-pointer ">
            <span className="text-gray-400 text-3xl mt-4 ml-4">#</span>
            <p className="text-gray-400 mt-4 ml-2">StudyRoom 1</p>
          </div>
          <div className="flex items-center hover:bg-gray-700 hover:cursor-pointer ">
            <span className="text-gray-400 text-3xl mt-4 ml-4">#</span>
            <p className="text-gray-400 mt-4 ml-2">Discord</p>
          </div>
        </div>
      )}
    </div>
  );
};

const ChatBox: React.FC = () => {
  const setMembers = useSetRecoilState(membersListBool);

  return (
    <div className="h-screen w-full">
      <div
        className="h-[8vh] w-full flex justify-between"
        style={{ background: "#2B2D31", borderBottom: "2px solid #1E1F22" }}
      >
        <div className="flex">
          <TagIcon className="mt-4 w-12 h-12 ml-4" />
          <p className="mt-6 text-2xl ml-2">discord-clone</p>
        </div>
        <div onClick={() => setMembers((prev) => !prev)}>
          <GroupIcon className="w-10 h-10 mr-4 mt-4 cursor-pointer" />
        </div>
      </div>

      <div className="overflow-y-auto h-[83vh]"></div>

      <div style={{ background: "#1E1F22" }} className="h-[9vh]">
        <MessageBox />
      </div>
    </div>
  );
};

interface MemberListProps {
  users: string[];
}

const MembersList: React.FC<MemberListProps> = (props) => {
  return (
    <div
      className="h-screen w-1/5 overflow-y-auto"
      style={{ background: "#2B2D31", borderLeft: "2px solid #1E1F22" }}
    >
      <div>
        <p className="text-xl text-gray-400 ml-4 mt-2">Online Users</p>
        <div className="flex mt-4 ml-2 items-center">
          <span className="text-black rounded-full h-8 w-8 flex items-center justify-center bg-gray-300">
            K
          </span>
          <span className="text-xl text-gray-400 ml-4">Krish</span>
        </div>
        <div className="flex mt-4 ml-2 items-center">
          <span className="text-black rounded-full h-8 w-8 flex items-center justify-center bg-gray-300">
            D
          </span>
          <span className="text-xl text-gray-400 ml-4">Deepankar</span>
        </div>
      </div>

      <div>
        <p className="text-xl text-gray-400 ml-4 mt-8">All Users</p>
        {props.users.map((user, index) => (
          <div className="flex mt-4 ml-2 items-center">
            <span className="text-black rounded-full h-8 w-8 flex items-center justify-center bg-gray-300">
              {user[0]}
            </span>
            <span className="text-xl text-gray-400 ml-4">{user}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const MessageBox: React.FC = () => {
  const [message, setMessage] = useState<string>("");

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
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
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
