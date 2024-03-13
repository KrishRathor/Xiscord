import { trpc } from "@/utils/trpc";
import React, { useEffect, useState } from "react";

interface Ibots {
  username: string,
  botsName: string
};

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
    onSuccess: data => {
      console.log(data);

      if (data?.code === 200) {
        const bots = data.data;
        setBots(_prev => bots);
      }
    }
  })

  useEffect(() => {
    const bots = async () => {
      await getBots.mutate();
    };
    bots();
  }, [])

  return (
    <div className="flex m-4 justify-evenly" >
      {
        bots && bots.map((bot, index) => (
          <div key={index} className="w-96" >
            <BotCard botName={bot.botsName} owner={bot.username} />
          </div>
        ))
      }
    </div>
  )
};

interface BotCardProps {
  botName: string,
  owner: string
}

const BotCard: React.FC<BotCardProps> = (props) => {

  const { botName, owner } = props;

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
            { botName }
          </h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            { owner }
          </span>
          <div className="flex mt-4 md:mt-6">
            <button
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Add to Server
            </button>
            <button
              className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Visit
            </button>
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
      console.log(data);
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
