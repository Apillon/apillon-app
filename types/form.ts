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

export interface FormProject {
  name: string | null;
  description: string | null;
  terms: boolean | null;
}
export interface ProjectInterface {
  id: number;
  status: number;
  name: string;
  description: string;
  shortDescription: string;
  imageFile_id: number;
}
export interface ProjectResponse {
  data: {
    items: Array<ProjectInterface>;
    total: number;
  };
  status: number;
}

export interface CreateProjectResponse {
  data: any;
  status: number;
}

export interface ServicesInterface {
  name: string;
  serviceType: string;
  active: number;
  uptime: string;
}

export interface ServicesResponse {
  data: {
    items: ServicesInterface[];
    total: number;
  };
  status: number;
}

export interface FormService {
  serviceName: string;
  networkType: boolean;
}
export interface CreateServiceResponse {
  data: {
    id: number;
    status: number;
  };
  status: number;
}
