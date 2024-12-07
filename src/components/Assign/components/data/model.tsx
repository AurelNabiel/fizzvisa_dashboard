export interface Customers {
    id: number;
    first_name: null | string;
    middle_name: null | string;
    last_name: null | string;
    fullname: null | string;
    destination: null | string;
    visa_purpose: null | string;
    depart_date: Date | null;
    return_date: Date | null;
    passport_number: null | string;
    passport_issued_date: Date | null;
    passport_expired_date: Date | null;
    visa_submission_date: Date | null;
    phone: string;
    email: string;
    marital_status: null | string;
    address: null | string;
    remarks: null | string;
    ref_code: string;
    ref_code_created_date: Date | null;
    created_by: null | string;
    assigned_by: null | string;
    created_at: Date;
    updated_at: Date;
    deleted_date: null | Date;
    agent_id: number | null;
    document: Document | null;
    agent: Agent | null;
    is_paid: boolean;
  }
  
  export interface Agent {
    id: number;
    name: string;
    created_by: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: null | Date;
  }
  
  export interface Document {
    id: number;
    reference_id: number;
    selfie: string;
    passport: string;
    ktp: string;
    birth_certificate: string;
    family_card: string;
    vaccine: string;
    married: null | string;
    bank_statement: string;
    additional_document1: null | string;
    additional_document2: null | string;
    additional_document3: null | string;
    created_at: Date;
    updated_at: Date;
  }

  