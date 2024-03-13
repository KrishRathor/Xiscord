import React, { useState } from "react";

const Bots: React.FC = () => {
  return (
    <div style={{ background: "#313338", height: "100vh", width: "100vw" }}>
      <div className=" relative top-4">
        <p className=" text-2xl w-fit mx-auto">Build your first Xiscord Bot:</p>
      </div>
      <div className="relative  top-20">
        <Form />
      </div>
    </div>
  );
};

export default Bots;

const Form: React.FC = () => {

    const [botName, setBotName] = useState<string>();

    const handleCreateBot = () => {
        console.log(botName);
    }

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
          onChange={e => setBotName(e.target.value)}
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
