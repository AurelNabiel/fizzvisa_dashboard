"use client";
import React from "react";
import type { Customers } from "./components/data/Model";
import axios from "axios";
import Cookies from "js-cookie";
import Lottie from "react-lottie";
import empty from "@/json/empty.json";
import { useRouter } from "next/navigation";
import { decryptData } from "./components/Decryption";
import { Edit } from "iconsax-react";
import EditSubmitted from "./components/Edit";
import { ref } from "yup";

const SubmittedLinks: React.FC = () => {
  const route = useRouter();
  const [customers, setCustomers] = React.useState<Customers[]>([]);
  const [status, setStatus] = React.useState({ load: false, error: false });
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const token = Cookies.get("token");
  const [role, setRole] = React.useState<string>("");

  React.useEffect(() => {
    const userFromCookie = Cookies.get("user");
    const user = userFromCookie ? JSON.parse(userFromCookie) : null;
    // console.log(user);
    if (user) {
      setRole(user.role);
    }
  }, []);

  const getCustomers = async (key: string, page: number): Promise<void> => {
    console.log(key);

    setStatus({ load: true, error: false });
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DEV_API}/customer?page=${page}&limit=10${
          key !== "" ? `&keyword=${key}` : ""
        }&is_send_link=true`,
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

  React.useEffect(() => {
    getCustomers("", page);
  }, [page]);

  // select

  const [submitStatus, setSubmitStatus] = React.useState({
    load: false,
    error: false,
    message: "",
  });

  // filter agent

  // filter link sudah di send
  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex items-center justify-between pb-4">
          <h2 className="dark: text-lg font-semibold text-black">
            Submitted Link
          </h2>
          <div className="flex gap-x-3">
            <input
              type="text"
              placeholder="Search..."
              className="dark: rounded-md border bg-white px-4 py-2 text-sm text-black dark:border-strokedark dark:bg-boxdark"
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
                <th className="dark: min-w-[20px] px-1 py-4 font-medium text-black xl:pl-11">
                  No.
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
                <th className="dark: px-4 py-4 font-medium text-black">Link</th>

                <th className="dark: px-4 py-4 font-medium text-black">
                  Submitted Date
                </th>
                <th className="dark: px-4 py-4 font-medium text-black">Edit</th>
                <th className="dark: px-4 py-4 font-medium text-black">
                  Resend
                </th>
              </tr>
            </thead>
            <tbody>
              {!status.load
                ? customers.map((data, key) => (
                    <CustomerList
                      num={key}
                      setSubmitStatus={setSubmitStatus}
                      submitStatus={submitStatus}
                      key={key}
                      customers={data}
                      getCustomers={getCustomers}
                      currentPage={page}
                      role={role}
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

const CustomerList: React.FC<{
  currentPage: number;
  customers: Customers;
  getCustomers: (key: string, page: number) => Promise<void>;
  num: number;
  role: string;
  submitStatus: {
    load: boolean;
    error: boolean;
    message: string;
  };
  setSubmitStatus: React.Dispatch<
    React.SetStateAction<{
      load: boolean;
      error: boolean;
      message: string;
    }>
  >;
}> = ({
  customers,
  getCustomers,
  currentPage,
  setSubmitStatus,

  submitStatus,
  num,
}) => {
  const token = Cookies.get("token");
  const [editOpen, setEditOpen] = React.useState(false);
  const decryptedRefCode = decryptData(customers.ref_code);
  // console.log(decryptedRefCode, "HAI", customers.fullname);
  const route = useRouter();
  const [loading, setLoading] = React.useState(false);
  const handleSubmitSelected = async (
    data: [ref_code: string, email: string, fullname: string],
  ) => {
    setSubmitStatus({ load: true, error: false, message: "" });
    setLoading(true);
    try {
      const submitData = {
        data: [
          {
            ref_code: data[0],
            email: data[1],
            fullname: data[2],
          },
        ],
      };
      console.log(submitData);
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_DEV_API}/customer/send-link`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((res) => {
          console.log(res);
          setSubmitStatus({
            load: false,
            error: false,
            message: "Email has been added to the queue",
          });

          getCustomers("", 0);
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
      <tr>
        <th className="dark: min-w-[20px] px-1 py-4 font-medium text-black xl:pl-11">
          {(currentPage - 1) * 10 + num + 1}
        </th>
        <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
          <h5
            className={`dark: font-medium ${customers.send_status == "success" ? "text-success" : "text-black"}`}
          >
            {decryptedRefCode}
          </h5>
        </td>
        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <p
            className={`${customers.send_status == "success" ? "text-success" : "text-black"}`}
          >
            {(customers.first_name || customers.last_name) != null
              ? `${customers.first_name || ""} ${customers.last_name || ""}`
              : customers.fullname || "Name not available"}
          </p>
        </td>
        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <p
            className={`${customers.send_status == "success" ? "text-success" : "text-black"}`}
          >
            {customers.phone}
          </p>
        </td>
        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <p
            className={`${customers.send_status == "success" ? "text-success" : "text-black"}`}
          >
            {customers.email}
          </p>
        </td>
        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <p
            className={`${customers.send_status == "success" ? "text-success" : "text-black"}`}
          >
            {customers.ref_code_created_date
              ? new Date(customers.ref_code_created_date).toLocaleString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  },
                )
              : "Date not available"}
          </p>
        </td>
        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <p
            className={`${customers.send_status == "success" ? "text-success" : "text-black"}`}
          >
            {customers.ref_code}
          </p>
        </td>
        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <p
            className={`${customers.send_status == "success" ? "text-success" : "text-black"}`}
          >
            {customers.send_date
              ? new Date(customers.send_date).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : "Date not available"}
          </p>
        </td>
        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
          <Edit
            onClick={() => {
              setEditOpen(true);
            }}
            size="18"
            variant="Bold"
            className="mr-2 cursor-pointer hover:text-green-500"
          />
        </td>
        <td>
          <button
            disabled={submitStatus.load}
            className="hover:bg-primary-dark rounded-md bg-primary px-4 py-2 text-white"
            onClick={() => {
              handleSubmitSelected([
                customers.ref_code,
                customers.email ?? "",
                customers.fullname ?? "",
              ]);
            }}
          >
            {loading ? "Sending..." : "Resend"}
            {submitStatus.error && <span className="text-red-500">Error</span>}
            {submitStatus.message && !submitStatus.error && (
              <span className="text-green-500">Success</span>
            )}
          </button>
        </td>
      </tr>
      <EditSubmitted
        getData={() => getCustomers("", currentPage ?? 1)}
        id={customers.ref_code}
        email={customers.email ?? ""}
        isOpen={editOpen}
        setIsOpen={setEditOpen}
      />
    </>
  );
};

const CustomerLoader: React.FC = () => {
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
    </>
  );
};

export default SubmittedLinks;
