import { SelectedOptionHome } from "@/enums";
import { atom } from "recoil";

export const homeSelectedOption = atom({
    key: 'homeSelectedOption',
    default: SelectedOptionHome.FindFriends
})
