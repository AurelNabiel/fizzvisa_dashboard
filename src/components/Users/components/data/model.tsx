export interface UsersModel {
  id:        number;
  username:  string;
  email:     string;
  role:      string;
  user_type: string;
  agent:     Agent | null;
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