"use client";
import React from "react";
import type { Agent, Customers } from "./components/data/interface";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Button,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import clsx from "clsx";
import Lottie from "react-lottie";
import empty from "@/json/empty.json";
import { useRouter } from "next/navigation";
import { decryptData } from "./components/Decryption";
import {
  ArrowDown2,
  Check,
  Edit,
  HambergerMenu,
  More,
  Task,
  Trash,
} from "iconsax-react";
import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import DeleteCust from "./components/Delete";
const Customers: React.FC = () => {
  const route = useRouter();
  const [customers, setCustomers] = React.useState<Customers[]>([]);
  const [status, setStatus] = React.useState({ load: false, error: false });
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const token = Cookies.get("token");

  const getCustomers = async (
    key: string,
    page: number,
    agent_id: number,
  ): Promise<void> => {
    setStatus({ load: true, error: false });
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DEV_API}/customer?page=${page}&limit=10${
          key !== "" ? `&keyword=${key}` : ""
        }${agent_id != 0 ? `&agent_ids=${agent_id}` : ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCustomers(response.data.data);
      setTotalPages(response.data.meta.total_pages);
      setStatus({ load: false, error: false });
    } catch (error) {
      console.error(error);
      setStatus({ load: false, error: true });
    }
  };

  // select
  const [selectedCustomers, setSelectedCustomers] = React.useState<any[]>([]);
  const selectAll =
    customers.length > 0 && selectedCustomers.length === customers.length;

  const handleCheckboxChange = (customer: any) => {
    setSelectedCustomers((prev) =>
      prev.includes(customer)
        ? prev.filter((c) => c !== customer)
        : [...prev, customer],
    );
  };
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCustomers([]); // Deselect all
    } else {
      setSelectedCustomers(customers); // Select all
    }
  };

  const [submitStatus, setSubmitStatus] = React.useState({
    load: false,
    error: false,
    message: "",
  });
  const handleSubmitSelected = async () => {
    setSubmitStatus({ load: true, error: false, message: "" });
    try {
      const submit = {
        data: selectedCustomers.map((customer) => {
          return {
            ref_code: decryptData(customer.ref_code),
            email: customer.email,
            fullname: customer.fullname,
          };
        }),
      };
      console.log(submit);

      await axios
        .post(`${process.env.NEXT_PUBLIC_DEV_API}/customer/send-link`, submit, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res);
          setSubmitStatus({
            load: false,
            error: false,
            message: "Link sent successfully",
          });
          setSelectedCustomers([]);
          getCustomers("", page, selectedAgents?.id ?? 0);
          setTimeout(() => {
            setSubmitStatus({ load: false, error: false, message: "" });
          }, 3000);
        });
    } catch (error) {
      console.log(error);
      setSubmitStatus({
        load: false,
        error: true,
        message: "Something went wrong",
      });
      setTimeout(() => {
        setSubmitStatus({ load: false, error: false, message: "" });
      }, 3000);
    }
  };

  // filter agent
  const [agents, setAgents] = React.useState<Agent[]>([]);
  const [agentStatus, setAgentStatus] = React.useState({
    load: false,
    error: false,
  });
  const [selectedAgents, setSelectedAgents] = React.useState<Agent | null>(null);
  const getAgents = async (): Promise<void> => {
    setAgentStatus({ load: true, error: false });
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DEV_API}/agent`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setAgents(response.data.data);
      setAgentStatus({ load: false, error: false });
    } catch (error) {
      console.error(error);
      setAgentStatus({ load: false, error: true });
    }
  };

  React.useEffect(() => {
    getAgents();
  }, []);

  React.useEffect(() => {
    getCustomers("", page, selectedAgents?.id ?? 0);
  }, [page, selectedAgents]);

  React.useEffect(() => {
    console.log(selectedAgents);
  }, [selectedAgents]);

  const handleFilter = (e: any) => {
    console.log(e);
    setSelectedAgents(e);
    setPage(1);
  };

  // filter link sudah di send
  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex items-center justify-between pb-4">
          <h2 className="dark: text-lg font-semibold text-black">Customers</h2>
          <div className="flex gap-x-3">
            <input
              type="text"
              placeholder="Search..."
              className="dark: rounded-md border bg-white px-4 py-2 text-sm text-black dark:border-strokedark dark:bg-boxdark"
              onChange={(e) => {
                if (e.target.value.length > 2) {
                  getCustomers(e.target.value, 1, selectedAgents?.id ?? 0);
                  setPage(1); // Reset to first page on new search
                  setSelectedAgents(null);
                } else {
                  getCustomers("", 1, selectedAgents?.id ?? 0);
                  setPage(1);
                  setSelectedAgents(null);
                }
              }}
            />
            <Button
              onClick={() => route.push("/customers/add")}
              className="w-full cursor-pointer rounded-lg border border-primary bg-primary px-4 py-2 text-white transition hover:bg-opacity-90"
            >
              Add +
            </Button>
            <Listbox value={selectedAgents} onChange={handleFilter}>
              <div className="relative">
                <ListboxButton
                  className={
                    "inline-flex items-center justify-between whitespace-nowrap rounded-md bg-primary px-5 py-3 font-semibold text-white"
                  }
                >
                  {selectedAgents ? selectedAgents.name : "Agents"}
                  <ArrowDown2
                    className="group pointer-events-none ml-2 size-4 fill-white/60"
                    aria-hidden="true"
                  />
                </ListboxButton>
                <ListboxOptions
                  anchor="bottom"
                  transition
                  className={
                    "mt-1 max-h-60 overflow-auto rounded-md bg-primary py-1 text-base text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                  }
                >
                  <ListboxOption
                    value={""}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-6 pr-4 ${
                        active ? "bg-blue-100 text-blue-900" : "text-white"
                      }`
                    }
                  >
                    <div
                      className={`block cursor-pointer ${
                        selectedAgents ? "font-medium" : "font-normal"
                      }`}
                    >
                      Agents
                    </div>
                  </ListboxOption>
                  {agents.map((person) => (
                    <ListboxOption
                      key={person.name}
                      value={person}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-6 pr-4 ${
                          active ? "bg-blue-100 text-blue-900" : "text-white"
                        }`
                      }
                    >
                      <div
                        className={`block cursor-pointer ${
                          selectedAgents ? "font-medium" : "font-normal"
                        }`}
                      >
                        {person.name}
                      </div>
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>
          </div>
        </div>

        {/* Notification Messages */}
        {submitStatus.message && !submitStatus.error && (
          <div className="mb-4 rounded-md bg-green-100 p-4 text-green-800">
            {submitStatus.message}
          </div>
        )}
        {submitStatus.message && submitStatus.error && (
          <div className="mb-4 rounded-md bg-red-100 p-4 text-red-800">
            {submitStatus.message}
          </div>
        )}
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="dark: min-w-[40px] px-4 py-4 pl-9 font-medium text-black xl:pl-11">
                  <input
                    type="checkbox"
                    className="rounded-md border-gray-300 text-primary focus:border-primary"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="dark: min-w-[220px] px-4 py-4 font-medium text-black xl:pl-11">
                  Referal Code
                </th>
                <th className="dark: min-w-[150px] px-4 py-4 font-medium text-black">
                  Name
                </th>
                <th className="dark: min-w-[120px] px-4 py-4 font-medium text-black">
                  Phone No.
                </th>
                <th className="dark: px-4 py-4 font-medium text-black">
                  Email
                </th>
                <th className="dark: px-4 py-4 font-medium text-black">Date</th>
                <th className="dark: px-4 py-4 font-medium text-black">
                  Agent Name
                </th>
                <th className="dark: px-4 py-4 font-medium text-black">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {!status.load
                ? customers.map((data, key) => (
                    <CustomerList
                      selectedCustomers={selectedCustomers}
                      setSelectedCustomers={setSelectedCustomers}
                      handleCheckboxChange={handleCheckboxChange}
                      key={key}
                      customers={data}
                      getCustomers={getCustomers}
                      currentPage={page}
                      setSelected={setSelectedAgents}
                    />
                  ))
                : [...Array(5)].map((_, key) => <CustomerLoader key={key} />)}
            </tbody>
          </table>
          {customers.length === 0 && !status.load && (
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
          className={`${customers.length != 0 || customers.length > 10 ? "flex" : "hidden"} items-center justify-between pb-3 pt-6`}
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
                setSelectedCustomers([]);
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
                    setSelectedCustomers([]);
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
          <button
            onClick={handleSubmitSelected}
            className={` rounded-lg border  px-4 py-2  hover:bg-opacity-90 ${selectedCustomers.length === 0 || submitStatus.load ? "cursor-not-allowed bg-gray-300" : "bg-primary"}`}
            disabled={selectedCustomers.length === 0 || submitStatus.load}
          >
            {submitStatus.load ? "Sending..." : "Send Link"}
          </button>
        </div>
      </div>
    </>
  );
};

const CustomerList: React.FC<{
  currentPage?: number;
  customers: Customers;
  getCustomers: (key: string, page: number, agent_id: number) => Promise<void>;
  selectedCustomers: any[];
  setSelectedCustomers: (value: any[]) => void;
  handleCheckboxChange: (customer: any) => void;
  setSelected: (value: Agent | null) => void;
}> = ({
  customers,
  getCustomers,
  currentPage,
  selectedCustomers,
  setSelectedCustomers,
  handleCheckboxChange,
  setSelected,
}) => {
  const [assignOpen, setAssingOpen] = React.useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = React.useState<boolean>(false);
  const decryptedRefCode = decryptData(customers.ref_code);
  // console.log(decryptedRefCode, "HAI", customers.fullname);
  const route = useRouter();

  return (
    <>
      <tr>
        <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
          <input
            type="checkbox"
            className="rounded-md border-gray-300 text-primary focus:border-primary"
            checked={selectedCustomers.includes(customers)}
            onChange={() => {
              handleCheckboxChange(customers);
            }}
          />
        </td>
        <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
          <h5 className="dark: font-medium text-black">{decryptedRefCode}</h5>
        </td>
        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <p className="dark: text-black">
            {customers.first_name ?? customers.fullname ?? "Unknown"}
          </p>
        </td>
        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <p className="dark: text-black">{customers.phone}</p>
        </td>
        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <p className="dark: text-black">{customers.email}</p>
        </td>
        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <p className="dark: text-black">
            {customers.ref_code_created_date
              ? new Date(customers.ref_code_created_date).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )
              : "Date not available"}
          </p>
        </td>
        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <p className="dark: text-black">
            {customers.agent?.name ?? "Unknown"}
          </p>
        </td>
        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          {/* Dropdown Container */}
          <Menu placement="bottom-end">
            <MenuHandler>
              <button className="">
                <HambergerMenu size="24" variant="Bold" className="mr-2" />{" "}
                {/* Burger Icon */}
              </button>
            </MenuHandler>

            {/* Dropdown Menu */}
            <MenuList
              className="space-y-2"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <MenuItem
                onClick={() => {
                  route.push(`/customers/${customers.ref_code}`);
                }}
                className="flex items-center text-sm text-gray-700 hover:bg-gray-100"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <More size="18" variant="Bold" className="mr-2" />
                Detail
              </MenuItem>

              <MenuItem
                onClick={() => setDeleteOpen(true)}
                className="flex items-center text-sm text-red-600 hover:bg-red-100"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <Trash size="18" variant="Bold" className="mr-2" />
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </td>
      </tr>
      <DeleteCust
        currentPage={currentPage ?? 1}
        id={customers.id}
        fullname={customers.fullname ?? customers.first_name ?? "Unknown"}
        getCustomers={getCustomers}
        deleteOpen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
        setSelected={setSelected}
      />
    </>
  );
};

const CustomerLoader: React.FC = () => {
  return (
    <>
      <tr className="animate-pulse space-x-4">
        <td className="  px-4 py-2 pl-9">
          <div className="h-2 w-20 rounded-full bg-slate-700"></div>
        </td>
        <td className="  px-4 py-2">
          <div className="h-2 w-1/2 rounded-full bg-slate-700"></div>
        </td>
        <td className="  px-4 py-2">
          <div className="h-2 w-1/2 rounded-full bg-slate-700"></div>
        </td>
        <td className="  px-4 py-2">
          <div className="h-2 w-1/2 rounded-full bg-slate-700"></div>
        </td>
        <td className="  px-4 py-2">
          <div className="h-2 w-1/2 rounded-full bg-slate-700"></div>
        </td>
        <td className="  px-4 py-2">
          <div className="h-2 w-1/2 rounded-full bg-slate-700"></div>
        </td>
      </tr>
    </>
  );
};

export default Customers;
