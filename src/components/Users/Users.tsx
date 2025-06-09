"use client";
import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Agent, Datum, UserAccess } from "./components/data/model";
import {
  Button,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { useRouter } from "next/navigation";
import { Edit, Trash } from "iconsax-react";
import Lottie from "react-lottie";
import empty from "@/json/empty.json";
import Add from "./components/Add";
import DeleteUser from "./components/Delete";
import EditUsers from "./components/Edit";

const Users: React.FC = () => {
  const route = useRouter();

  const token = Cookies.get("token");
  const [users, setUsers] = React.useState<Datum[]>([]);
  const [status, setStatus] = React.useState({ load: false, error: false });
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [access, setAccess] = React.useState<UserAccess>({
    id: 0,
    add: false,
    modify: false,
    delete: false,
    approve: false,
    reference_id: 0,
    created_at: new Date(),
    updated_at: new Date(),
  });

  const [email, setEmail] = React.useState<string>("");
  const [userType, setUserType] = React.useState<string>("");
  React.useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      const user = JSON.parse(userCookie);
      setEmail(user.email);
      setAccess(user.user_access);
      setUserType(user.user_type);
    } else {
      route.push("/auth/signin");
    }
  }, []);

  const getData = async (key: string, page: number) => {
    setStatus({ load: true, error: false });
    try {
      await axios
        .get(
          `${process.env.NEXT_PUBLIC_DEV_API}/users?page=${page}&limit=10${key !== "" ? `&keyword=${key}` : ``}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((response) => {
          console.log(response.data);
          setUsers(response.data.data);
          setTotalPages(response.data.meta.total_pages);
          setStatus({ load: false, error: false });
        });
    } catch (error) {
      console.log(error);
      setStatus({ load: false, error: true });
    }
  };

  React.useEffect(() => {
    getData("", page);
  }, [page]);

  const [agent, setAgent] = React.useState<Agent[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const getAgent = async () => {
    setLoading(true);
    try {
      await axios
        .get(`${process.env.NEXT_PUBLIC_DEV_API}/agent`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setAgent(response.data.data);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getAgent();
  }, []);
  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-lg font-semibold text-black dark:text-white">
            Users
          </h2>
          <div className="flex gap-x-3">
            <input
              type="text"
              placeholder="Search..."
              className="dark: rounded-md border bg-white px-4 py-2 text-sm text-black dark:border-strokedark dark:bg-boxdark"
              onChange={(e) => {
                if (e.target.value.length > 2) {
                  getData(e.target.value, 1);
                  setPage(1); // Reset to first page on new search
                } else if (e.target.value.length === 0) {
                  getData("", 1);
                  setPage(1);
                }
              }}
            />
            {access.add && userType !== "staff" ? (
              <Add getData={getData} />
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[20px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  No.
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  Name
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  Email
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  User Type
                </th>

                {(access.modify || access.delete) && userType !== "staff" ? (
                  <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                ) : (
                  <></>
                )}
              </tr>
            </thead>
            <tbody>
              {!status.load
                ? users
                    .filter((user) => user.email !== email)
                    .map((user: Datum, key: React.Key | null | undefined) => (
                      <UsersList
                        userType={userType}
                        currentPage={page}
                        num={key}
                        page={page}
                        key={key}
                        getData={getData}
                        users={user}
                        agent={agent}
                        access={access}
                      />
                    ))
                : [...Array(5)].map((_, key) => <UserLoader key={key} />)}
            </tbody>
          </table>
          {users.length === 0 && !status.load && (
            <div className="flex justify-center">
              <div className="w-1/4">
                <Lottie
                  options={{
                    animationData: empty,
                    rendererSettings: {
                      preserveAspectRatio: "xMidYMid slice",
                    },
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <div
          className={`${users.length > 9 && page > 1 ? "flex" : "hidden"} items-center justify-between pb-3 pt-6`}
        >
          <nav aria-label="Pagination" className="flex items-center space-x-2">
            <button
              className={`rounded-lg border px-4 py-2 ${
                page === 1
                  ? "cursor-not-allowed bg-gray-300 text-gray-500"
                  : "hover:bg-primary-dark bg-primary text-white"
              }`}
              disabled={page === 1}
              onClick={() => {
                setPage((prev) => prev - 1);
              }}
            >
              Previous
            </button>

            {page > 3 && (
              <>
                <button
                  className="rounded-lg border bg-white px-3 py-2 text-black hover:bg-gray-200"
                  onClick={() => setPage(1)}
                >
                  1
                </button>
                <span className="px-2 text-gray-500">...</span>
              </>
            )}

            {Array.from(
              { length: Math.min(5, totalPages) },
              (_, i) => Math.max(page - 2, 1) + i,
            )
              .filter((p) => p <= totalPages)
              .map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPage(p);
                  }}
                  className={`rounded-lg border px-3 py-2 ${
                    page === p
                      ? "bg-primary text-white"
                      : "bg-white text-black hover:bg-gray-200"
                  }`}
                >
                  {p}
                </button>
              ))}

            {page < totalPages - 2 && (
              <>
                <span className="px-2 text-gray-500">...</span>
                <button
                  className="rounded-lg border bg-white px-3 py-2 text-black hover:bg-gray-200"
                  onClick={() => setPage(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              className={`rounded-lg border px-4 py-2 ${
                page === totalPages
                  ? "cursor-not-allowed bg-gray-300 text-gray-500"
                  : "hover:bg-primary-dark bg-primary text-white"
              }`}
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Users;

const UsersList: React.FC<{
  users: Datum;
  getData: (key: string, page: number) => Promise<void>;
  agent?: Agent[];
  page: number;
  num: React.Key | null | undefined;
  access: UserAccess;
  currentPage: number;
  userType: string;
}> = ({ users, getData, page, agent, access, num, currentPage, userType }) => {
  const [openDelete, setOpenDelete] = React.useState<boolean>(false);
  const [openEdit, setOpenEdit] = React.useState<boolean>(false);
  return (
    <>
      <tr>
        <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
          <h5 className="dark: font-medium text-black">
            {(currentPage - 1) * 10 + (typeof num === "number" ? num : 0) + 1}
          </h5>
        </td>
        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <p className="text-black dark:text-white">{users.username}</p>
        </td>
        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <p className="text-black dark:text-white">{users.email}</p>
        </td>
        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <p className="text-black dark:text-white">{users.user_type}</p>
        </td>

        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <div className="flex items-center space-x-3.5">
            {access.modify && userType !== "staff" ? (
              <button
                onClick={() => {
                  setOpenEdit(true);
                }}
                className="hover:text-meta-3"
              >
                <Edit size="18" variant="Bold" />
              </button>
            ) : (
              <></>
            )}
            {access.delete && userType !== "staff" ? (
              <button
                onClick={() => {
                  setOpenDelete(true);
                }}
                className="hover:text-danger"
              >
                <Trash size="18" variant="Bold" />
              </button>
            ) : (
              <></>
            )}
          </div>
        </td>
      </tr>
      <DeleteUser
        id={users.id}
        fullname={users.username}
        getData={getData}
        deleteOpen={openDelete}
        setDeleteOpen={setOpenDelete}
        currentPage={page}
      />
      <EditUsers
        agent={agent ?? []}
        user_type={users.user_type}
        currentPage={page}
        getData={getData}
        user_access={users.user_access}
        agent_id={users.agent?.id ?? 0}
        id={users.id}
        username={users.username}
        role={users.role}
        isOpen={openEdit}
        setIsOpen={setOpenEdit}
      />
    </>
  );
};

const UserLoader: React.FC = () => {
  return (
    <>
      <tr>
        <td className="animate-pulse border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <div className="h-8 w-8 rounded-full bg-gray-300"></div>
        </td>
        <td className="animate-pulse border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <div className="h-4 w-24 rounded bg-gray-300"></div>
        </td>
        <td className="animate-pulse border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <div className="h-4 w-36 rounded bg-gray-300"></div>
        </td>
        <td className="animate-pulse border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <div className="h-4 w-28 rounded bg-gray-300"></div>
        </td>
        <td className="animate-pulse border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <div className="h-4 w-28 rounded bg-gray-300"></div>
        </td>
      </tr>
    </>
  );
};
