export interface FormPassword {
  password: string;
  reenteredPassword: string;
}
export interface RegisterResponse {
  id: number;
  status: number;
  user_uuid: string;
}

export interface FormLogin {
  email: string;
  password: string;
}
export interface LoginResponse {
  data: {
    token: string;
  };
  status: number;
}
