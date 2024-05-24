import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import Cookies from "js-cookie";

import { MdTask } from "react-icons/md";
import { FaChartPie, FaTicketSimple } from "react-icons/fa6";
import { EnglishFlag } from "../logo/EnglishFlag";
import { IndonesiaFlag } from "../logo/IndonesiaFlag";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/auth";

const Sidebar = () => {
  const pathname = usePathname();
  const { i18n } = useTranslation();
  const { user } = useAuthStore();

  const [isOpenLanguage, setIsOpenLanguage] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<{
    name: string;
    logo: React.ReactNode;
  }>({
    name: Cookies.get("locale") as string,
    logo: Cookies.get("locale") === "en" ? <EnglishFlag /> : <IndonesiaFlag />,
  });
  const [isOpenTheme, setIsOpenTheme] = useState<boolean>(false);
  const [currentTheme, setCurrentTheme] = useState<{
    name: string;
    logo: React.ReactNode;
  }>({
    name: "light",
    logo: <FaSun />,
  });

  const list_menu = [
    { label: "Overview", path: "/", icon: <FaChartPie />, role: ["admin"] },
    { label: "Tasks", path: "/tasks", icon: <MdTask />, role: ["admin"] },
    {
      label: "Tickets",
      path: "/tickets",
      icon: <FaTicketSimple />,
      role: ["admin", "guest"],
    },
  ];

  const onChangeLanguage = (name: string, logo: React.ReactNode) => {
    setCurrentLanguage({
      name,
      logo,
    });
    i18n.changeLanguage(name);
    Cookies.set("locale", name);
    setIsOpenLanguage(false);
  };

  const onChangeTheme = (name: string, logo: React.ReactNode) => {
    setCurrentTheme({
      name,
      logo,
    });
    Cookies.set("theme", name);
    var root = document.getElementsByTagName("html")[0];
    name === "dark"
      ? root.classList.add("dark")
      : root.classList.remove("dark");
    setIsOpenTheme(false);
  };

  useEffect(() => {
    const theme = Cookies.get("theme");
    theme === "dark"
      ? setCurrentTheme({
          name: "dark",
          logo: <FaMoon />,
        })
      : setCurrentTheme({
          name: "light",
          logo: <FaSun />,
        });
  }, []);

  return (
    <aside className="fixed z-20 flex h-full w-16 flex-col justify-between overflow-y-auto overflow-x-hidden bg-white px-2 py-4 transition-all lg:w-60 lg:px-6 lg:py-8 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-8 lg:items-start">
        <h1 className="hidden text-lg font-bold lg:block dark:text-sky-500">
          DASHBOARD KIT
        </h1>
        <h1 className="text-2xl font-bold lg:hidden dark:text-sky-500">L</h1>

        <ul className="w-full space-y-2">
          {list_menu.map(
            (val, index) =>
              val.role.includes(user.role) && (
                <li key={index}>
                  <Link
                    href={val.path}
                    className={`flex w-full flex-row items-center justify-center gap-4 px-2 py-2 text-xl lg:justify-normal lg:px-4 lg:text-base ${pathname === val.path ? "rounded-lg bg-slate-950 font-medium text-white dark:bg-sky-500" : "hover:text-sky-500 dark:text-sky-500 dark:hover:text-slate-500"}`}
                  >
                    {val.icon}
                    <span className="hidden lg:block">{val.label}</span>
                  </Link>
                </li>
              ),
          )}
        </ul>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
        <div className="relative">
          <div
            className="flex cursor-pointer flex-row items-center gap-2 rounded-full border-2"
            onClick={() => setIsOpenLanguage(true)}
          >
            {currentLanguage?.logo}
          </div>

          {isOpenLanguage && (
            <>
              <div
                className="fixed inset-0 z-10 h-full w-full"
                onClick={() => setIsOpenLanguage(false)}
              ></div>
              <div className="absolute -top-28 left-0 z-20 flex min-w-max flex-col items-center rounded-lg border border-slate-300 bg-white shadow-md lg:-top-16 lg:flex-row dark:border-sky-500 dark:bg-sky-500">
                <div
                  className={`cursor-pointer p-2 ${currentLanguage.name === "id" && "rounded-t-lg bg-slate-200 lg:rounded-l-lg dark:bg-slate-950"}`}
                  onClick={() => onChangeLanguage("id", <IndonesiaFlag />)}
                >
                  <IndonesiaFlag />
                </div>
                <div
                  className={`cursor-pointer p-2 ${currentLanguage.name === "en" && "rounded-b-lg bg-slate-200 lg:rounded-r-lg dark:bg-slate-950"}`}
                  onClick={() => onChangeLanguage("en", <EnglishFlag />)}
                >
                  <EnglishFlag />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <div
            className="flex cursor-pointer flex-row items-center gap-2 text-2xl dark:text-sky-500"
            onClick={() => setIsOpenTheme(true)}
          >
            {currentTheme?.logo}
          </div>

          {isOpenTheme && (
            <>
              <div
                className="fixed inset-0 z-10 h-full w-full"
                onClick={() => setIsOpenTheme(false)}
              ></div>
              <div className="absolute inset-x-0 -top-20 z-20 flex min-w-max flex-col items-center rounded-lg border border-slate-300 bg-white shadow-md lg:-top-14 lg:left-auto lg:right-0 lg:flex-row dark:border-sky-500 dark:bg-sky-500 dark:text-white">
                <div
                  className={`cursor-pointer p-2 text-xl ${currentTheme.name === "light" && "rounded-t-lg bg-slate-200 lg:rounded-l-lg dark:bg-slate-950"}`}
                  onClick={() => onChangeTheme("light", <FaSun />)}
                >
                  <FaSun />
                </div>
                <div
                  className={`cursor-pointer p-2 text-xl ${currentTheme.name === "dark" && "rounded-b-lg bg-slate-200 lg:rounded-r-lg dark:bg-slate-950"}`}
                  onClick={() => onChangeTheme("dark", <FaMoon />)}
                >
                  <FaMoon />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
