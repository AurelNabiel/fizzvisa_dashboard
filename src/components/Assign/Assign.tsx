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
  const [selectedCustomers, setSelectedCustomers] = React.useState<any[]>([]);
  const [loadingCheckboxes, setLoadingCheckboxes] = React.useState<
    Record<string, boolean>
  >({});

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

  const handleCheckboxChange = async (customer: any) => {
    setLoadingCheckboxes((prev) => ({ ...prev, [customer.id]: true }));

    try {
      const updatedCustomer = { ...customer, is_paid: !customer.is_paid };

      // Update the selected customers list
      setSelectedCustomers((prev) =>
        prev.includes(customer)
          ? prev.filter((c) => c !== customer)
          : [...prev, customer],
      );

      // Create the payload with updated `is_paid` value
      const payload = {
        // email: updatedCustomer.email,
        // phone: updatedCustomer.phone,
        // fullname: updatedCustomer.fullname,
        // depart_date: updatedCustomer.depart_date,
        // return_date: updatedCustomer.return_date,
        // ref_code_created_date: updatedCustomer.ref_code_created_date,
        is_paid: updatedCustomer.is_paid,
      };

      await axios.put(
        `${process.env.NEXT_PUBLIC_DEV_API}/customer/edit/${customer.ref_code}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Update the customer in the customers state directly without refetching
      setCustomers((prevCustomers) =>
        prevCustomers.map((c) =>
          c.id === customer.id ? { ...c, is_paid: updatedCustomer.is_paid } : c,
        ),
      );
    } catch (error) {
      console.error("Error updating customer:", error);
    } finally {
      // Set loading state to false after the operation completes
      setLoadingCheckboxes((prev) => ({ ...prev, [customer.id]: false }));
    }
  };

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
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
                  setPage(1);
                } else {
                  getCustomers("", 1);
                  setPage(1);
                }
              }}
            />
          </div>
        </div>
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
                      handleCheckboxChange={handleCheckboxChange}
                      loadingCheckboxes={loadingCheckboxes}
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

        {/* Pagination Controls */}
        <div
          className={`${customers.length != 0 ? "flex" : "hidden"} items-center justify-between pb-3 pt-6`}
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
        </div>
      </div>
    </>
  );
};

const CustomerList: React.FC<{
  customers: Customers;
  getCustomers: (key: string, page: number) => Promise<void>;
  currentPage?: number;
  selectedCustomers: any[];
  handleCheckboxChange: (customer: any) => void;
  loadingCheckboxes: Record<string, boolean>;
}> = ({
  customers,
  handleCheckboxChange,
  selectedCustomers,
  loadingCheckboxes,
  getCustomers,
}) => {
  const decryptedRefCode = decryptData(customers.ref_code);
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <tr className="">
        <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
          {loadingCheckboxes[customers.id] ? (
            // Loading spinner for the checkbox
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-2 border-gray-300"></div>
          ) : (
            <input
              type="checkbox"
              disabled={loadingCheckboxes[customers.id]}
              className={`rounded-md border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:border-gray-400 disabled:bg-gray-200`}
              checked={
                customers.is_paid || selectedCustomers.includes(customers)
              }
              onChange={() => handleCheckboxChange(customers)}
            />
          )}
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
        customer_id={customers.id}
        name={customers.first_name ?? customers.fullname ?? "Unknown"}
        agent_id={customers.agent_id ?? 0}
      />
    </>
  );
};

const CustomerLoader: React.FC = () => {
  return (
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
        <div className="h-4 w-40 rounded bg-gray-300"></div>
      </td>
      <td className="animate-pulse border-b border-[#eee] px-4 py-5 dark:border-strokedark">
        <div className="h-4 w-28 rounded bg-gray-300"></div>
      </td>
      <td className="animate-pulse border-b border-[#eee] px-4 py-5 dark:border-strokedark">
        <div className="h-4 w-24 rounded bg-gray-300"></div>
      </td>
      <td className="animate-pulse border-b border-[#eee] px-4 py-5 dark:border-strokedark">
        <div className="h-4 w-20 rounded bg-gray-300"></div>
      </td>
      <td className="animate-pulse border-b border-[#eee] px-4 py-5 dark:border-strokedark">
        <div className="h-4 w-16 rounded bg-gray-300"></div>
      </td>
    </tr>
  );
};

export default Assign;
