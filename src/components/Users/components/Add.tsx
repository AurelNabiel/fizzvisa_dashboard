"use client";
import ModalPop from "@/components/ModalPop/ModalPop";
import { Button, Dialog } from "@headlessui/react";
import { Input, Option, Select, Typography } from "@material-tailwind/react";
import React from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Cookies from "js-cookie";

import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import axios from "axios";

interface IFormInput {
  email: string;
  username: string;
  password: string;
  user_type: string;
  agent_id?: number;
  role: string;
}

interface Agent {
  id: number;
  name: string;
  email: string;
  created_by: string;
}

interface AddProps {
  // getCustomers: (key: string) => Promise<void>;
  getData: (key: string, page: number) => void;
}
const schema = yup.object({
  email: yup.string().email().required("Email is required"),
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  user_type: yup.string().required("User type is required"),

  role: yup.string().required("Role is required"),
  agent_id: yup.number().when("role", (role, schema) => {
    return role[0] === "agent"
      ? schema.required("Agent ID is required")
      : schema.notRequired();
  }),
});
const Add: React.FC<AddProps> = ({ getData }) => {
  const token = Cookies.get("token");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });
  const currentName = useWatch({ control, name: "username" }) || "";
  // const currentRole = useWatch({ control, name: "role" }) || "";
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  //   console.log(currentName);
  const [agent, setAgent] = React.useState<{
    load: boolean;
    error: boolean;
    data: Agent[];
  }>({ load: false, error: false, data: [] });
  const getAgent = async () => {
    setAgent({ load: true, error: false, data: [] });
    try {
      await axios
        .get(`${process.env.NEXT_PUBLIC_DEV_API}/agent`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setAgent({ load: false, error: false, data: res.data.data });
        });
    } catch (error) {
      setAgent({ load: false, error: true, data: [] });
    }
  };

  React.useEffect(() => {
    getAgent();
  }, []);

  const [permission, setPermission] = React.useState({
    add: false,
    modify: false,
    delete: false,
    view: false,
    approve: false,
  });
  const [status, setStatus] = React.useState({ load: false, error: false });
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setStatus({ load: true, error: false });
    try {
      const submitData = {
        ...data,
        add: permission.add,
        modify: permission.modify,
        delete: permission.delete,
        view: permission.view,
        approve: permission.approve,
      }
      await axios
        .post(`${process.env.NEXT_PUBLIC_DEV_API}/users/add`, submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          reset();
          setStatus({ load: false, error: false });
          getData("", 1);
          setIsOpen(false);
        });
    } catch (error) {
      console.log(error);
      setStatus({ load: false, error: true });
    }
  };

  return (
    <>
      <div className="">
        <Button
          onClick={() => {
            setIsOpen(true);
          }}
          className="w-full cursor-pointer rounded-lg border border-primary bg-primary px-4 py-2 text-white transition hover:bg-opacity-90"
        >
          Add +
        </Button>
      </div>
      <ModalPop
        isOpen={isOpen}
        closeModalAdd={() => {
          setIsOpen(false);
          reset();
        }}
      >
        <Dialog.Title
          as="h3"
          className="mb-4 text-xl font-semibold text-gray-900 dark:text-white"
        >
          Add Users
        </Dialog.Title>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Input Field */}
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Username
            </label>
            <Input
              crossOrigin={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              {...register("username", { required: true })}
              type="text"
              autoComplete="false"
              className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-3 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {errors.username && (
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
                {errors.username.message}
              </Typography>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <Input
              crossOrigin={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              {...register("email", { required: true })}
              placeholder="youremail@example.com"
              type="email"
              autoComplete="false"
              className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-3 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {errors.email && (
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
                {errors.email.message}
              </Typography>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <Input
              crossOrigin={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              type="password"
              autoComplete="false"
              {...register("password", { required: true })}
              className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-3 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {errors.password && (
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
                {errors.password.message}
              </Typography>
            )}
          </div>
          <div>
            <label
              htmlFor="user_type"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              User Type
            </label>
            <div className="relative">
              <select
                {...register("user_type", { required: true })}
                className="ease w-full cursor-pointer appearance-none rounded border border-slate-200 bg-transparent py-2 pl-3 pr-8 text-sm text-slate-700 shadow-sm transition duration-300 placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:shadow-md focus:outline-none"
              >
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.2"
                stroke="currentColor"
                className="absolute right-2.5 top-2.5 ml-1 h-5 w-5 text-slate-700"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                />
              </svg>
            </div>
            {errors.user_type && (
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
                {errors.user_type.message}
              </Typography>
            )}
          </div>
          {/* {currentRole === "agent" && (
            <div>
              <label
                htmlFor="role"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Agent
              </label>
              <div className="relative">
                <select
                  {...register("agent_id", { required: true })}
                  className="ease w-full cursor-pointer appearance-none rounded border border-slate-200 bg-transparent py-2 pl-3 pr-8 text-sm text-slate-700 shadow-sm transition duration-300 placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:shadow-md focus:outline-none"
                >
                  <option value="">Pick an agent</option>
                  {agent.data.map((item, key) => (
                    <option key={key} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.2"
                  stroke="currentColor"
                  className="absolute right-2.5 top-2.5 ml-1 h-5 w-5 text-slate-700"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                  />
                </svg>
              </div>
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
          )} */}
          <div>
            <label
              htmlFor="role"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Role
            </label>
            <Input
              crossOrigin={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              {...register("role", { required: true })}
              type="text"
              placeholder="pick a role"
              autoComplete="false"
              className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-3 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {errors.role && (
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
                {errors.role.message}
              </Typography>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="add"
              onChange={(e) => {
                setPermission({ ...permission, add: e.target.checked });
              }}
            />
            <label htmlFor="add" className="text-sm text-gray-700 dark:text-gray-300">
              Add
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="modify"
              onChange={(e) => {
                setPermission({ ...permission, modify: e.target.checked });
              }}
            />
            <label htmlFor="modify" className="text-sm text-gray-700 dark:text-gray-300">
              Modify
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="delete"
              onChange={(e) => {
                setPermission({ ...permission, delete: e.target.checked });
              }}
            />
            <label htmlFor="delete" className="text-sm text-gray-700 dark:text-gray-300">
              Delete
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="view"
              onChange={(e) => {
                setPermission({ ...permission, view: e.target.checked });
              }}
            />
            <label htmlFor="view" className="text-sm text-gray-700 dark:text-gray-300">
              View
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="approve"
              onChange={(e) => {
                setPermission({ ...permission, approve: e.target.checked });
              }}
            />
            <label htmlFor="approve" className="text-sm text-gray-700 dark:text-gray-300">
              Approve
            </label>
          </div>
          {/* Error Message */}
          
          {status.error && (
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
              Something went wrong, please try again later
            </Typography>
          )}
          {/* Buttons Section */}
          <div className="flex justify-end space-x-3">
            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                reset();
              }}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>

            {/* Add Button */}
            <button
              disabled={status.load || !currentName.trim()}
              type="submit"
              className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                status.load || !currentName.trim()
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600`}
            >
              {status.load ? "Loading..." : "Add"}
            </button>
          </div>
        </form>
      </ModalPop>
    </>
  );
};

export default Add;
