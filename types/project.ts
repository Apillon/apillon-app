/**
 * User roles
 */
export enum DefaultUserRole {
  // Admin roles
  ADMIN = 1, // System's admin
  SUPPORT = 2, // System Support user
  ANALYTIC = 3, // Read only system user
  // project roles
  PROJECT_OWNER = 10, // Owner of current project
  PROJECT_ADMIN = 11, // Admin of current project
  PROJECT_USER = 12, // (read only) User on current project
  // auth user roles
  USER = 99, // user with access to platform
}
export const DefaultUserRoles: { [k: number]: string } = {
  [DefaultUserRole.PROJECT_OWNER]: 'PROJECT_OWNER',
  [DefaultUserRole.PROJECT_ADMIN]: 'PROJECT_ADMIN',
  [DefaultUserRole.PROJECT_USER]: 'PROJECT_USER',
};

/**
 * Instruction Type Enum { Helper, Video, Q&A }
 */
export enum InstructionType {
  HELPER = 10,
  VIDEO = 20,
  QA = 30,
}

declare global {
  /**
   * Project
   */
  interface FormProject {
    name: string | null;
    description: string | null;
    terms?: boolean;
  }

  interface ProjectInterface {
    id: number;
    status: number;
    name: string;
    description: string;
    shortDescription: string | null;
    imageFile_id: number | null;
    myRole_id_onProject?: number;
    project_uuid: string;
    value?: number;
    label?: string;
  }

  interface ProjectResponse extends GeneralResponse<ProjectInterface> {}
  interface ProjectsResponse extends GeneralItemsResponse<ProjectInterface> {}
  interface CreateProjectResponse extends GeneralResponse<ProjectInterface> {}
  interface ProjectsQuotaResponse extends GeneralResponse<boolean> {}

  /**
   * Project settings
   */
  interface FormProjectSettings {
    name?: string | null;
    description?: string | null;
  }
  interface ProjectSettingsResponse extends GeneralResponse<ProjectInterface> {}

  /**
   * Project users
   */
  interface ProjectUserInterface {
    id: number;
    status: number;
    user_id: number;
    role_id: number;
    name: string;
    phone: string;
    email: string;
    pendingInvitation: number;
    loading?: boolean;
  }
  interface ProjectUsersResponse extends GeneralItemsResponse<ProjectUserInterface> {}

  /**
   * Invite user
   */
  interface FormInviteUser {
    email: string;
    role_id: number;
  }
  interface InvitedUserInterface {
    id: number;
    status: number;
    project_id: number;
    user_id: number;
    role_id: number;
  }
  interface InviteUserResponse extends GeneralResponse<InvitedUserInterface> {}
  interface UpdateUserRoleResponse extends GeneralResponse<InvitedUserInterface> {}

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
  interface InstructionResponse extends GeneralResponse<InstructionInterface> {}
  interface InstructionsResponse extends GeneralItemsResponse<InstructionInterface> {}
}
