"use client";
import ModalPop from "@/components/ModalPop/ModalPop";
import React from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Dialog } from "@headlessui/react";

interface DeleteProps {
  id: number;
  name: string;
  getData: (key: string) => Promise<void>;
  deleteOpen: boolean;
  setDeleteOpen: (value: boolean) => void;
}

const Delete: React.FC<DeleteProps> = ({
  id,
  name,
  getData,
  deleteOpen,
  setDeleteOpen,
}) => {
  const token = Cookies.get("token");
  const [status, setStatus] = React.useState({ load: false, error: false });

  const handleDelete = async () => {
    setStatus({ load: true, error: false });
    try {
      await axios
        .delete(`${process.env.NEXT_PUBLIC_DEV_API}/agent/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setStatus({ load: false, error: false });
          setDeleteOpen(false);
          getData("");
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ModalPop isOpen={deleteOpen} closeModalAdd={() => setDeleteOpen(false)}>
      <Dialog.Title
        as="h3"
        className="text-xl font-semibold text-gray-900 dark:text-white"
      >
        Delete Agent
      </Dialog.Title>
      <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
        Are you sure you want to delete "{name}"? This action cannot be undone.
      </p>
      <div className="mt-6 flex items-center justify-end space-x-3">
        <button
          onClick={() => setDeleteOpen(false)}
          className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
        disabled={status.load}
          onClick={() => {
            // Add your delete logic here
            handleDelete();
           
          }}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          {status.load ? "Deleting..." : "Delete"}
        </button>
      </div>
    </ModalPop>
  );
};

export default Delete;
