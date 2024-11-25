"use client";
import React from "react";
import type { Customers } from "./components/data/interface";
import axios from "axios";
import Cookies from "js-cookie";
import { Edit, HambergerMenu, More, Trash } from "iconsax-react";
import Lottie from "react-lottie";
import empty from "@/json/empty.json";
import Add from "./components/Add";
import { decryptData } from "./components/Decryption";
import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import DeleteCust from "./components/Delete";
const Customers: React.FC = () => {
  const [customers, setCustomers] = React.useState<Customers[]>([]);
  const [status, setStatus] = React.useState({ load: false, error: false });
  const token = Cookies.get("token");
  const getCustomers = async (key: string): Promise<void> => {
    setStatus({ load: true, error: false });
    try {
      await axios
        .get(
          `${process.env.NEXT_PUBLIC_DEV_API}/customer${key !== "" ? `?keyword=${key}` : ``}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((response) => {
          console.log(response.data);
          setCustomers(response.data.data);
          setStatus({ load: false, error: false });
        });
    } catch (error) {
      console.log(error);
      setStatus({ load: false, error: true });
    }
  };

  React.useEffect(() => {
    getCustomers("");
  }, []);
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
                  getCustomers(e.target.value);
                } else {
                  getCustomers("");
                }
              }}
            />
            <Add getCustomers={getCustomers} />
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
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
              </tr>
            </thead>
            <tbody>
              {customers.map((data, key) => (
                <CustomerList
                  key={key}
                  customers={data}
                  getCustomers={getCustomers}
                />
              ))}
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
      </div>
      {/* Edit */}

      {/* Edit */}
    </>
  );
};

const CustomerList: React.FC<{
  customers: Customers;
  getCustomers: (key: string) => Promise<void>;
}> = ({ customers, getCustomers }) => {
  const [editOpen, setEditOpen] = React.useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = React.useState<boolean>(false);
  const decryptedRefCode = decryptData(customers.ref_code);
  // console.log(decryptedRefCode, "HAI", customers.fullname);
  const route = useRouter();

  return (
    <>
      <tr>
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
                onClick={() => setEditOpen(true)}
                className="flex items-center text-sm text-green-700 hover:bg-green-100"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <Edit size="18" variant="Bold" className="mr-2" />
                Edit
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
        id={customers.id}
        fullname={customers.fullname ?? customers.first_name ?? "Unknown"}
        getCustomers={getCustomers}
        deleteOpen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
      />
    </>
  );
};

export default Customers;
