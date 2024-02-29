import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface User {
    email: string,
    username: string,
    id: number
}

const Message: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>();

  const getUser = trpc.user.getUserByEmail.useMutation({
    onSuccess: data => {
        if (!data?.user) {
            console.log(data?.message);
            return;
        }
        setUser(_prev => data?.user);
        localStorage.setItem('XiscordMessageUser', JSON.stringify(data?.user));
    }
  })

  useEffect(() => {
    const user = localStorage.getItem('XiscordMessageUser') ;
    const parsedUser: User = user ? JSON.parse(user) : null ;
    parsedUser ? setUser(parsedUser) : ''
  }, [])

  useEffect(() => {
    const userEmail = router.query.user;
    const user = async () => 
        typeof userEmail === 'string' ? await getUser.mutate({userEmail: userEmail}) : ''
    user();
  }, []);

  return <div>
    { user?.email }
  </div>;
};

export default Message;
