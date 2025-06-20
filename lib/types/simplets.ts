export enum SimpletType {
  AIRDROP = 1,
  FREE_MINT = 2,
  POAP = 3,
}
export enum SimpletName {
  AIRDROP = 'nft-brand-booster',
  FREE_MINT = 'nft-wild-west',
  POAP = 'nft-event-experience',
}

/** Create SImplet step */
export enum SimpletCreateStep {
  TYPE = 1,
  COLLECTION = 2,
  FORM = 3,
  REVIEW = 4,
  DEPLOYING = 5,
  DEPLOYED = 6,
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

  interface EnvironmentVariable {
    key: string;
    value: string;
  }

  interface Teepod {
    id: number;
    name: string;
  }

  interface BackendData {
    id: number;
    name: string;
    vcpu: number;
    appId: string;
    appUrl: string | null;
    memory: number;
    runner: string;
    status: string;
    teepod: Teepod;
    userId: number;
    vmUuid: string;
    version: string;
    diskSize: number;
    features: unknown;
    teepodId: number;
    baseImage: string;
    createdAt: string;
    instanceId: string | null;
    dashboardUrl: string;
    manifestVersion: number;
    dockerComposeFile: string;
    encryptedEnvPubkey: string;
  }

  interface SimpletBackendInterface extends BaseObjectInterface {
    project_uuid: string;
    backend_uuid: string;
    backendStatus: number;
    dockerCompose: string;
    environmentVariables: EnvironmentVariable[];
    instanceId: string;
    url: string;
    data: BackendData;
    tableName: string;
  }
  interface SimpletBackendResponse extends GeneralResponse<SimpletBackendInterface> {}
  interface SimpletQuotaResponse extends GeneralResponse<{ quotaReached: boolean }> {}
}
