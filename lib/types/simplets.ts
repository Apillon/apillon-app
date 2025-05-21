export enum SimpletType {
  AIRDROP = 1,
  FREE_MINT = 2,
  POAP = 3,
}
export enum SimpletName {
  AIRDROP = 'airdrop',
  FREE_MINT = 'free-mint',
  POAP = 'poap',
}

/** Create SImplet step */
export enum SimpletCreateStep {
  TYPE = 1,
  COLLECTION = 2,
  FORM = 3,
  SMTP = 4,
  REVIEW = 5,
  DEPLOYING = 6,
  DEPLOYED = 7,
}

export enum ResourceStatus {
  REQUESTED = 0,
  DEPLOYING = 1,
  ONLINE = 2,
  STOPPED = 3,
  SHUT_DOWN = 4,
  FAILED = 5,
}

declare global {
  interface SimpletTemplateInterface extends BaseObjectInterface {
    simplet_uuid: string;
    contract_uuid: string | null;
    backendRepo: string;
    backendPath: string;
    backendMachine: {
      memory: number;
      cpuCount: number;
      diskSize: number;
    };
    frontendRepo: string;
    frontendPath: string;
    frontendInstallCommand: string;
    frontendBuildCommand: string;
    frontendBuildDirectory: string;
  }
  interface SimpletTemplatesResponse extends GeneralItemsResponse<SimpletTemplateInterface> {}

  interface SimpletInterface extends BaseObjectInterface {
    backendStatus: number;
    backendUrl: string;
    backend_uuid: string;
    contractStatus: number;
    contract_uuid: string;
    frontendStatus: number;
    frontend_uuid: string;
    project_uuid: string;
    simpletDeploy_uuid: string;
    simplet_uuid: string;
  }
  interface SimpletResponse extends GeneralResponse<SimpletInterface> {}
  interface SimpletsResponse extends GeneralItemsResponse<SimpletInterface> {}
  interface SimpletCreateResponse extends GeneralResponse<{ data: SimpletInterface; errors: string[] }> {}
}
