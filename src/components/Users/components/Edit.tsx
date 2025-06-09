"use client";
import ModalPop from "@/components/ModalPop/ModalPop";
import { Button, Dialog } from "@headlessui/react";
import { Input, Typography } from "@material-tailwind/react";
import React from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Cookies from "js-cookie";

import { useForm, SubmitHandler, useWatch, set } from "react-hook-form";
import axios from "axios";
import { UserAccess } from "./data/model";

interface IFormInput {
  username: string;
  user_type: string;
  // role: string;
  // agent_id?: number;
  add: boolean;
  modify: boolean;
  delete: boolean;
  approve: boolean;
}

interface Agent {
  id: number;
  name: string;
  email: string;
  created_by: string;
}

interface EditProps {
  getData: (key: string, page: number) => Promise<void>;
  id: number;
  username: string;
  currentPage: number;
  user_type: string;
  agent_id: number;
  role: string;
  agent: Agent[];
  user_access: UserAccess;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}
const schema = yup
  .object({
    username: yup.string().required("Username is required"),

    user_type: yup.string().required("User type is required"),

    // role: yup.string().required("Role is required"),
    // agent_id: yup.number().optional(),
    add: yup.boolean().default(false),
    modify: yup.boolean().default(false),
    delete: yup.boolean().default(false),
    approve: yup.boolean().default(false),
  })
  .required();
const EditUsers: React.FC<EditProps> = ({
  getData,
  id,
  username,
  role,
  user_type,
  user_access,
  agent,
  agent_id,
  isOpen,
  currentPage,
  setIsOpen,
}) => {
  console.log(user_access);

  const token = Cookies.get("token");
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });
  // const currentName = useWatch({ control, name: "username" }) || "";
  // const currentUserType = useWatch({ control, name: "user_type" }) || "";

  const [status, setStatus] = React.useState({ load: false, error: false });
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setStatus({ load: true, error: false });
    try {
      const submittedData = {
        username: data.username,
        user_type: data.user_type,
        // role: data.role,
        // agent_id: data.agent_id,
        user_access: {
          add: data.add,
          modify: data.modify,
          delete: data.delete,
          approve: data.approve,
        },
      };
      await axios
        .put(`${process.env.NEXT_PUBLIC_DEV_API}/users/${id}`, submittedData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setStatus({ load: false, error: false });
          setIsOpen(false);
          getData("", currentPage);
          reset();
        });
    } catch (error) {
      console.log(error);
      setStatus({ load: false, error: true });
    }
  };

  return (
    <>
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
          Edit Users
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
              {...register("username", { required: true, value: username })}
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
              htmlFor="user_type"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              User Type
            </label>
            <div className="relative">
              <select
                {...register("user_type", { required: true, value: user_type })}
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

          {/* <div>
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
              {...register("role", { required: true, value: role })}
              type="text"
              placeholder="admin, agent, user"
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
          </div> */}

          {/* Checkbox Section */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Permissions
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register("add", { value: user_access.add })}
                  defaultChecked={user_access.add}
                  className="form-checkbox text-green-600 focus:ring-green-500 dark:focus:ring-green-400"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Add
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register("modify", { value: user_access.modify })}
                  defaultChecked={user_access.modify}
                  className="form-checkbox text-green-600 focus:ring-green-500 dark:focus:ring-green-400"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Modify
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register("delete", { value: user_access.delete })}
                  defaultChecked={user_access.delete}
                  className="form-checkbox text-green-600 focus:ring-green-500 dark:focus:ring-green-400"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Delete
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register("approve", { value: user_access.approve })}
                  defaultChecked={user_access.approve}
                  className="form-checkbox text-green-600 focus:ring-green-500 dark:focus:ring-green-400"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Approve
                </span>
              </label>
            </div>
          </div>
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
              disabled={status.load}
              type="submit"
              className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                status.load
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-green-600 hover:bg-green-700"
              } focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-500 dark:hover:bg-green-600`}
            >
              {status.load ? "Loading..." : "Edit"}
            </button>
          </div>
        </form>
      </ModalPop>
    </>
  );
};

export default EditUsers;
