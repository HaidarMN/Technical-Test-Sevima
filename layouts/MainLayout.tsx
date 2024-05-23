import getConfig from "next/config";
import Head from "next/head";
import { ReactNode } from "react";

// Components
import Breadcrumb from "@/components/general/Breadcrumb";
import Sidebar from "@/components/general/Sidebar";
import Navbar from "@/components/general/Navbar";

type props = {
  title: string;
  children: ReactNode;
};

const MainLayout = ({ title, children }: props) => {
  const { publicRuntimeConfig } = getConfig();

  return (
    <>
      <Head>
        <title>{`${title} - ${publicRuntimeConfig.APP_TITLE}`}</title>
      </Head>
      <div className="flex">
        <Sidebar />

        <div className="ml-16 flex w-full grow flex-col lg:ml-60">
          <Navbar title={title} />
          <main className="flex grow flex-col gap-6 p-4 md:p-6 md:pt-4 lg:p-8 lg:pt-6">
            <Breadcrumb />
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
