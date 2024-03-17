import { useRouter } from "next/router"

const Bot: React.FC = () => {

    const router = useRouter();
    const { name } = router.query;

    return (
        <div style={{background: '#313338'}} className="h-screen w-screen" >
            { name }
        </div>
    )
} 

export default Bot;