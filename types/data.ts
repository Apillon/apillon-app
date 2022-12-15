export enum FileStatus {
  REQUEST_FOR_UPLOAD_GENERATED = 1,
  UPLOADED_TO_S3 = 2,
  UPLOADED_TO_IPFS = 3,
  PINNED_TO_CRUST = 4,
}
export enum FileUploadRequestFileStatus {
  SIGNED_URL_FOR_UPLOAD_GENERATED = 1,
  UPLOADED_TO_S3 = 2,
  UPLOADED_TO_IPFS = 3,
  PINNED_TO_CRUST = 4,
  UPLOAD_COMPLETED = 5,
  ERROR_UPLOADING_TO_IPFS = 100,
  ERROR_PINING_TO_CRUST = 101,
  ERROR_FILE_NOT_EXISTS_ON_S3 = 102,
  ERROR_BUCKET_FULL = 103,
}

declare global {
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
    project_uuid?: string;
    value?: number;
    label?: string;
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
   * Project settings
   */
  interface FormProjectSettings {
    name: string | null;
    description: string | null;
  }
  interface ProjectSettingsResponse {
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
      items: Array<InstructionInterface>;
      total: number;
    };
    status: number;
  }
}
