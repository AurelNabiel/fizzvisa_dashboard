import { Button, Dialog } from "@headlessui/react";
import React, { useState, useEffect, Fragment } from "react";
import Papa from "papaparse";
import ModalPop from "@/components/ModalPop/ModalPop";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";

import * as yup from "yup";
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

const schema = yup.object({
  fullname: yup.string().required("Name is required"),
  email: yup.string().email().required("Email is required"),
  phone: yup
    .string()
    .required("Phone is required")
    .test("len", "Phone number must be 11 digits", (val) => {
      if (val) {
        return val.length >= 11;
      }
      return false;
    }),
  ref_code: yup.string(),
  depart_date: yup
    .string()
    .required("Depart Date is required")
    .test(
      "minDepart",
      "Depart Date must be at least 3 months from today",
      (value) => {
        const today = new Date();
        const departDate = new Date(value);
        const minDepartDate = new Date(today.setMonth(today.getMonth() + 3));
        return departDate >= minDepartDate;
      },
    ),
  return_date: yup
    .string()
    .required("Return Date is required")
    .test(
      "minReturn",
      "Return Date must be after Depart Date",
      function (value) {
        const departDate = new Date(this.parent.depart_date);
        const returnDate = new Date(value);
        return returnDate >= departDate;
      },
    ),
  ref_code_created_date: yup.string().when("ref_code", {
    is: (ref_code: string) =>
      typeof ref_code === "string" && ref_code.trim() !== "",
    then: (schema) =>
      schema
        .required("Ref Code Created Date is required")
        .test(
          "ref_code",
          "Ref Code Created Date must match the provided Referral Code",
          function (value) {
            return value && this.parent.ref_code;
          },
        ),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const Import: React.FC<ImportProps> = ({ onAddCustomer }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>({
    resolver: yupResolver(schema), // Attach validation schema here
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorDocument, setErrorDocument] = useState<string | null>(null);
  const [documentData, setDocumentData] = useState<IFormInput[]>([]);
  const [docs, setDocs] = useState<File | null>(null);
  const [disable, setDisable] = useState<boolean>(true);

  const handleCSVFile = (content: string, file: File) => {
    Papa.parse(content, {
      header: true,
      skipEmptyLines: true, // This option skips empty rows automatically
      complete: (result) => {
        let csvArray = result.data;
  
        // Filter out rows where all fields are empty
        csvArray = csvArray.filter((row: any) => 
          Object.values(row).some((field) => typeof field === "string" && field.trim() !== "")
        );
  
        console.log("Filtered CSV Data:", csvArray);
  
        // Define expected headers
        const expectedHeaders = [
          "email",
          "phone",
          "fullname",
          "depart_date",
          "return_date",
          "ref_code",
          "ref_code_created_date",
        ];
  
        const csvHeaders = result.meta.fields || [];
        console.log("CSV Headers:", csvHeaders);
  
        if (!areHeadersValid(csvHeaders, expectedHeaders)) {
          setErrorDocument(
            "Invalid CSV headers. Please make sure the headers match the expected structure."
          );
          return;
        }
  
        setDocs(file);
        if (csvArray.length > 0) {
          // Map headers to their respective indices
          const headerMap = {
            email: "email",
            phone: "phone",
            fullname: "fullname",
            depart_date: "depart_date",
            return_date: "return_date",
            ref_code_created_date: "ref_code_created_date",
          };
  
          const allEntriesData = csvArray.map((entry: any) => ({
            email: entry[headerMap["email"]] || "",
            phone: entry[headerMap["phone"]] || "",
            fullname: entry[headerMap["fullname"]] || "",
            depart_date: entry[headerMap["depart_date"]] || "",
            return_date: entry[headerMap["return_date"]] || "",
            ref_code_created_date:
              entry[headerMap["ref_code_created_date"]] || "",
          }));
  
          setDocumentData(allEntriesData);
          setDisable(
            !allEntriesData.every(
              (entry) =>
                entry.email &&
                entry.phone &&
                entry.fullname &&
                entry.depart_date &&
                entry.return_date,
            ),
          );
        }
      },
      error: (error: Error) => {
        console.error("CSV parsing error:", error);
        setErrorDocument("An error occurred while parsing the CSV file.");
      },
    });
  };
  

  const getDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedFileType = "text/csv"; // CSV file type

      if (file.type === allowedFileType) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const content = e.target?.result as string;
          handleCSVFile(content, file);
        };

        reader.readAsText(file);
        setErrorDocument(null); // Clear previous errors
      } else {
        setErrorDocument("Please upload a valid CSV file.");
      }
    }
  };

  interface RequestData {
    email: string;
    phone: string;
    fullname: string;
    depart_date: string;
    return_date: string;
    ref_code?: string;
    ref_code_created_date?: string;
  }



  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const requestData: RequestData[] = documentData.map((entry) => ({
        email: entry.email,
        phone: entry.phone,
        fullname: entry.fullname,
        depart_date: new Date(entry.depart_date).toISOString().split('T')[0],
        return_date: new Date(entry.return_date).toISOString().split('T')[0],
        ref_code: entry.ref_code,
        ref_code_created_date: entry.ref_code_created_date
          ? new Date(entry.ref_code_created_date).toISOString().split('T')[0]
          : entry.ref_code_created_date,
      }));
      

      // Simulate an API call to submit the data
      console.log("Submitting data:", requestData);
      documentData.forEach((entry) => {
        onAddCustomer(entry);
      });
      

      // Here, you can replace with actual API call
      // await api_service.post("/your-endpoint", requestData);

      setIsLoading(false);
      setIsOpen(false); // Close the modal after successful submission
    } catch (error) {
      setIsLoading(false);
      setErrorDocument("An error occurred while submitting the data.");
    }
  };

  useEffect(() => {
    if (documentData.length === 0) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [documentData]);
  useEffect(() => {

    setDocumentData([]);
    setDocs(null);
  }, [isOpen]);
  const areHeadersValid = (csvHeaders: string[], expectedHeaders: string[]) => {
    return (
      JSON.stringify(csvHeaders.sort()) ===
      JSON.stringify(expectedHeaders.sort())
    );
  };
  return (
    <>
      <div>
        <Button
          onClick={() => {
            setIsOpen(true);
          }}
          className="w-full cursor-pointer rounded-lg border border-primary bg-primary px-4 py-2 text-white transition hover:bg-opacity-90"
        >
          Import +
        </Button>
      </div>

      <ModalPop isOpen={isOpen} closeModalAdd={() => setIsOpen(false)}>
        <Dialog.Title
          as="h3"
          className="mb-4 text-xl font-semibold text-gray-900 dark:text-white"
        >
          Add Customers
        </Dialog.Title>
        <form onSubmit={onSubmit}>
          <div>
            <button
              type="button"
              className="relative mt-5 flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-blue-300 bg-blue-50"
            >
              <input
                accept="csv"
                onChange={getDocument}
                type="file"
                className="absolute z-10 mt-3 h-full w-full cursor-pointer opacity-0"
              />
              <p className={`text-blue-500 ${documentData && "font-bold"}`}>
                {!docs ? "Upload CSV File" : docs?.name}
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
