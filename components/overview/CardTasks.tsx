import { useEffect, useState } from "react";
import Link from "next/link";
import { useLayoutStore } from "@/stores/layout";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/auth";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { firestoreDB } from "@/src/plugins/firebase";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Modal from "@/components/global/popUp/Modal";
import InputText from "@/components/global/input/Text";
import Button from "@/components/global/button";
import InputSelect from "@/components/global/input/Select";

import { CreateTasksType, FirestoreParams } from "@/src/types";
import { GoKebabHorizontal } from "react-icons/go";

const validationSchema = yup.object({
  title: yup.string().required().label("Title Task"),
  priority: yup.string().required().label("Priority Task"),
});

const CardTask = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { errorHandler, setAlert } = useLayoutStore();

  const [isAddTask, setIsAddTask] = useState<boolean>(false);
  const [loadingCreateTask, setLoadingCreateTask] = useState<boolean>(false);
  const [data, setData] = useState<FirestoreParams[]>([]);
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const priorityTaskOptions = [
    { value: "urgent", label: "Urgent" },
    { value: "schedule", label: "Schedule" },
    { value: "delegate", label: "Delegate" },
    { value: "normal", label: "Normal" },
  ];

  const onCloseModalCreateTask = () => {
    setIsAddTask(false);
    reset();
  };

  const getData = async () => {
    try {
      const q = query(
        collection(firestoreDB, "tasks"),
        orderBy("created_at", "desc"),
        limit(3),
      );
      const response = await getDocs(q);
      setData(
        response.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          priority: doc.data().priority,
          status: doc.data().status,
        })),
      );
    } catch (error) {
      errorHandler(error);
    }
  };

  const createTask = async (value: CreateTasksType) => {
    try {
      setLoadingCreateTask(true);
      await addDoc(collection(firestoreDB, "tasks"), {
        ...value,
        low_title: value.title.toLowerCase(),
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        done: false,
      });
      await getData();
      setAlert({
        type: "success",
        title: "Task Created",
        message: "Succesfully created task",
        show: true,
      });
      onCloseModalCreateTask();
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoadingCreateTask(false);
    }
  };

  const updateStatusTask = async (id: string) => {
    try {
      const isDone = await getDoc(doc(firestoreDB, "tasks", id));

      isDone.exists() &&
        (await updateDoc(doc(firestoreDB, "tasks", id), {
          done: !isDone.data().done,
          updated_at: serverTimestamp(),
        }));
      await getData();
      setAlert({
        type: "success",
        title: "Task Updated",
        message: "Succesfully updated task",
        show: true,
      });
    } catch (error) {
      errorHandler(error);
    }
  };

  const getPriorityStyle = (value: string) => {
    switch (value) {
      case "urgent":
        return "bg-red-500";
      case "schedule":
        return "bg-yellow-500";
      case "delegate":
        return "bg-blue-500";
      default:
        return "bg-slate-400";
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex w-full flex-col gap-4 rounded-lg bg-white shadow-md dark:bg-slate-950">
      <div className="flex w-full flex-row items-start justify-between px-8 pt-6">
        <span className="text-lg font-bold md:text-xl dark:text-sky-500">
          {t("tasks:tasks")}
        </span>

        <div className="relative">
          <GoKebabHorizontal
            className="rotate-90 cursor-pointer text-xl dark:text-white"
            onClick={() => setOpenMenu(true)}
          />
          {openMenu && (
            <>
              <div
                className="fixed inset-0 z-10 h-full w-full"
                onClick={() => setOpenMenu(false)}
              ></div>
              <div className="absolute right-0 top-6 z-20 grid w-40 grid-cols-1 divide-y rounded-lg border border-slate-300 bg-white shadow-md dark:border-sky-500 dark:bg-sky-500">
                <span
                  onClick={() => {
                    setIsAddTask(true);
                    setOpenMenu(false);
                  }}
                  className="cursor-pointer px-4 py-2 dark:text-white"
                >
                  {t("tasks:create-task")}
                </span>
                <span
                  onClick={() => router.push("/tasks")}
                  className="cursor-pointer px-4 py-2 dark:text-white"
                >
                  {t("overview:view-all")}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 divide-y dark:divide-slate-400">
        {data.map((item) => (
          <div
            className="flex flex-col items-start justify-normal gap-4 px-8 py-4 md:flex-row md:items-center md:justify-between"
            key={item.id}
          >
            <div className="flex flex-row items-center gap-2">
              <input
                type="checkbox"
                name={`task ${item.id}`}
                className="h-5 w-5 rounded-full border border-slate-950 text-slate-950 focus:!ring-2 focus:!ring-slate-950 dark:border-sky-500 dark:text-sky-500 dark:focus:ring-sky-500"
                onChange={() => updateStatusTask(item.id)}
                checked={item.status}
              />
              {user.role === "admin" ? (
                <Link
                  href={`/tasks?search=${item.title}`}
                  className="font-semibold text-blue-500 underline-offset-2 hover:underline dark:text-white"
                  title={item.title}
                >
                  {item.title}
                </Link>
              ) : (
                <span className="font-semibold dark:text-white">
                  {item.title}
                </span>
              )}
            </div>
            <span
              className={`rounded-md px-3 py-1 text-sm font-semibold uppercase text-white ${getPriorityStyle(item.priority)}`}
            >
              {item.priority}
            </span>
          </div>
        ))}
      </div>

      <Modal isOpen={isAddTask}>
        <h1 className="text-xl font-bold dark:text-white">
          {t("tasks:create-task")}
        </h1>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(createTask)}
        >
          <InputText
            name="title"
            control={control}
            label={t("tasks:title-task")}
            placeholder={t("placeholder:enter", {
              field: t("tasks:title-task"),
            })}
            error={errors.title?.message}
            primary
          />
          <InputSelect
            name="priority"
            control={control}
            label={t("tasks:priority-task")}
            placeholder={t("placeholder:select", {
              field: t("tasks:priority-task"),
            })}
            error={errors.priority?.message}
            primary
            options={priorityTaskOptions}
          />

          <div className="flex w-full flex-row items-center justify-end gap-2">
            <Button onClick={onCloseModalCreateTask}>
              {t("button:cancel")}
            </Button>
            <Button type="submit" primary isLoading={loadingCreateTask}>
              {t("button:create")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CardTask;
