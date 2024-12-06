import { Button, Dialog } from "@headlessui/react";
import React, { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import ModalPop from "@/components/ModalPop/ModalPop";
import axios from "axios";
import Cookies from "js-cookie";

interface IFormInput {
  email: string;
  fullname: string;
  ref_code?: string;
  phone: string;
  depart_date: string;
  return_date: string;
  ref_code_created_date?: string;
}

interface ImportProps {
  onAddCustomer: (customer: any) => void;
}

const Import: React.FC<ImportProps> = ({ onAddCustomer }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorDocument, setErrorDocument] = useState<string | null>(null);
  const [documentData, setDocumentData] = useState<IFormInput[]>([]);
  const [docs, setDocs] = useState<File | null>(null);
  const [disable, setDisable] = useState<boolean>(true);
  const [isXlsx, setIsXlsx] = useState<boolean>(false); // Track if it's XLSX file
  const token = Cookies.get("token");
  // Helper to check if headers are valid
  const areHeadersValid = (
    fileHeaders: string[],
    expectedHeaders: string[],
  ) => {
    return (
      JSON.stringify(fileHeaders.sort()) ===
      JSON.stringify(expectedHeaders.sort())
    );
  };

  // Function to handle CSV files
  const handleCSVFile = (content: string, file: File) => {
    Papa.parse<Record<string, string>>(content, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const data = result.data;
        const headers = Object.keys(data[0]);

        // Update the expected headers for CSV
        const expectedHeaders = [
          "Email",
          "No HP",
          "Nama Lengkap",
          "Tanggal Keberangkatan",
          "Tanggal Kepulangan",
          "Tanggal Pembuatan Voucher Code",
          "Voucher Code",
        ];

        if (!areHeadersValid(headers, expectedHeaders)) {
          setErrorDocument(
            `Invalid CSV headers. Expected headers: ${expectedHeaders.join(", ")}`,
          );
          return;
        }

        // Validate data for required fields
        const validData = data.filter((entry) => {
          return (
            entry["Email"]?.trim() !== "" &&
            entry["No HP"]?.trim() !== "" &&
            entry["Nama Lengkap"]?.trim() !== "" &&
            entry["Tanggal Keberangkatan"]?.trim() !== "" &&
            entry["Tanggal Kepulangan"]?.trim() !== ""
          );
        });

        if (validData.length === 0) {
          setErrorDocument("The CSV file contains no valid data.");
          return;
        }

        // Map data to match API structure
        const formattedData = validData.map((row) => ({
          email: row["Email"],
          phone: row["No HP"],
          fullname: row["Nama Lengkap"],
          depart_date: row["Tanggal Keberangkatan"],
          return_date: row["Tanggal Kepulangan"],
          ref_code: row["Voucher Code"] || "",
          ref_code_created_date: row["Tanggal Pembuatan Voucher Code"] || "",
        }));

        setDocs(file);
        setDocumentData(formattedData as IFormInput[]);
        setErrorDocument(null);
        setDisable(false);
      },
      error: (error: Error) => {
        console.error("CSV parsing error:", error);
        setErrorDocument("An error occurred while parsing the CSV file.");
      },
    });
  };

  // Function to handle XLSX file
  const handleExcelFile = (content: ArrayBuffer, file: File) => {
    const workbook = XLSX.read(content, { type: "array" });
    const sheetNames = workbook.SheetNames;
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]], {
      header: 1, // Treat first row as headers
      defval: "", // Replace missing values with empty string
    });

    // Define expected headers in the correct order
    const expectedHeaders = [
      "Email",
      "No HP",
      "Nama Lengkap",
      "Tanggal Keberangkatan",
      "Tanggal Kepulangan",
      "Tanggal Pembuatan Voucher Code",
      "Voucher Code",
    ];

    const headersXlsx = sheetData[0]; // Get the first row as headers
    if (!areHeadersValid(headersXlsx as string[], expectedHeaders)) {
      setErrorDocument(
        `Invalid Excel headers. Please ensure they match the expected structure.`,
      );
      return;
    }

    // Set XLSX file as valid and ready to be uploaded later
    setDocs(file);
    setIsXlsx(true); // Set flag to indicate that it's an XLSX file
    setErrorDocument(null);
    setDisable(false);
  };

  // Get the document when file is selected
  const getDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedFileTypes = [
        "text/csv",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      if (allowedFileTypes.includes(file.type)) {
        setErrorDocument(null); // Reset error
        setIsXlsx(false); // Set flag to indicate that it's an XLSX file

        console.log(file.type);
        if (file.type === "text/csv") {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result as string;
            handleCSVFile(content, file);
          };
          reader.readAsText(file);
        } else if (
          file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result as ArrayBuffer;
            handleExcelFile(content, file);
          };
          reader.readAsArrayBuffer(file);
        }
      } else {
        setErrorDocument("Please upload a valid CSV or Excel file.");
      }
    }
  };

  // Handle form submission
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      if (isXlsx) {
        // If it's an XLSX file, upload it to the API when the submit button is clicked
        if (docs) {
          console.log("XLSX file", docs);

          await axios
            .post(
              `${process.env.NEXT_PUBLIC_DEV_API}/customer/create-by-excel`,
              docs,
              {
                headers: {
                  "Content-Type": "application/form-data",
                  Authorization: `Bearer ${token}`,
                },
              },
            )
            .then((res) => {
              console.log(res.data);
              setIsLoading(false);
              setErrorDocument(null);
              setDocumentData([]);
              setDocs(null);
              setIsOpen(false);
              setDisable(true);
            });
        }
      } else {
        // Process the CSV data and submit to the API
        documentData.forEach((entry) => onAddCustomer(entry));
        setIsLoading(false);
        setErrorDocument(null);
        setDocumentData([]);
        setDocs(null);
        setIsOpen(false);
        setDisable(true);
      }
    } catch (error) {
      setIsLoading(false);
      setErrorDocument("An error occurred while submitting the data.");
    }
  };

  return (
    <>
      <div>
        <Button
          onClick={() => setIsOpen(true)}
          className="w-full cursor-pointer rounded-lg border border-primary bg-primary px-4 py-2 text-white transition hover:bg-opacity-90"
        >
          Import +
        </Button>
      </div>

      <ModalPop
        isOpen={isOpen}
        closeModalAdd={() => {
          setIsOpen(false);
          setDocumentData([]);
          setDocs(null);
          setErrorDocument(null);
          setDisable(true);
        }}
      >
        <Dialog.Title
          as="h3"
          className="mb-4 text-xl font-semibold text-gray-900 dark:text-white"
        >
          Add Customers
        </Dialog.Title>
        <form onSubmit={handleSubmit}>
          <div>
            <button
              type="button"
              className="relative mt-5 flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-blue-300 bg-blue-50"
            >
              <input
                accept=".csv, .xlsx"
                onChange={getDocument}
                type="file"
                className="absolute z-10 mt-3 h-full w-full cursor-pointer opacity-0"
              />
              <p className={`text-blue-500 ${documentData && "font-bold"}`}>
                {!docs ? "Upload CSV or Excel File" : docs?.name}
              </p>
            </button>
            {errorDocument && (
              <div className="mt-2 text-sm text-red-500">{errorDocument}</div>
            )}
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className={`w-full rounded-md px-4 py-2 text-white ${disable ? "cursor-not-allowed bg-gray-300" : "bg-blue-500 hover:bg-blue-600"}`}
              disabled={disable || isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </ModalPop>
    </>
  );
};

export default Import;
