import { FC, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { useAuthStore } from "@/stores/auth";
import { useLayoutStore } from "@/stores/layout";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { FirestoreParams, NavbarType } from "@/src/types";
import InputText from "../global/input/Text";
import { IoIosNotifications } from "react-icons/io";

import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { firestoreDB } from "@/src/plugins/firebase";
import Link from "next/link";

const validationSchema = yup.object({
  search_task: yup.string().nullable(),
});

const Navbar: FC<NavbarType> = ({ title }) => {
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const router = useRouter();
  const { t } = useTranslation();
  const { user, removeAuth } = useAuthStore();
  const { setAlert } = useLayoutStore();

  const [openNotif, setOpenNotif] = useState<boolean>(false);
  const [openProfile, setOpenProfile] = useState<boolean>(false);
  const [data, setData] = useState<FirestoreParams[]>([]);

  const onSearch = (val: any) => {
    router.push({
      pathname: "/tasks",
      query: {
        search: val.search_task,
      },
    });
  };

  const q = query(
    collection(firestoreDB, "tickets"),
    orderBy("created_at", "desc"),
    where("status", "==", "pending"),
    limit(5),
  );
  const getData = onSnapshot(q, (doc) => {
    setData(
      doc.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        created_at: moment(
          doc.data().created_at.seconds * 1000 +
            doc.data().created_at.nanoseconds / 1000000,
        ).format("D MMMM YYYY, HH:mm:ss"),
      })),
    );
  });

  const getPriorityStyle = (value: string) => {
    switch (value) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-blue-500";
      default:
        return "bg-yellow-500";
    }
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

      <div className="flex flex-row items-center gap-4">
        {user.role === "admin" && (
          <div className="hidden flex-row items-center gap-4 pr-4 md:flex md:justify-end md:border-r-2 lg:justify-normal">
            <form
              onSubmit={handleSubmit(onSearch)}
              className="hidden w-52 md:block"
            >
              <InputText
                name="search_task"
                control={control}
                placeholder={t("placeholder:search-task")}
              />
            </form>

            <div className="relative">
              <div
                className="relative cursor-pointer"
                onClick={() => setOpenNotif(true)}
              >
                <IoIosNotifications className="text-2xl dark:text-sky-500" />
                {data.length > 0 && (
                  <span className="absolute right-1 top-0 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75 dark:bg-slate-400"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500 dark:bg-slate-500"></span>
                  </span>
                )}
              </div>

              {openNotif && (
                <>
                  <div
                    className="fixed inset-0 z-10 h-full w-full"
                    onClick={() => setOpenNotif(false)}
                  ></div>
                  <div className="absolute right-0 top-14 z-20 grid w-80 grid-cols-1 divide-y rounded-lg border border-slate-300 bg-white shadow-md dark:border-sky-500 dark:bg-sky-500 dark:text-white">
                    {data.map((item, index) => (
                      <Link
                        href={`/tickets/${item.id}`}
                        onClick={() => setOpenNotif(false)}
                        className={`flex flex-row items-center justify-between gap-4 px-4 py-2 hover:bg-sky-300 ${index === 0 && "rounded-t-lg"} ${index === data.length - 1 && "rounded-b-lg"}`}
                      >
                        <div className="flex flex-col">
                          <span className="font-bold">{item.title}</span>
                          <span className="text-xs">{item.created_at}</span>
                        </div>
                        <span
                          className={`w-fit rounded-md px-3 py-1 text-sm font-semibold uppercase text-white ${getPriorityStyle(item.priority)}`}
                        >
                          {item.priority}
                        </span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-row items-center justify-end gap-4">
          <span className="hidden md:block dark:text-sky-500">
            {user.email}
          </span>

          <div className="relative">
            <div
              className={`h-10 w-10 cursor-pointer rounded-full ${user.role === "admin" ? "bg-red-500" : "bg-green-500"}`}
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
