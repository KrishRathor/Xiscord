import React, { useEffect, useState } from "react";
import TagIcon from "@mui/icons-material/Tag";
import GroupIcon from "@mui/icons-material/Group";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { membersListBool } from "@/atoms/membersListBool";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { ChatMessageProps } from "@/enums";
import { trpc } from "@/utils/trpc";
import { serverName } from "@/atoms/serverName";
import { channelName } from "@/atoms/channelname";
import jwt from "jsonwebtoken";
import { useSocket } from "@/context/SocketProvider";
import { getYoutubeVideoId } from "./getVideoUrl";
import { toast } from "react-toastify";
import { channelPopup } from "@/atoms/channelPopup";
import { useRouter } from "next/router";
import EmojiPicker from "emoji-picker-react";
import { router } from "@/server/trpc";
import { selectedChat } from "@/atoms/selectedChat";

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
  const showPopup = useRecoilValue(channelPopup);

  const servername = useRecoilValue(serverName);

  useEffect(() => {
  }, [servername]);

  const getServer = trpc.server.getServerByServerName.useMutation({
    onSuccess: (data) => {
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
      getServer.mutateAsync({
        serverName: servername,
      });
    };
    server();
  }, [servername, showPopup]);

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
  const setchannel = useSetRecoilState(channelName);
  const [showPopup, setShowPopup] = useRecoilState(channelPopup);
  const router = useRouter();

  const appId = process.env.APP_ID;

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

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
        <div
          className="text-2xl mr-2 hover:cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            togglePopup();
          }}
        >
          +
        </div>
      </div>

      {showTextChannels && (
        <div>
          {textChannels.map((chnl, index) => (
            <div
              key={index}
              className="flex items-center hover:bg-gray-700 hover:cursor-pointer"
              onClick={() => {
                setchannel((_prev) => chnl);
              }}
            >
              <span className="text-gray-400 text-3xl mt-4 ml-4">#</span>
              <p className="text-gray-400 mt-4 ml-2">{chnl}</p>
            </div>
          ))}
        </div>
      )}

      {showPopup && <Popup onClose={togglePopup} serverName={serverName} />}
    </div>
  );
};

