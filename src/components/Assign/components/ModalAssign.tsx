"use client";
import ModalPop from "@/components/ModalPop/ModalPop";
import React from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Select, Option, Input, Typography } from "@material-tailwind/react";
import { Button, Dialog } from "@headlessui/react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  UseFormRegister,
  FieldErrors,
  Controller,
  Control,
  useForm,
  useWatch,
} from "react-hook-form";
interface IFormInput {
  agent_id: number;
}

const schema = yup.object({
  agent_id: yup
    .number()
    .typeError("Agent ID must be a number")
    .min(1, "Pick an agent to assign")
    .required("Pick an agent to assign"),
});

interface AssignProps {
  ref_code: string;
  getCustomers: (key: string, page: number, agent_id: number) => Promise<void>;
  assignOpen: boolean;
  setAssignOpen: (value: boolean) => void;
  name: string;
  agent_id?: number | 0;
  customer_id: number;
}

interface Agent {
  id: number;
  name: string;
  created_by: string;
  email: string;
}

const ModalAssign: React.FC<AssignProps> = ({
  ref_code,
  getCustomers,
  assignOpen,
  setAssignOpen,
  name,
  agent_id,
  customer_id,
}) => {
  console.log(agent_id);

  const token = Cookies.get("token");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });
  const currentAgent = useWatch({ control, name: "agent_id" }) || 0;
  console.log(name, "agent : " + agent_id);

  // get agent
  const [agents, setAgents] = React.useState<Agent[]>([]);
  const [status, setStatus] = React.useState({ load: false, error: false });
  const getData = async (key: string) => {
    setStatus({ load: true, error: false });
    try {
      await axios
        .get(
          `${process.env.NEXT_PUBLIC_DEV_API}/agent${key !== "" ? `?keyword=${key}` : ``}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((response) => {
          console.log(response.data);
          setAgents(response.data.data);
          reset();
          setStatus({ load: false, error: false });
        });
    } catch (error) {
      console.log(error);
      setStatus({ load: false, error: true });
    }
  };

  React.useEffect(() => {
    getData("");
  }, []);

  const [submitStatus, setSubmitStatus] = React.useState({
    load: false,
    error: false,
  });
  const onSubmit = async (data: IFormInput) => {
    setSubmitStatus({ load: true, error: false });
    try {
      const email = agents.find((i) => i.id === data.agent_id)?.email;
      console.log(email);

      const payload = {
        data: [
          {
            agent_id: data.agent_id,
            customer_id: customer_id,
            email: email,
          },
        ],
      };

      await axios
        .put(
          `${process.env.NEXT_PUBLIC_DEV_API}/customer/assign-to-agent`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((response) => {
          console.log(response.data);
          setSubmitStatus({ load: false, error: false });
          setAssignOpen(false);
          getCustomers("", 1, 0);
        });
    } catch (error) {
      console.log(error);
      setSubmitStatus({ load: false, error: true });
    }
  };
  return (
    <ModalPop
      isOpen={assignOpen}
      closeModalAdd={() => {
        setAssignOpen(false);
        reset();
        setSubmitStatus({ load: false, error: false });
      }}
    >
      <Dialog.Title
        as="h3"
        className="text-xl font-semibold text-gray-900 dark:text-white"
      >
        Assign Agent
      </Dialog.Title>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-2">
          <label
            htmlFor="agent_id"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Agent
          </label>
          <div>
            <select
              id="agent_id"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm"
              required
              {...register("agent_id", { required: true, value: agent_id })}
            >
              <option value={0} defaultValue={0}>
                Select an Agent
              </option>
              {/* Example options for agents */}
              {agents.map((i, key) => (
                <option key={key} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
            {errors.agent_id && (
              <Typography
                className="mt-5 flex items-center gap-2 text-sm text-red-500"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                {errors.agent_id.message}
              </Typography>
            )}
          </div>
        </div>
        {submitStatus.error && (
          <Typography
            className="mt-5 flex items-center gap-2 text-sm text-red-500"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <svg
              xmlns="http://www.w3.org/
                    2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fill-rule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 16a1 1 0 110-2 1 1 0 010 2zm0-12a1 1 0 011 1v8a1 1 0 01-2 0V7a1 1 0 011-1z"
                clip-rule="evenodd"
              ></path>
            </svg>
            Something went wrong, please try again.
          </Typography>
        )}
        <div className="mt-6 flex items-center justify-end space-x-3">
          <Button
            type="button"
            onClick={() => {
              setAssignOpen(false);
              reset();
              setSubmitStatus({ load: false, error: false });
            }}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </Button>
          <Button
            disabled={submitStatus.load || currentAgent === agent_id}
            className={`rounded-md  px-4 py-2 text-sm font-medium text-white  ${submitStatus.load || currentAgent === agent_id ? "cursor-not-allowed bg-gray-400" : " bg-green-600 hover:bg-green-700"}`}
            type="submit"
          >
            {submitStatus.load ? "Assigning..." : "Assign"}
          </Button>
        </div>
      </form>
    </ModalPop>
  );
};

export default ModalAssign;
