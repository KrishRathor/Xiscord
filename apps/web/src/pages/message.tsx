import { UserType } from "@/enums";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Message: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const { email } = router.query;
    typeof email === "string" ? setQuery((_prev) => email) : "";
  }, []);

  return (
    <div className="flex" style={{ background: "#313338" }}>
      <SideUsers />
    </div>
  );
};

const SideUsers: React.FC = () => {

  const [chatUser, setChatUser] = useState<UserType[]>([]);

  const getFriends = trpc.friends.getAllFriends.useMutation({
    onSuccess: data => {
      if (data?.code === 200) {
        console.log(data);
        data.friends && setChatUser(data.friends);
      } else {
        console.log(data?.message);
      }
    }
  })

  useEffect(() => {
    const getUser = async () => {
      await getFriends.mutate();
    }
    getUser();
  }, []);

  return (
    <div style={{ background: "#2B2D31" }} className="h-screen w-1/6 ">
      {
        chatUser.length > 0 ?
          chatUser.map((user, index) => (
            <div key={index} >
              <User username={user.username} image={user.image ?? undefined} />
            </div>
          ))
        : ''
      }
    </div>
  );
};

interface UserProps {
  image?: string;
  username: string;
}

const User: React.FC<UserProps> = (props) => {
  const { image, username } = props;

  return (
    <div className="flex items-center mt-4 w-[80%] mx-auto border-y p-2 rounded-sm ">
      <div className="flex-shrink-0">
        {image ? (
          <img className="w-8 h-8 rounded-full" src={image} alt={username[0]} />
        ) : (
          <span className="text-black rounded-full h-8 w-8 flex items-center justify-center bg-gray-300">
            {username[0]}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0 ms-4">
        <p className="text-xl font-medium text-gray-900 truncate dark:text-white">
          {username}
        </p>
      </div>
    </div>
  );
};

export default Message;
