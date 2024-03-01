import { ChatMessageProps, UserType } from "@/enums";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ChatBox } from "../components/ChatBox";
import { SideUsers } from "@/components/SideUser";

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
      <ChatBox email={query} />
    </div>
  );
};



export default Message;
