"use client";
import React from "react";
import { Customers } from "./components/data/model";
import Cookies from "js-cookie";
import axios from "axios";
import { decryptData } from "./components/Decryption";
import Lottie from "react-lottie";
import empty from "@/json/empty.json";
import ModalAssign from "./components/ModalAssign";
const Assign: React.FC = () => {
  const token = Cookies.get("token");
  const [submitStatus, setSubmitStatus] = React.useState({
    load: false,
    error: false,
    message: "",
  });
  const [status, setStatus] = React.useState<{ load: boolean; error: boolean }>(
    { load: false, error: false },
  );
  const [customers, setCustomers] = React.useState<Customers[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const [totalPages, setTotalPages] = React.useState<number>(1);

  const getCustomers = async (key: string, page: number) => {
    setStatus({ load: true, error: false });
    try {
      await axios
        .get(
          `${process.env.NEXT_PUBLIC_DEV_API}/customer?page=${page}&limit=10${
            key !== "" ? `&keyword=${key}` : ""
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((res) => {
          setCustomers(res.data.data);
          setTotalPages(res.data.meta.total_pages);
          setStatus({ load: false, error: false });
        });
    } catch (error) {
      console.error(error);
      setStatus({ load: false, error: true });
    }
  };

  React.useEffect(() => {
    getCustomers("", page);
  }, [page]);

  const [selectedCustomers, setSelectedCustomers] = React.useState<any[]>([]);

  const handleCheckboxChange = (customer: any) => {
    setSelectedCustomers((prev) =>
      prev.includes(customer)
        ? prev.filter((c) => c !== customer)
        : [...prev, customer],
    );
  };

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
          getCustomers("", page);
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
  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        {/* header */}
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-lg font-semibold text-black dark:text-white">
            Assign Agent to Customer
          </h2>
          <div className="flex gap-x-3">
            <input
              type="text"
              placeholder="Search..."
              className="rounded-md border bg-white px-4 py-2 text-sm text-black dark:border-strokedark dark:bg-boxdark dark:text-white"
              onChange={(e) => {
                if (e.target.value.length > 2) {
                  getCustomers(e.target.value, 1);
                  setPage(1); // Reset to first page on new search
                } else {
                  getCustomers("", 1);
                  setPage(1);
                }
              }}
            />
          </div>
        </div>
        {/* header */}
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
        {/* table */}
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[40px] px-4 py-4 pl-9 font-medium text-black dark:text-white xl:pl-11">
                  checkbox
                </th>
                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  Referal Code
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  Name
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Phone No.
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Email
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Date
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Agent Name
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Payment Status
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {!status.load
                ? customers.map((customer, key) => (
                    <CustomerList
                      key={key}
                      customers={customer}
                      getCustomers={getCustomers}
                      currentPage={page}
                      selectedCustomers={selectedCustomers}
                      setSelectedCustomers={setSelectedCustomers}
                      handleCheckboxChange={handleCheckboxChange}
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
        <div className={`${customers.length != 0 ? "flex" : "hidden"} items-center justify-between pb-3 pt-6`}>
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
            className={` rounded-lg border  px-4 py-2 text-white hover:bg-opacity-90 ${selectedCustomers.length === 0 || submitStatus.load ? "cursor-not-allowed bg-gray-300" : "bg-primary"}`}
            disabled={selectedCustomers.length === 0 || submitStatus.load}
          >
            {submitStatus.load ? "Sending..." : "Update Payment"}
          </button>
        </div>
        {/* table */}
      </div>
    </>
  );
};

const CustomerList: React.FC<{
  customers: Customers;
  currentPage?: number;
  getCustomers: (key: string, page: number) => Promise<void>;
  selectedCustomers: any[];
  setSelectedCustomers: (value: any[]) => void;
  handleCheckboxChange: (customer: any) => void;
}> = ({
  customers,
  getCustomers,
  currentPage,
  selectedCustomers,
  setSelectedCustomers,
  handleCheckboxChange,
}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const decryptedRefCode = decryptData(customers.ref_code);
  return (
    <>
      <tr className="">
        <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
          <input
            type="checkbox"
            disabled={customers.is_paid}
            className="rounded-md border-gray-300 text-primary focus:border-primary disabled:cursor-not-allowed disabled:opacity-100"
            checked={customers.is_paid || selectedCustomers.includes(customers)}
            onChange={() => {
              handleCheckboxChange(customers);
            }}
          />
        </td>
        <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
          <h5 className="font-medium text-black dark:text-white">
            {decryptedRefCode}
          </h5>
        </td>
        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <p className="text-black dark:text-white">
            {customers.first_name ?? customers.fullname ?? "Unknown"}
          </p>
        </td>
        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <p className="text-black dark:text-white">{customers.phone}</p>
        </td>
        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <p className="text-black dark:text-white">{customers.email}</p>
        </td>
        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <p className="text-black dark:text-white">
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
          <p className="text-black dark:text-white">
            {customers.agent?.name ?? "Unknown"}
          </p>
        </td>
        <td className=" items-center border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <p
            className={`rounded-full px-3  py-1 text-center text-white  dark:text-white ${customers.is_paid ? "bg-green-600" : "bg-red"}`}
          >
            {customers.is_paid ? "Paid" : "Not Paid"}
          </p>
        </td>
        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <button
            onClick={() => setOpen(true)}
            disabled={!customers.is_paid}
            className={`items-center rounded-full px-3 py-2 text-sm text-white ${!customers.is_paid ? "cursor-not-allowed bg-gray-300" : "bg-blue-600"} `}
          >
            Assign
          </button>
        </td>
      </tr>
      <ModalAssign
        ref_code={customers.ref_code}
        getCustomers={getCustomers}
        assignOpen={open}
        setAssignOpen={setOpen}
        name={customers.first_name ?? customers.fullname ?? "Unknown"}
        agent_id={customers.agent_id ?? 0}
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

export default Assign;