const ChatBox: React.FC = () => {
  const setMembers = useSetRecoilState(membersListBool);
  const channelname = useRecoilValue(channelName);
  const servername = useRecoilValue(serverName);
  const [chnl, setChnl] = useState(null);
  const [messages, setMessages] = useState([]);
  const { serverMessage } = useSocket();

  const getChannel = trpc.server.getChannel.useMutation({
    onSuccess: (data) => {
      if (data?.code === 200) {
        //@ts-ignore
        setChnl((_prev) => data.channel);
      }
    },
  });

  useEffect(() => {
  }, [serverMessage]);

  const getConversation = trpc.server.getConversation.useMutation({
    onSuccess: (data) => {
      if (data?.code === 200) {
        //@ts-ignore
        setMessages((_prev) => data.conversation);
      }
    },
  });

  useEffect(() => {
    const conv = async () => {
      getConversation.mutateAsync({
        channelName: channelname,
        serverName: servername,
      });
    };
    conv();
  }, [channelname]);

  useEffect(() => {
    const chnl = async () => {
      getChannel.mutateAsync({
        channelName: channelname,
        serverName: servername,
      });
    };
    chnl();
  }, [channelname]);

  return (
    <div className="h-screen w-full">
      <div
        className="h-[8vh] w-full flex justify-between"
        style={{ background: "#2B2D31", borderBottom: "2px solid #1E1F22" }}
      >
        <div className="flex">
          <TagIcon className="mt-4 w-12 h-12 ml-4" />
          <p className="mt-6 text-2xl ml-2">
            {
              //@ts-ignore
              chnl ? chnl.channelName : ""
            }
          </p>
        </div>
        <div onClick={() => setMembers((prev) => !prev)}>
          <GroupIcon className="w-10 h-10 mr-4 mt-4 cursor-pointer" />
        </div>
      </div>

      <div className="overflow-y-auto h-[83vh]">
        {channelname
          ? messages.map((msg, key) => {
            const token = localStorage.getItem("token") ?? "";
            const payload = jwt.decode(token);
            //@ts-ignore
            const isCurrentUser = msg.fromUser === payload?.username;
            return (
              <div>
                {

                  <ChatMessage
                    //@ts-ignore
                    username={msg.fromUser}
                    //@ts-ignore
                    message={msg.content}
                    isCurrentUser={isCurrentUser}
                  />
                }
              </div>
            );
          })
          : ""}
        {serverMessage.map((msg: any, index: any) => {
          if (
            msg.serverName === servername &&
            msg.channelName === channelname
          ) {
            const videoId = getYoutubeVideoId(msg.msg);
            let img;
            if (videoId) {
              img = `https://img.youtube.com/vi/${videoId}/0.jpg`;
            }
            const token = localStorage.getItem("token") ?? "";
            const payload = jwt.decode(token);
            //@ts-ignore
            const isCurrentUser = msg.from === payload?.username;

            return (
              <div>
                {
                  //@ts-ignore
                  <ChatMessage
                    username={msg.from}
                    message={msg.msg}
                    isCurrentUser={isCurrentUser}
                    //@ts-ignore
                    img={img}
                  />
                }
              </div>
            );
          }
        })}
      </div>

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
  const { onlineUsers } = useSocket();
  const router = useRouter();
  const setCurrentChat = useSetRecoilState(selectedChat);

  const makeFriend = trpc.friends.addFriend.useMutation({
    onSuccess: data => {
      router.push('/message');
    }
  })

  const getUser = trpc.user.getUserbyUsername.useMutation({
    onSuccess: async data => {
      if (data?.code === 200) {
        const email = data.user?.email;
        setCurrentChat(JSON.stringify(data.user));
        typeof email === "string" && await makeFriend.mutate({ email });
      }
    }
  })

  const handleClickInAllUsers = async (username: string) => {
    getUser.mutateAsync({ username })
  };

  const [users, setAllUsers] = useState<any>([]);

  const getUsers = trpc.user.getAllUsers.useMutation({
    onSuccess: data => {
      if (data.code === 200) {
        data.users && setAllUsers(data.users);
      }
    }
  })

  const add = trpc.server.addMemberToServer.useMutation({
    onSuccess: data => {
    }
  })

  const handleAddMember = () => {
    getUsers.mutateAsync();
  }

  const server = useRecoilValue(serverName);

  const addUser = (username: any) => {
    if (typeof username !== "string") return;

    add.mutateAsync({
      username,
      serverName: server
    })

  }

  return (
    <div
      className="h-screen w-1/5 overflow-y-auto"
      style={{ background: "#2B2D31", borderLeft: "2px solid #1E1F22" }}
    >
      <div>
        <p className="text-xl text-gray-400 ml-4 mt-2">Online Users</p>
        {onlineUsers.length > 0 &&
          onlineUsers.map((user, index) => {
            return (
              <div className="flex mt-4 ml-2 items-center">
                <span className="text-black rounded-full h-8 w-8 flex items-center justify-center bg-gray-300">
                  {user[0]}
                </span>
                <span className="text-xl text-gray-400 ml-4">{user}</span>
              </div>
            );
          })}
      </div>

      <div>
        <div className="flex justify-between items-center " >
          <p className="text-xl text-gray-400 ml-4 mt-8">All Users</p>
          <p className="text-2xl mr-2 mt-8 cursor-pointer" onClick={handleAddMember} >+</p>
        </div>

        <div>
          {
            users.map((user: any, id: any) => {
              return (
                <div className="flex justify-evenly" key={id} >
                  <p className="w-[5vw]" >{user.username}</p>
                  <p className="cursor-pointer" onClick={() => addUser(user.username)} >Add</p>
                </div>
              )
            })
          }
        </div>

        {props.users.map((user, index) => (
          <div
            key={index}
            className="flex mt-4 ml-2 items-center hover:cursor-pointer"
            onClick={() => handleClickInAllUsers(user)}
          >
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
  const server = useRecoilValue(serverName);
  const channel = useRecoilValue(channelName);
  const { sendMessageInServer, sendMessageToBot } = useSocket();
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const sendMessage = trpc.server.sendMessage.useMutation({
    onSuccess: (data) => {
    },
  });

  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    let payload;
    token ? (payload = jwt.decode(token)) : "";
    token
      ? //@ts-ignore
      sendMessageInServer(message, server, channel, payload?.username)
      : "";
    token ? sendMessageToBot(message, server, channel) : "";
    setMessage((_prev) => "");
    sendMessage.mutateAsync({
      content: message,
      serverName: server,
      channelName: channel,
    });
  };

  return (
    <div>
      <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
        <form>
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
        </form>
      </div>
    </div>
  );
};

const ChatMessage: React.FC<ChatMessageProps> = (props) => {
  const { message, isCurrentUser, username, image, img } = props;

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
      {img && <img src={img} alt="" />}
    </div>
  );
};

const Popup = ({ onClose, serverName }: any) => {
  const [channelName, setChannelName] = useState<string>("");

  const createServer = trpc.server.createChannel.useMutation({
    onSuccess: (data) => {
      toast(data?.message);
      if (data?.code === 201) {
        onClose();
      }
    },
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-lg text-black font-bold mb-4">Create Server</h2>
        <form action="">
          <div>
            <label className="block mb-2 text-sm font-medium text-black">
              Channel name
            </label>
            <input
              type="text"
              id="first_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="server_name"
              required
              onChange={(e) => setChannelName((_prev) => e.target.value)}
            />
          </div>

          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={async (e) => {
              e.preventDefault();
              createServer.mutateAsync({
                channelName: channelName,
                serverName: serverName,
              });
            }}
          >
            Create
          </button>
          <button
            className="mt-4 ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={onClose}
          >
            Close
          </button>
        </form>
      </div>
    </div>
  );
};
