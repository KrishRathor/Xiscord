import { trpc } from "@/utils/trpc";
import React, { useEffect, useState } from "react";

interface Ibots {
  username: string;
  botsName: string;
}

interface IServer {
  id: number;
  createdAt: string;
  admin: string;
  serverName: string;
  users: string[];
  textChannels: string[];
  voiceChannels: string[];
}

const Bots: React.FC = () => {
  return (
    <div style={{ background: "#313338", height: "100vh", width: "100vw" }}>
      <div className="relative top-4">
        <p className="text-2xl w-fit mx-auto">Build your first Xiscord Bot:</p>
      </div>
      <div className="relative top-20">
        <Form />
        <MarketPlace />
      </div>
    </div>
  );
};

export default Bots;

const MarketPlace: React.FC = () => {
  const [nameBots, setNameBots] = useState<string[]>([]);
  const [nameUsers, setNameUsers] = useState<string[]>([]);
  const [bots, setBots] = useState<Ibots[]>([]);

  const getBots = trpc.bots.getAllBots.useMutation({
    onSuccess: (data) => {

      if (data?.code === 200) {
        const bots = data.data;
        setBots((_prev) => bots);
      }
    },
  });

  useEffect(() => {
    const bots = async () => {
      await getBots.mutate();
    };
    bots();
  }, []);

  return (
    <div className="flex m-4 justify-evenly">
      {bots &&
        bots.map((bot, index) => (
          <div key={index} className="w-96">
            <BotCard botName={bot.botsName} owner={bot.username} />
          </div>
        ))}
    </div>
  );
};

interface BotCardProps {
  botName: string;
  owner: string;
}

const BotCard: React.FC<BotCardProps> = (props) => {
  const { botName, owner } = props;
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [servers, setServers] = useState<IServer[]>([]);

  const getAllServers = trpc.server.getAllServersByUser.useMutation({
    onSuccess: (data) => {
      if (data?.code === 200) {
        const server = data.servers;
        server && setServers((_prev) => server);
      }
    },
  });

  const togglePopup = () => {
    setShowPopup((prev) => !prev);
  };

  const handleAddToServerClick = async () => {
    await getAllServers.mutate();
    togglePopup();
  };

  return (
    <div>
      <div
        className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow"
        style={{ background: "#1E1F22" }}
      >
        <div className="flex justify-end px-4 pt-4"></div>
        <div className="flex flex-col items-center pb-10">
          <img
            className="w-24 h-24 mb-3 rounded-full shadow-lg"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ_q2wW9PH3NBWsGyG9LKiqZdkCwD7cUleWA&usqp=CAU"
            alt="Bonnie image"
          />
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            {botName}
          </h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {owner}
          </span>
          <div className="flex mt-4 md:mt-6">
            <button
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={handleAddToServerClick}
            >
              Add to Server
            </button>
            <button className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
              Visit
            </button>
            {showPopup && <Popup onClose={togglePopup} servers={servers} />}
          </div>
        </div>
      </div>
    </div>
  );
};

const Form: React.FC = () => {
  const [botName, setBotName] = useState<string>();

  const createBot = trpc.bots.createBot.useMutation({
    onSuccess: (data) => {
    },
  });

  const handleCreateBot = async () => {
    botName &&
      (await createBot.mutate({
        botName: botName,
      }));
  };

  return (
    <form className="max-w-sm mx-auto">
      <div className="mb-5">
        <label className="block mb-2 text-xl font-medium text-gray-900 dark:text-white">
          Bot Name
        </label>
        <input
          type="text"
          id="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="bot name"
          required
          onChange={(e) => setBotName(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={(e) => {
          e.preventDefault();
          handleCreateBot();
        }}
      >
        Create
      </button>
    </form>
  );
};

interface IPopup {
  onClose: any;
  servers: IServer[];
}

const Popup: React.FC<IPopup> = (props) => {
  const { onClose, servers } = props;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-md">
        <DropDown servers={servers} />
        <button
          className="mt-4 ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

interface IDD {
  servers: IServer[];
}

const DropDown: React.FC<IDD> = (props) => {
  const { servers } = props;
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative  text-left">
      <button
        id="dropdownDefaultButton"
        onClick={toggleDropdown}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Dropdown button
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      <div
        id="dropdown"
        className={`z-10 ${isOpen ? "" : "hidden"} bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}
      >
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200 overflow-y-auto h-[20vh]"
          aria-labelledby="dropdownDefaultButton"
        >
          {servers.map((server) => (
            <li>
              <button
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >{server.serverName}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
