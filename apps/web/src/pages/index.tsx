import React, { useEffect, useState } from "react";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import MessageIcon from "@mui/icons-material/Message";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { homeSelectedOption } from "@/atoms/homeSelectedOption";
import { SelectedOptionHome } from "@/enums";
import { trpc } from "@/utils/trpc";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useRouter } from "next/router";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import { Server } from "@/components/Server";
import { serverName } from "@/atoms/serverName";
import { useSocket } from "@/context/SocketProvider";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { toast } from "react-toastify";

const Home: React.FC = () => {
  const selectedOption = useRecoilValue(homeSelectedOption);
  const server = useRecoilValue(serverName);
  const router = useRouter();

  if (typeof window !== "undefined") {
    !localStorage.getItem('token') && router.push('/login');
  }

  return (
    <div className="flex h-[100vh]" style={{ background: "#313338" }}>
      <Sidebar />
      {selectedOption === SelectedOptionHome.FindFriends ? (
        <FindFriends />
      ) : selectedOption === SelectedOptionHome.Server ? (
        <Server server={server} />
      ) : (
        ""
      )}
    </div>
  );
};

interface UserType {
  id: number;
  createdAt: string;
  username: string;
  email: string;
  emailVerified: boolean;
  password: string;
  image: string | null;
}

const FindFriends: React.FC = () => {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [users, setUsers] = useState<UserType[]>([]);
  const [nothingFound, setNothingFound] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getAllUsers = trpc.user.getAllUsers.useMutation({
    onSuccess: data => {
      setLoading(false);
      if (data.code === 200) {
        data.users && setAllUsers(data.users);
      }
    }
  })

  useEffect(() => {
    const fetchUsers = async () => {
      getAllUsers.mutateAsync();
    }
    fetchUsers();
  }, [])

  const getUsers = trpc.search.getResultByQuery.useMutation({
    onSuccess: (data) => {
      if (data?.code === 200) {
        data.users.length > 0
          ? setUsers((_prev) => data.users)
          : setNothingFound(true);
      }
    },
  });

  const addFriends = trpc.friends.addFriend.useMutation({
    onSuccess: (data) => {
      router.push('/message')
    },
  });

  const handleSearch = async (e: any) => {
    e.preventDefault();
    setUsers((_prev) => []);
    setNothingFound((_prev) => false);
    getUsers.mutateAsync({
      query: searchQuery,
    });
  };

  const handlePersonalChat = async (email: string) => {
    // router.push(`/message?email=${email}`)
    addFriends.mutateAsync({ email });
  };

  if (loading) {
    return <></>
  }

  return (
    <div className="w-full">
      <form className="max-w-md mx-auto mt-16">
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search Friends, Servers..."
            required
            onChange={(e) => setSearchQuery((_prev) => e.target.value)}
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </form>

      <div>
        <div className="flow-root mx-auto mt-4 w-[30vw]">
          <ul
            role="list"
            className="divide-y divide-gray-200 dark:divide-gray-700"
          >
            {
              allUsers.map(user => {
                return (
                  <li key={user.id} className="py-3 sm:py-4 ">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {user.image ? (
                          <img
                            className="w-8 h-8 rounded-full"
                            src={
                              user.image ||
                              "/docs/images/people/profile-picture-1.jpg"
                            }
                            alt={user.username[0]}
                          />
                        ) : (
                          <span className="text-black rounded-full h-8 w-8 flex items-center justify-center bg-gray-300">
                            {user.username[0]}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                          {user.username}
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                      <div
                        className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
                        onClick={() => {
                          handlePersonalChat(user.email);
                        }}
                      >
                        <MailOutlineIcon className="hover:cursor-pointer" />
                      </div>
                    </div>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>

      {nothingFound && "nothing found"}
      {users.length > 0 && (
        <div
          className="w-full m-auto mt-8 max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8"
          style={{ background: "#1E1F22" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
              Users Found
            </h5>
            {/* <a
              href="#"
              className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              View all
            </a> */}
          </div>
          <div className="flow-root">
            <ul
              role="list"
              className="divide-y divide-gray-200 dark:divide-gray-700"
            >
              {users.map((user) => (
                <li key={user.id} className="py-3 sm:py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {user.image ? (
                        <img
                          className="w-8 h-8 rounded-full"
                          src={
                            user.image ||
                            "/docs/images/people/profile-picture-1.jpg"
                          }
                          alt={user.username[0]}
                        />
                      ) : (
                        <span className="text-black rounded-full h-8 w-8 flex items-center justify-center bg-gray-300">
                          {user.username[0]}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 ms-4">
                      <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        {user.username}
                      </p>
                      <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                    <div
                      className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
                      onClick={() => {
                        handlePersonalChat(user.email);
                      }}
                    >
                      <MailOutlineIcon className=" hover:cursor-pointer" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC = () => {
  const setSelectedOption = useSetRecoilState(homeSelectedOption);
  const setServerName = useSetRecoilState(serverName);
  const [serverList, setServerList] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const { joinServerRoom } = useSocket();

  const router = useRouter();

  const getAllServers = trpc.server.getAllServersByUser.useMutation({
    onSuccess: (data) => {
      if (data?.code === 200) {
        const servers = data.servers;
        const names = servers?.map((server) => server.serverName);
        names && setServerList(names);
      }
    },
  });

  useEffect(() => {
    const servers = async () => {
      getAllServers.mutateAsync();
    };
    servers();
  }, [showPopup]);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div
      className="w-24 h-full rounded-md my-auto"
      style={{ background: "#1E1F22" }}
    >
      <div
        onClick={() => {
          setSelectedOption((_prev) => SelectedOptionHome.FindFriends);
        }}
      >
        <PersonSearchIcon className="block w-12 h-12 m-auto mt-8 hover:cursor-pointer hover:opacity-80" />
      </div>
      <div
        onClick={() => {
          setSelectedOption((_prev) => SelectedOptionHome.DirectMessage);
          router.push("/message");
        }}
      >
        <MessageIcon className="block w-12 h-12 m-auto mt-8 hover:cursor-pointer hover:opacity-80" />
      </div>
      {serverList.map((server, index) => (
        <div
          onClick={() => {
            setSelectedOption((_prev) => SelectedOptionHome.Server);
            setServerName((_prev) => server);
            joinServerRoom(server);
          }}
          key={index}
        >
          <WorkspacesIcon className="block w-12 h-12 m-auto mt-8 hover:cursor-pointer hover:opacity-80" />
        </div>
      ))}

      <div>
        <AddCircleIcon
          onClick={() => {
            togglePopup();
          }}
          className="block w-12 h-12 m-auto mt-8 hover:cursor-pointer hover:opacity-80"
        />
      </div>
      {showPopup && <Popup onClose={togglePopup} />}
    </div>
  );
};

export default Home;

const Popup = ({ onClose }: any) => {

  const [serverName, setServerName] = useState<string>('');

  const createServer = trpc.server.createServer.useMutation({
    onSuccess: data => {
      toast(data?.message);
      if (data?.code === 201) {
        onClose();
      }
    }
  })

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-lg text-black font-bold mb-4">Create Server</h2>
        <form action="">
          <div>
            <label className="block mb-2 text-sm font-medium text-black">
              Server name
            </label>
            <input
              type="text"
              id="first_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="server_name"
              required
              onChange={e => setServerName(_prev => e.target.value)}
            />
          </div>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={async (e) => {
              e.preventDefault();
              createServer.mutateAsync({ serverName: serverName })
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
