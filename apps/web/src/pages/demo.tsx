import { trpc } from "@/utils/trpc";
import { useState } from "react";

const Demo = () => {
  const [name, setName] = useState<string>("");

  const cs = trpc.server.createServer.useMutation({
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const js = trpc.server.joinServer.useMutation({
    onSuccess: data => {
      console.log(data)
    }
  })

  return (
    <div>
      <form>
        <input
          onChange={(e) => setName((_prev) => e.target.value)}
          type="text"
          name=""
          id=""
          placeholder="enter server name"
        />
        <button
          type="submit"
          onClick={async (e) => {
            e.preventDefault();
            await cs.mutate({
              serverName: name,
            });
          }}
        >
          create server
        </button>
      </form>
      <form>
        <input
          onChange={(e) => setName((_prev) => e.target.value)}
          type="text"
          name=""
          id=""
          placeholder="enter server name"
        />
        <button
          type="submit"
          onClick={async (e) => {
            e.preventDefault();
            await js.mutate({
              serverName: name,
            });
          }}
        >
          join server
        </button>
      </form>
    </div>
  );
};

export default Demo;
