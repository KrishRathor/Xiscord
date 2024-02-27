import "@/styles/globals.css";
import type { AppProps } from "next/app";
import type { AppType } from 'next/app';
import { trpc } from '../utils/trpc';
import { RecoilRoot } from "recoil";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
      <ToastContainer />
    </RecoilRoot>
  );
};

export default trpc.withTRPC(MyApp);
