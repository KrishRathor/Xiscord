import { trpc } from "@/utils/trpc";

export default function Home() {
  const a = trpc.user.useMutation({
    onSuccess: (data) => {
      console.log(data);
    },
  });

  return (
    <div>
      hi there
      <button
        onClick={async () => {
          await a.mutate();
        }}
      >
        click
      </button>
    </div>
  );
}
