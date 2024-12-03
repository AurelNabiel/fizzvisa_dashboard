"use client";
import React from "react";
import Add from "../components/Add";
import axios from "axios";
import Cookies from "js-cookie";
const CustomerAdd: React.FC = () => {
  const [customers, setCustomers] = React.useState<any[]>([]);
  const [selectedCustomers, setSelectedCustomers] = React.useState<any[]>([]);
  const [status, setStatus] = React.useState<any>({
    load: false,
    error: false,
    message: "",
  });
  const token = Cookies.get("token");
  // Add a new customer to the list
  const handleAddCustomer = (customer: any) => {
    setCustomers((prev) => [...prev, customer]);
  };

  const handleCheckboxChange = (customer: any) => {
    setSelectedCustomers((prev) => {
      const isAlreadySelected = prev.some((c) => c.email === customer.email);
      if (isAlreadySelected) {
        return prev.filter((c) => c.email !== customer.email);
      } else {
        return [
          ...prev,
          {
            email: customer.email,
            phone: customer.phone,
            fullname: customer.fullname,
            depart_date: customer.depart_date,
            return_date: customer.return_date,
            ...(customer.ref_code && { ref_code: customer.ref_code }),
            ...(customer.ref_code_created_date && {
              ref_code_created_date: customer.ref_code_created_date,
            }),
          },
        ];
      }
    });
  };

  // Save selected customers
  const handleSaveSelected = async () => {
    // console.log("Saved Customers:", selectedCustomers);
    setStatus({ load: true, error: false, message: "" });
    try {
      const formData: { customers: any[] } = {
        customers: selectedCustomers,
      };
      console.log(formData);
      await axios
        .post(`${process.env.NEXT_PUBLIC_DEV_API}/customer/create`, formData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            setStatus({
              load: false,
              error: false,
              message: "Customers saved successfully.",
            });
            setCustomers([]);
            setSelectedCustomers([]);
          } else {
            setStatus({
              load: false,
              error: true,
              message: "An error occurred while saving customers.",
            });
          }
        });
    } catch (error) {
      setStatus({
        load: false,
        error: true,
        message: "An error occurred while saving customers.",
      });
    }
  };

  // Delete a customer from the list
  const deleteCustomer = (customer: any) => {
    setCustomers((prev) => prev.filter((c) => c !== customer));
    setSelectedCustomers((prev) => prev.filter((c) => c !== customer));
  };

  return (
    <div className=" mx-auto rounded-lg bg-gray-100 p-6 shadow-md dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          Add Customers
        </h2>
        <Add onAddCustomer={handleAddCustomer} />
      </div>

      {/* Customer List */}
      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
          Temporary Customer List
        </h3>
        <div className="mt-2 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-900">
          {customers.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No customers added yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {customers.map((customer, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 shadow-md transition hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  {/* Row Content */}
                  <div className="flex w-full items-center justify-between">
                    {/* Customer Information */}
                    <div className="flex flex-1 items-center gap-6">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedCustomers.some(
                          (selected) => selected.email === customer.email,
                        )}
                        onChange={() => handleCheckboxChange(customer)}
                        className="h-5 w-5 cursor-pointer rounded border-gray-300 accent-blue-600 transition focus:ring-2 focus:ring-blue-500 dark:border-gray-600"
                        aria-label={`Select ${customer.fullname}`}
                      />

                      {/* Customer Details */}
                      <div className="flex flex-col gap-1">
                        <p className="truncate text-base font-semibold text-gray-800 dark:text-gray-100">
                          {customer.fullname}
                        </p>
                        <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>✉️ {customer.email}</span>
                          <span>📞 {customer.phone}</span>
                          <span>🗓 Depart: {customer.depart_date}</span>
                          <span>Return: {customer.return_date}</span>
                          <span>
                            🔑 Ref Code:{" "}
                            {customer.ref_code_created_date ? (
                              <>
                                <span className="font-medium text-gray-800 dark:text-gray-200">
                                  {customer.ref_code} {" - "}{" "}
                                </span>
                                <span className="font-medium text-gray-800 dark:text-gray-200">
                                  {customer.ref_code_created_date}
                                </span>
                              </>
                            ) : (
                              "Not Provided"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => deleteCustomer(customer)}
                        className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-red-600 transition hover:text-red-800"
                        title="Delete"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Save Button */}
      {customers.length > 0 && (
        <div className="mt-4 text-right">
          <button
            disabled={selectedCustomers.length === 0}
            onClick={handleSaveSelected}
            className={`inline-block rounded-lg  px-4 py-2 font-medium text-white transition ${selectedCustomers.length === 0 ? "cursor-not-allowed bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            Save Selected Customers
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerAdd;
