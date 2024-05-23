import { FC, useState } from "react";
import { useLayoutStore } from "@/stores/layout";

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

import Button from "../global/button";
import InputSelect from "../global/input/Select";
import InputText from "../global/input/Text";
import Modal from "../global/popUp/Modal";

import { CreateTicketType } from "@/src/types";

type AddTicketType = {
  onSuccessAdd: () => void;
};

const validationSchema = yup.object({
  title: yup.string().required().label("Title Ticket"),
  customer_name: yup.string().required().label("Customer Name"),
  priority: yup.string().required().label("Priority Ticket"),
});

const AddTicket: FC<AddTicketType> = ({ onSuccessAdd }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const { errorHandler, setAlert } = useLayoutStore();

  const [isAddTicket, setIsAddTicket] = useState<boolean>(false);
  const [loadingCreateTicket, setLoadingCreateTicket] =
    useState<boolean>(false);

  const priorityTicketOptions = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  const onCloseModalCreateTicket = () => {
    setIsAddTicket(false);
    reset();
  };

  const createTicket = async (value: CreateTicketType) => {
    try {
      setLoadingCreateTicket(true);
      await addDoc(collection(firestoreDB, "tickets"), {
        ...value,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        status: "pending",
      });
      onSuccessAdd();
      setAlert({
        type: "success",
        title: "Ticket Created",
        message: "Succesfully created Ticket",
        show: true,
      });
      onCloseModalCreateTicket();
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoadingCreateTicket(false);
    }
  };

  return (
    <>
      <Button primary onClick={() => setIsAddTicket(true)}>
        Add Ticket
      </Button>

      <Modal isOpen={isAddTicket}>
        <h1 className="text-xl font-bold dark:text-white">Add Ticket</h1>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(createTicket)}
        >
          <InputText
            name="title"
            control={control}
            label="Title Ticket"
            placeholder="Add title"
            error={errors.title?.message}
            primary
          />
          <InputText
            name="customer_name"
            control={control}
            label="Customer Name"
            placeholder="Add customer name"
            error={errors.title?.message}
            primary
          />
          <InputSelect
            name="priority"
            control={control}
            label="Priority Ticket"
            placeholder="Choose the priority"
            error={errors.priority?.message}
            primary
            options={priorityTicketOptions}
          />

          <div className="flex w-full flex-row items-center justify-end gap-2">
            <Button onClick={onCloseModalCreateTicket}>Cancel</Button>
            <Button type="submit" primary isLoading={loadingCreateTicket}>
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddTicket;
