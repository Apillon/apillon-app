/**
 *  Register
 */
interface FormRegister {
  password: string;
  reenteredPassword: string;
}
interface RegisterResponse {
  data: {
    id: number;
    status: number;
    name: string;
    token: string;
  };
  status: number;
}

interface ValidateMailResponse {
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
interface FormLogin {
  email: string;
  password: string;
}
interface LoginResponse {
  data: {
    token: string;
  };
  status: number;
}

/**
 * Project
 */
interface FormProject {
  name: string | null;
  description: string | null;
  terms: boolean | null;
}
interface ProjectInterface {
  id: number;
  status: number;
  name: string;
  description: string;
  shortDescription: string;
  imageFile_id: number;
}
interface ProjectResponse {
  data: {
    items: Array<ProjectInterface>;
    total: number;
  };
  status: number;
}

interface CreateProjectResponse {
  data: ProjectInterface;
  status: number;
}

/**
 * Instruction
 */
interface InstructionInterface {
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

interface InstructionResponse {
  data: InstructionInterface;
  status: number;
}

interface InstructionsResponse {
  data: {
    items: InstructionInterface;
    total: number;
  };
  status: number;
}

export {
  FormRegister,
  RegisterResponse,
  ValidateMailResponse,
  FormLogin,
  LoginResponse,
  FormProject,
  ProjectInterface,
  ProjectResponse,
  CreateProjectResponse,
  InstructionInterface,
  InstructionResponse,
  InstructionsResponse,
};
