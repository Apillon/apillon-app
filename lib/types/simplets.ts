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

declare global {
  interface SimpletTemplateInterface {
    id: number;
    createTime: string;
    updateTime: string;
    simplet_uuid: string;
    name: string;
    description: string | null;
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

  interface SimpletInterface {
    id: number;
    createTime: string;
    updateTime: string;
    project_uuid: string;
    simpletDeploy_uuid: string;
    simplet_uuid: string;
    name: string;
    description: string;
    backend_uuid: string;
    backendStatus: number;
    backendUrl: string;
    contract_uuid: string;
    contractStatus: number;
    frontendStatus: number;
  }
  interface SimpletResponse extends GeneralResponse<SimpletInterface> {}
  interface SimpletsResponse extends GeneralItemsResponse<SimpletInterface> {}
}
