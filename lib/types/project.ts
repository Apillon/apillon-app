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
  INTERNAL_TEST_USER = 90, // user with access to new unpublished features
  EXTERNAL_TEST_USER = 91, // user with access to features ready for external testers
  BETA_USER = 92, // user with access to closed beta features
  USER = 99, // user with access to platform (published features)
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
  interface ProjectInterface extends BaseObjectInterface {
    status: number;
    shortDescription: string | null;
    imageFile_id: number | null;
    myRole_id_onProject?: number;
    project_uuid: string;
    value?: string;
    label?: string;
  }

  interface ProjectResponse extends GeneralResponse<ProjectInterface> {}
  interface ProjectsResponse extends GeneralItemsResponse<ProjectInterface> {}
  interface CreateProjectResponse extends GeneralResponse<ProjectInterface> {}
  interface ProjectsQuotaResponse extends GeneralResponse<boolean> {}

  interface ProjectOverviewInterface {
    availableBandwidth: number;
    availableStorage: number;
    bucketCount: number;
    computingTransactionCount: number;
    contractCount: number;
    didCount: number;
    fileCount: number;
    nftTransactionCount: number;
    collectionCount: number;
    postCount: number;
    spaceCount: number;
    usedBandwidth: number;
    usedStorage: number;
    websiteCount: number;
  }

  interface ProjectOverviewResponse extends GeneralResponse<ProjectOverviewInterface> {}

  /**
   * Project settings
   */
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
    phone?: string | null;
    email: string;
    pendingInvitation: number;
    loading?: boolean;
  }
  interface ProjectUsersResponse extends GeneralItemsResponse<ProjectUserInterface> {}

  /**
   * Invite user
   */
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
