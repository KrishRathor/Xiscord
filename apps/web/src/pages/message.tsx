import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface User {
  email: string;
  username: string;
  id: number;
}

const Message: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>();

  const getUser = trpc.user.getUserByEmail.useMutation({
    onSuccess: (data) => {
      if (!data?.user) {
        console.log(data?.message);
        return;
      }
      setUser((_prev) => data?.user);
      localStorage.setItem("XiscordMessageUser", JSON.stringify(data?.user));
    },
  });

  useEffect(() => {
    const user = localStorage.getItem("XiscordMessageUser");
    const parsedUser: User = user ? JSON.parse(user) : null;
    parsedUser ? setUser(parsedUser) : "";
  }, []);

  useEffect(() => {
    const userEmail = router.query.user;
    const user = async () =>
      typeof userEmail === "string"
        ? await getUser.mutate({ userEmail: userEmail })
        : "";
    user();
  }, []);

  const [messages, setMessages] = useState([
    { id: 1, text: "Hello!", sender: "user" },
    { id: 2, text: "Hi there!", sender: "bot" },
    { id: 3, text: "How are you?", sender: "bot" },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([
        ...messages,
        { id: messages.length + 1, text: newMessage, sender: "user" },
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="w-screen h-screen" style={{ background: "#313338" }}>
      <div className="flex flex-col h-screen">
      <p className="text-2xl ml-8" >{user?.username}</p>
        <div className="flex-1 overflow-y-auto bg-gray-100 p-4" style={{ background: "#313338" }}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 rounded-lg mt-4 ${message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-800"}`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center bg-white p-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 rounded-full py-2 px-4 bg-gray-200 focus:outline-none"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 bg-blue-500 text-white rounded-full py-2 px-4 focus:outline-none"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Message;
