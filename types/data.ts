/**
 *  Register
 */
export interface FormRegister {
  password: string;
  reenteredPassword: string;
}
export interface RegisterResponse {
  data: {
    id: number;
    status: number;
    name: string;
    token: string;
  };
  status: number;
}

export interface ValidateMailResponse {
  data: {
    data: boolean;
    status: number;
    success: boolean;
  };
  status: number;
}

/**
 * Login
 */
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

/**
 * Project
 */
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
  data: ProjectInterface;
  status: number;
}

/**
 * Instruction
 */
export interface InstructionInterface {
  id: number;
  status: number;
  title: string;
  instructionEnum: string;
  instructionType: number;
  htmlContent: string;
  extendedHtmlContent: string;
  docsUrl: string;
  forRoute: string;
}

export interface InstructionResponse {
  data: InstructionInterface;
  status: number;
}

export interface InstructionsResponse {
  data: {
    items: InstructionInterface;
    total: number;
  };
  status: number;
}
