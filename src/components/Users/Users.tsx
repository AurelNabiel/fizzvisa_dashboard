"use client";
import React from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Users: React.FC = () => {
  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-lg font-semibold text-black dark:text-white">
            Users
          </h2>
        </div>
      </div>
    </>
  );
};

export default Users;