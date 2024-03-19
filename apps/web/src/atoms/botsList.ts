import { atom } from "recoil";

export const BotsList = atom({
  key: "botslist",
  default: [
    {
      id: 0,
      createdAt: "",
      botName: "",
      owner: "",
      servers: [""],
    },
  ],
});
