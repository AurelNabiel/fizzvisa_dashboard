"use client";
import React from "react";
import { FileText } from "lucide-react";
import { Button } from "@headlessui/react";
import axios from "axios";
import { useParams } from "next/navigation";
import Image from "next/image";
import Cookies from "js-cookie";

const CustomerDetail: React.FC = () => {
  const token = Cookies.get("token");

  interface CustomerDetails {
    referralCode: string;
    phoneNumber: string;
    name: string;
    email: string;
    maritalStatus: string;
    address: string;
    visaDetail: {
      submission: string;
      destination: string;
      purpose: string;
      departure: string;
      return: string;
    };
    passportDetail: {
      number: string;
      issueDate: string;
      expiryDate: string;
    };
  }

  const [details, setDetails] = React.useState<CustomerDetails>({
    referralCode: "N/A",
    phoneNumber: "N/A",
    name: "N/A",
    email: "N/A",
    maritalStatus: "N/A",
    address: "N/A",
    visaDetail: {
      submission: "N/A",
      destination: "N/A",
      purpose: "N/A",
      departure: "N/A",
      return: "N/A",
    },
    passportDetail: {
      number: "N/A",
      issueDate: "N/A",
      expiryDate: "N/A",
    },
  });
  interface Document {
    label: string;
    name: string;
  }

  const [documents, setDocuments] = React.useState<Document[]>([]);
  const [status, setStatus] = React.useState({ load: false, error: false });
  const id = useParams<{ id: string }>().id;

  const getData = async () => {
    setStatus({ load: true, error: false });
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_DEV_API}/customer/${id}`,
      );
      const customerData = res.data.data;

      // Update the details state
      setDetails({
        referralCode: customerData.ref_code || "N/A",
        phoneNumber: customerData.phone || "N/A",
        name:
          (customerData.first_name || customerData.last_name) != null
            ? `${customerData.first_name || ""} ${customerData.last_name || ""}`
            : customerData.fullname || "Name not available",
        email: customerData.email || "N/A",
        maritalStatus: customerData.marital_status || "N/A",
        address: customerData.address || "N/A",
        visaDetail: {
          submission: customerData.visa_submission_date || "N/A",
          destination: customerData.destination || "N/A",
          purpose: customerData.visa_purpose || "N/A",
          departure: customerData.depart_date || "N/A",
          return: customerData.return_date || "N/A",
        },
        passportDetail: {
          number: customerData.passport_number || "N/A",
          issueDate: customerData.passport_issued_date || "N/A",
          expiryDate: customerData.passport_expired_date || "N/A",
        },
      });

      // Update the documents state
      setDocuments([
        {
          label: "Selfie",
          name: customerData.document?.selfie || "Not Uploaded",
        },
        {
          label: "KK",
          name: customerData.document?.family_card || "Not Uploaded",
        },
        {
          label: "Buku Nikah",
          name: customerData.document?.married || "Not Uploaded",
        },
        {
          label: "Passport",
          name: customerData.document?.passport || "Not Uploaded",
        },
        {
          label: "Akta",
          name: customerData.document?.birth_certificate || "Not Uploaded",
        },
        {
          label: "Bank Statement",
          name: customerData.document?.bank_statement || "Not Uploaded",
        },
        { label: "KTP", name: customerData.document?.ktp || "Not Uploaded" },
        {
          label: "Vaksin",
          name: customerData.document?.vaccine || "Not Uploaded",
        },
        {
          label: "Additional Document 1",
          name: customerData.document?.additional_document1 || "Not Uploaded",
        },
        {
          label: "Additional Document 2",
          name: customerData.document?.additional_document2 || "Not Uploaded",
        },
        {
          label: "Additional Document 3",
          name: customerData.document?.additional_document3 || "Not Uploaded",
        },
      ]);
      console.log(customerData);

      setStatus({ load: false, error: false });
    } catch (error) {
      console.error(error);
      setStatus({ load: false, error: true });
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  // download
  const [submitStatus, setSubmitStatus] = React.useState({
    load: false,
    error: false,
    message: "",
  });
  const handleDownload = async () => {
    try {
      setSubmitStatus({ load: true, error: false, message: "" });
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DEV_API}/customer/download?customer_ids=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Important for downloading files
        },
      );

      // Create a link element to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const timestamp = new Date().toISOString().replace(/[:.]/g, "");
      link.setAttribute("download", `${details.name}-${timestamp}.xlsx`); // Set the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSubmitStatus({
        load: false,
        error: false,
        message: "Data downloaded successfully",
      });
      setTimeout(() => {
        setSubmitStatus({ load: false, error: false, message: "" });
      }, 3000);
    } catch (error) {
      console.log(error);
      setSubmitStatus({
        load: false,
        error: true,
        message: "Failed to download data",
      });
      setTimeout(() => {
        setSubmitStatus({ load: false, error: false, message: "" });
      }, 3000);
    }
  };

  const handleDownloadDocuments = async () => {
    try {
      setSubmitStatus({ load: true, error: false, message: "" });
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DEV_API}/customer/download-documents?customer_ids=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        },
      );

      // Create a link element to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const timestamp = new Date().toISOString().replace(/[:.]/g, "");
      link.setAttribute(
        "download",
        `${details.name}-documents-${timestamp}.zip`,
      ); // Set the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSubmitStatus({
        load: false,
        error: false,
        message: "Documents downloaded successfully",
      });
      setTimeout(() => {
        setSubmitStatus({ load: false, error: false, message: "" });
      }, 3000);
    } catch (error) {
      console.log(error);
      setSubmitStatus({
        load: false,
        error: true,
        message: "Failed to download data",
      });
      setTimeout(() => {
        setSubmitStatus({ load: false, error: false, message: "" });
      }, 3000);
    }
  };

  // image load
  const [imageLoad, setImageLoad] = React.useState<boolean>(true);

  return (
    <>
      <div>
        <div className="flex items-center justify-between pb-10">
          <h1 className="text-2xl font-bold text-black">Customer Detail</h1>
          <Button
            className="rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
            onClick={() => {
              handleDownload();
            }}
          >
            {submitStatus.load ? "Downloading..." : "Download Data"}
          </Button>
        </div>
        {status.load ? (
          <Loader />
        ) : (
          <div className="flex h-full w-full flex-col gap-y-2">
            {/* top */}
            <div className="flex h-full w-full items-stretch justify-between gap-x-3">
              {/* Left Section */}
              <div className="flex w-3/4 flex-col space-y-3 text-white">
                {/* Referral & Phone */}
                <div className="flex w-full justify-center gap-x-3 text-2xl font-bold">
                  <div className="flex flex-1 flex-col gap-y-2 rounded-xl bg-[#FF7800] px-5 py-6">
                    <h1 className="text-xl font-semibold">Referral Code</h1>
                    <div className="border-b-2"></div>
                    <h2 className="text-2xl">{details.referralCode}</h2>
                  </div>
                  <div className="flex flex-1 flex-col gap-y-2 rounded-xl bg-[#FF7800] px-5 py-6">
                    <h1 className="text-xl font-semibold">Phone Number</h1>
                    <div className="border-b-2"></div>
                    <h2 className="text-2xl">{details.phoneNumber}</h2>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="flex flex-1 flex-col gap-y-2 rounded-xl bg-[#FF7800] px-5 py-6">
                  <h1 className="text-2xl font-semibold">
                    Personal Information
                  </h1>
                  <div className="border-b-2"></div>
                  <div className="grid grid-cols-2 gap-y-2">
                    <span className="text-lg font-medium">Name</span>
                    <span className="text-lg">: {details.name}</span>

                    <span className="text-lg font-medium">Email</span>
                    <span className="text-lg">: {details.email}</span>

                    <span className="text-lg font-medium">Marital Status</span>
                    <span className="text-lg">: {details.maritalStatus}</span>

                    <span className="text-lg font-medium">Address</span>
                    <span className="text-lg">: {details.address}</span>
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex w-1/4 flex-col gap-y-2 text-white">
                <div className="flex flex-1 flex-col gap-y-2 rounded-xl bg-[#FF7800] px-5 py-6">
                  <h1 className="text-xl font-bold">Visa Detail</h1>
                  <div className="border-b-2"></div>
                  <div className="flex flex-col gap-y-2 text-lg">
                    <div className="flex gap-x-2">
                      <span className="font-medium">Submission</span>
                      <span>: {details.visaDetail?.submission}</span>
                    </div>
                    <div className="flex gap-x-2">
                      <span className="font-medium">Destination</span>
                      <span>: {details.visaDetail?.destination}</span>
                    </div>
                    <div className="flex gap-x-2">
                      <span className="font-medium">Visa Purpose</span>
                      <span>: {details.visaDetail?.purpose}</span>
                    </div>
                    <div className="flex gap-x-2">
                      <span className="font-medium">Departure</span>
                      <span>: {details.visaDetail?.departure}</span>
                    </div>
                    <div className="flex gap-x-2">
                      <span className="font-medium">Return</span>
                      <span>: {details.visaDetail?.return}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-y-2 rounded-xl bg-[#FF7800] px-5 py-6">
                  <h1 className="text-xl font-bold">Passport Detail</h1>
                  <div className="border-b-2"></div>
                  <div className="flex flex-col gap-y-2 text-lg">
                    <div className="flex gap-x-2">
                      <span className="font-medium">Passport Number</span>
                      <span>: {details.passportDetail?.number}</span>
                    </div>
                    <div className="flex gap-x-2">
                      <span className="font-medium">Issue Date</span>
                      <span>: {details.passportDetail?.issueDate}</span>
                    </div>
                    <div className="flex gap-x-2">
                      <span className="font-medium">Expiry Date</span>
                      <span>: {details.passportDetail?.expiryDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* bottom */}
            <div className="flex w-full flex-col gap-y-2 rounded-xl bg-[#FF7800] px-5 py-6 text-white">
              <div className="flex w-full items-center justify-between">
                <h1 className="text-xl font-semibold">Uploaded Documents</h1>
                <Button
                  className="transform rounded bg-white px-4 py-2 font-bold text-[#FF7800] ease-in-out hover:bg-orange-600 hover:text-white"
                  onClick={() => {
                    handleDownloadDocuments();
                  }}
                >
                  {submitStatus.load
                    ? "Downloading..."
                    : "Download All Documents"}
                </Button>
              </div>
              <div className="border-b-2"></div>
              <div className="mt-2 grid grid-cols-2 gap-4 md:grid-cols-3">
                {documents.map((doc, index) => {
                  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(doc.name);

                  return (
                    <div
                      key={index}
                      className="flex flex-col items-start  rounded-lg bg-white p-3 text-black shadow-md"
                    >
                      <div className="flex w-full  items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-6 w-6 text-orange-500" />
                          <div className="flex-1">
                            <p className="text-base font-medium">{doc.label}</p>
                            <p className="text-sm text-gray-500">{doc.name}</p>
                          </div>
                        </div>
                        <div>
                          <button
                            disabled={doc.name == "Not Uploaded" ? true : false}
                            className={`border-none bg-transparent p-1 ${doc.name == "Not Uploaded" ? "text-gray-500" : "text-orange-500"}`}
                            onClick={() => {
                              const apiUrl: string =
                                process.env.NEXT_PUBLIC_DEV_API || "";
                              const baseUrl: string = apiUrl.replace(
                                "/api",
                                "",
                              );
                              window.open(`${baseUrl}/assets/${doc.name}`);
                            }}
                          >
                            View
                          </button>
                        </div>
                      </div>
                      {isImage && (
                        <div className="relative mt-2">
                          {imageLoad && (
                            <div className="absolute inset-0 flex items-center justify-center rounded bg-gray-100">
                              <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
                            </div>
                          )}
                          <Image
                            src={`${process.env.NEXT_PUBLIC_DEV_API?.replace("/api", "")}/assets/${doc.name}`}
                            alt={`image-${index}`}
                            className={`rounded object-cover transition-opacity duration-300 ${
                              imageLoad ? "opacity-0" : "opacity-100"
                            }`}
                            style={{
                              maxHeight: "200px",
                              width: "auto",
                              height: "auto",
                            }}
                            width={0}
                            height={0}
                            sizes="100vw"
                            onLoadingComplete={() => setImageLoad(false)}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomerDetail;

const Loader: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-col gap-y-2">
      {/* top */}
      <div className="flex h-full w-full items-stretch justify-between gap-x-3 ">
        {/* Left Section */}
        <div className="flex w-3/4 flex-col space-y-3 text-white">
          {/* Referral & Phone */}
          <div className="flex w-full justify-center gap-x-3 text-2xl font-bold">
            <div className="flex flex-1 animate-pulse flex-col gap-y-2 rounded-xl bg-[#FF7800] px-5 py-6">
              <div className="h-4 w-3/4 rounded bg-orange-600"></div>
              <div className="border-b-2"></div>
              <div className="h-6 w-1/2 rounded bg-orange-600"></div>
            </div>
            <div className="flex flex-1 animate-pulse flex-col gap-y-2 rounded-xl bg-[#FF7800] px-5 py-6">
              <div className="h-4 w-3/4 rounded bg-orange-600"></div>
              <div className="border-b-2"></div>
              <div className="h-6 w-1/2 rounded bg-orange-600"></div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="flex flex-1 animate-pulse flex-col gap-y-2 rounded-xl bg-[#FF7800] px-5 py-6">
            <div className="h-4 w-3/4 rounded bg-orange-600"></div>
            <div className="border-b-2"></div>
            <div className="grid grid-cols-2 gap-y-2">
              <div className="h-4 w-3/4 rounded bg-orange-600"></div>
              <div className="h-4 w-3/4 rounded bg-orange-600"></div>
              <div className="h-4 w-3/4 rounded bg-orange-600"></div>
              <div className="h-4 w-3/4 rounded bg-orange-600"></div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex w-1/4 flex-col gap-y-2 text-white">
          <div className="flex flex-1 animate-pulse flex-col gap-y-2 rounded-xl bg-[#FF7800] px-5 py-6">
            <div className="h-4 w-3/4 rounded bg-orange-600"></div>
            <div className="border-b-2"></div>
            <div className="flex flex-col gap-y-2">
              <div className="flex gap-x-2">
                <div className="h-4 w-3/4 rounded bg-orange-600"></div>
              </div>
              <div className="flex gap-x-2">
                <div className="h-4 w-3/4 rounded bg-orange-600"></div>
              </div>
              <div className="flex gap-x-2">
                <div className="h-4 w-3/4 rounded bg-orange-600"></div>
              </div>
              <div className="flex gap-x-2">
                <div className="h-4 w-3/4 rounded bg-orange-600"></div>
              </div>
              <div className="flex gap-x-2">
                <div className="h-4 w-3/4 rounded bg-orange-600"></div>
              </div>
            </div>
          </div>

          <div className="flex flex-1 animate-pulse flex-col gap-y-2 rounded-xl bg-[#FF7800] px-5 py-6">
            <div className="h-4 w-3/4 rounded bg-orange-600"></div>
            <div className="border-b-2"></div>
            <div className="flex flex-col gap-y-2">
              <div className="flex gap-x-2">
                <div className="h-4 w-3/4 rounded bg-orange-600"></div>
              </div>
              <div className="flex gap-x-2">
                <div className="h-4 w-3/4 rounded bg-orange-600"></div>
              </div>
              <div className="flex gap-x-2">
                <div className="h-4 w-3/4 rounded bg-orange-600"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* bottom */}
      <div className="flex w-full animate-pulse flex-col gap-y-2 rounded-xl bg-[#FF7800] px-5 py-6 text-white">
        <div className="h-4 w-3/4 rounded bg-orange-600"></div>
        <div className="border-b-2"></div>
        <div className="mt-2 grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="flex items-center gap-2 rounded-lg bg-orange-600 p-3 text-black">
            <div className="h-6 w-6 rounded bg-orange-800"></div>
            <div className="flex-1">
              <div className="h-4 w-3/4 rounded bg-orange-800"></div>
              <div className="h-3 w-1/2 rounded bg-orange-800"></div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-orange-600 p-3 text-black">
            <div className="h-6 w-6 rounded bg-orange-800"></div>
            <div className="flex-1">
              <div className="h-4 w-3/4 rounded bg-orange-800"></div>
              <div className="h-3 w-1/2 rounded bg-orange-800"></div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-orange-600 p-3 text-black">
            <div className="h-6 w-6 rounded bg-orange-800"></div>
            <div className="flex-1">
              <div className="h-4 w-3/4 rounded bg-orange-800"></div>
              <div className="h-3 w-1/2 rounded bg-orange-800"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
