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
  project_uuid?: string;
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
 * Project settings
 */
export interface FormProjectSettings {
  name: string | null;
  description: string | null;
}
export interface ProjectSettingsResponse {
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
