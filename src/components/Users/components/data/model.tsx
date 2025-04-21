export interface User {
  status:    number;
  message:   string;
  data:      Datum[];
  timestamp: Date;
  meta:      Meta;
  path:      string;
}

export interface Datum {
  id:          number;
  username:    string;
  email:       string;
  role:        string;
  user_type:   string;
  agent:       Agent | null;
  user_access: UserAccess;
}

export interface Agent {
  id:         number;
  name:       string;
  email:      string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
}

export interface UserAccess {
  id:           number;
  add:          boolean;
  modify:       boolean;
  delete:       boolean;
  approve:      boolean;
  reference_id: number;
  created_at:   Date;
  updated_at:   Date;
}

export interface Meta {
  page:        null;
  limit:       null;
  total_docs:  number;
  total_pages: number;
}
