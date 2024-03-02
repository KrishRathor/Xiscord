import React, { useState } from "react";
import TagIcon from "@mui/icons-material/Tag";
import GroupIcon from "@mui/icons-material/Group";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { membersListBool } from "@/atoms/membersListBool";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

export const Server: React.FC = () => {
  const memberList = useRecoilValue(membersListBool);

  return (
    <div className="flex w-full">
      <SideList />
      <ChatBox />
      {memberList && <MembersList />}
    </div>
  );
};

const SideList: React.FC = () => {
  const [showTextChannels, setShowTextChannels] = useState(true);
  const [showVoiceChannels, setShowVoiceChannels] = useState(true);

  return (
    <div
      style={{ background: "#2B2D31", borderRight: "2px solid #1E1F22" }}
      className="h-screen w-1/4"
    >
      <div>
        <p className="text-2xl mt-4 ml-4">Best Developer By 2024</p>
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
          <div className="flex items-center hover:bg-gray-700 hover:cursor-pointer ">
            <span className="text-gray-400 text-3xl mt-4 ml-4">#</span>
            <p className="text-gray-400 mt-4 ml-2">general</p>
          </div>
          <div className="flex items-center hover:bg-gray-700 hover:cursor-pointer ">
            <span className="text-gray-400 text-3xl mt-4 ml-4">#</span>
            <p className="text-gray-400 mt-4 ml-2">discord-clone</p>
          </div>
          <div className="flex items-center hover:bg-gray-700 hover:cursor-pointer ">
            <span className="text-gray-400 text-3xl mt-4 ml-4">#</span>
            <p className="text-gray-400 mt-4 ml-2">session-planning</p>
          </div>
          <div className="flex items-center hover:bg-gray-700 hover:cursor-pointer ">
            <span className="text-gray-400 text-3xl mt-4 ml-4">#</span>
            <p className="text-gray-400 mt-4 ml-2">off-topic</p>
          </div>
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
    </div>
  );
};

const MembersList: React.FC = () => {
  return (
    <div
      className="h-screen w-1/5 overflow-y-auto"
      style={{ background: "#2B2D31", borderLeft: "2px solid #1E1F22" }}
    >
      <div>
        <p className="text-xl text-gray-400 ml-4 mt-2">Online Users</p>
        <div className="flex mt-4 ml-2 items-center" >
          <span className="text-black rounded-full h-8 w-8 flex items-center justify-center bg-gray-300">
            K
          </span>
          <span className="text-xl text-gray-400 ml-4" >Krish</span>
        </div>
        <div className="flex mt-4 ml-2 items-center" >
          <span className="text-black rounded-full h-8 w-8 flex items-center justify-center bg-gray-300">
            D
          </span>
          <span className="text-xl text-gray-400 ml-4" >Deepankar</span>
        </div>
      </div>


      <div>
        <p className="text-xl text-gray-400 ml-4 mt-8">Offline Users</p>
        <div className="flex mt-4 ml-2 items-center" >
          <span className="text-black rounded-full h-8 w-8 flex items-center justify-center bg-gray-300">
            P
          </span>
          <span className="text-xl text-gray-400 ml-4" >Prabhjot</span>
        </div>
        <div className="flex mt-4 ml-2 items-center" >
          <span className="text-black rounded-full h-8 w-8 flex items-center justify-center bg-gray-300">
            K
          </span>
          <span className="text-xl text-gray-400 ml-4" >Kushal</span>
        </div>
        <div className="flex mt-4 ml-2 items-center" >
          <span className="text-black rounded-full h-8 w-8 flex items-center justify-center bg-gray-300">
            N
          </span>
          <span className="text-xl text-gray-400 ml-4" >Nischay</span>
        </div>
      </div>
    </div>
  );
};
