import { atom } from "recoil";

export const selectedChat = atom({
  key: "selectedChat",
  default: JSON.stringify({
    id: 0,
    createdAt: "",
    username: "",
    email: "",
    emailVerified: false,
    password: "",
    image: null,
  }),
});
