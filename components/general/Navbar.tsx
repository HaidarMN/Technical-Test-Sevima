import { FC, useState } from "react";
import { useRouter } from "next/router";

import { useAuthStore } from "@/stores/auth";
import { useLayoutStore } from "@/stores/layout";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { NavbarType } from "@/src/types";
import InputText from "../global/input/Text";
import { IoIosNotifications } from "react-icons/io";

const validationSchema = yup.object({
  search_task: yup.string().nullable(),
});

const Navbar: FC<NavbarType> = ({ title }) => {
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const router = useRouter();
  const { user, removeAuth } = useAuthStore();
  const { setAlert } = useLayoutStore();

  const [openNotif, setOpenNotif] = useState<boolean>(false);
  const [openProfile, setOpenProfile] = useState<boolean>(false);

  const onSearch = (val: any) => {
    router.push({
      pathname: "/tasks",
      query: {
        search: val.search_task,
      },
    });
  };

  const logOut = () => {
    removeAuth();
    router.push("/auth/login");
  };

  return (
    <div className="flex w-full flex-row items-center justify-between bg-white px-4 py-4 md:px-6 lg:px-8 dark:bg-slate-950">
      <h1 className="text-lg font-bold lg:text-2xl dark:text-sky-500">
        {title}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x-2">
        <div className="hidden flex-row items-center gap-4 pr-4 md:flex md:justify-end lg:justify-normal">
          <form onSubmit={handleSubmit(onSearch)} className="hidden lg:block">
            <InputText
              name="search_task"
              control={control}
              placeholder="Search task and hit enter"
            />
          </form>

          <div className="relative">
            <div
              className="relative cursor-pointer"
              onClick={() => setOpenNotif(true)}
            >
              <IoIosNotifications className="text-2xl dark:text-sky-500" />
              <span className="absolute right-1 top-0 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75 dark:bg-slate-400"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500 dark:bg-slate-500"></span>
              </span>
            </div>

            {openNotif && (
              <>
                <div
                  className="fixed inset-0 z-10 h-full w-full"
                  onClick={() => setOpenNotif(false)}
                ></div>
                <div className="absolute right-0 top-14 z-20 grid w-60 grid-cols-1 divide-y rounded-lg border border-slate-300 bg-white shadow-md">
                  <span
                    onClick={() => setOpenNotif(false)}
                    className="cursor-pointer px-4 py-2"
                  >
                    Create Task
                  </span>
                  <span
                    onClick={() => router.push("/task")}
                    className="cursor-pointer px-4 py-2"
                  >
                    View all
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-row items-center gap-4 md:pl-4">
          <span className="hidden md:block dark:text-sky-500">
            {user.email}
          </span>

          <div className="relative">
            <div
              className="h-10 w-10 cursor-pointer rounded-full bg-slate-700"
              onClick={() => setOpenProfile(true)}
            ></div>
            {openProfile && (
              <>
                <div
                  className="fixed inset-0 z-10 h-full w-full"
                  onClick={() => setOpenProfile(false)}
                ></div>
                <div className="absolute right-0 top-16 z-20 grid w-40 grid-cols-1 divide-y rounded-lg border border-slate-300 bg-white shadow-md dark:border-sky-500 dark:bg-sky-500 dark:text-white">
                  <span
                    onClick={() =>
                      setAlert({
                        type: "warning",
                        title: "On Progress",
                        message: "This page is under construction",
                        show: true,
                      })
                    }
                    className="cursor-pointer px-4 py-2"
                  >
                    Profile
                  </span>
                  <span onClick={logOut} className="cursor-pointer px-4 py-2">
                    Log Out
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
