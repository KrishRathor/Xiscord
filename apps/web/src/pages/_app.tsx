import "@/styles/globals.css";
import type { AppProps } from "next/app";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import { RecoilRoot } from "recoil";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SocketProvider } from "@/context/SocketProvider";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <SocketProvider>
      <RecoilRoot>
        <Component {...pageProps} />
        <ToastContainer />
      </RecoilRoot>
    </SocketProvider>
  );
};

export default trpc.withTRPC(MyApp);
