"use client";
import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Add from "./components/Add";
import { Edit, Trash } from "iconsax-react";
import ModalPop from "../ModalPop/ModalPop";
import EditAgent from "./components/Edit";
import Delete from "./components/Delete";

interface Agent {
  id: number;
  name: string;
  created_by: string;
}

const Agents: React.FC = () => {
  const [agents, setAgents] = React.useState<Agent[]>([]);
  const [status, setStatus] = React.useState({ load: false, error: false });
  const token = Cookies.get("token");
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

  //   edit

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-lg font-semibold text-black dark:text-white">
            Agents
          </h2>
          <div className="flex gap-x-3">
            <input
              type="text"
              placeholder="Search..."
              className="rounded-md border bg-white px-4 py-2 text-sm text-black dark:border-strokedark dark:bg-boxdark dark:text-white"
              onChange={(e) => {
                if (e.target.value.length > 2) {
                  getData(e.target.value);
                } else {
                  getData("");
                }
              }}
            />
            <Add getData={getData} />
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  No.
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  Name
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Created By
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {agents.map((data, key) => (
                <AgentItem key={key} agent={data} getData={getData} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Edit */}

      {/* Edit */}
    </>
  );
};

const AgentItem: React.FC<{
  agent: Agent;
  getData: (key: string) => Promise<void>;
}> = ({ agent, getData }) => {
  const [editOpen, setEditOpen] = React.useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = React.useState<boolean>(false);
  return (
    <>
      <tr>
        <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
          <h5 className="font-medium text-black dark:text-white">{agent.id}</h5>
        </td>
        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <p className="text-black dark:text-white">{agent.name}</p>
        </td>
        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <p className="text-black dark:text-white">{agent.created_by}</p>
        </td>
        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <div className="flex items-center space-x-3.5">
            <button className="hover:text-meta-3">
              <Edit
                onClick={() => setEditOpen(true)}
                size="18"
                variant="Bold"
              />
            </button>
            <button className="hover:text-danger">
              <Trash onClick={() => setDeleteOpen(true)} size="18" variant="Bold" />
            </button>
          </div>
        </td>
      </tr>
      <EditAgent
        getData={getData}
        id={agent.id}
        name={agent.name}
        isOpen={editOpen}
        setIsOpen={setEditOpen}
      />
      <Delete
        id={agent.id}
        name={agent.name}
        deleteOpen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
        getData={getData}
      />
    </>
  );
};

export default Agents;
