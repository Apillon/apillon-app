export enum ComputingContractType {
  SCHRODINGER = 1,
}

export enum ContractTransactionType {
  DEPLOY_CONTRACT = 1,
  TRANSFER_CONTRACT_OWNERSHIP = 2,
  DEPOSIT_TO_CONTRACT_CLUSTER = 3,
  ASSIGN_CID_TO_NFT = 4,
}

export enum ContractStatus {
  CREATED = 0,
  DEPLOY_INITIATED = 1,
  DEPLOYING = 2, //INSTANTIATING
  DEPLOYED = 3, //INSTANTIATED
  TRANSFERRING = 4,
  TRANSFERRED = 5,
  FAILED = 6,
}

export enum ComputingTransactionStatus {
  PENDING = 1,
  CONFIRMED = 2,
  FAILED = 3,
  ERROR = 4,
  WORKER_SUCCESS = 5,
  WORKER_FAILED = 6,
}

/** Encrypt steps */
export enum EncryptTab {
  BUCKET = 1,
  ASSIGN = 2,
  FINISHED = 3,
}

/** Encrypt configure steps */
export enum EncryptConfigureTab {
  BASE = 1,
  NFT_COLLECTION = 2,
}

/** Encrypt deploy steps */
export enum EncryptDeployTab {
  PREVIEW = 1,
  DEPLOYING = 2,
  DEPLOYED = 3,
}

export enum AcurastJobStatus {
  DEPLOYING = 1,
  DEPLOYED = 2,
  MATCHED = 3,
  INACTIVE = 4,
  DELETED = 9,
}

declare global {
  /**
   * Contract
   */
  interface ContractInterface extends BaseObjectInterface {
    contract_uuid: string;
    project_uuid: string;
    bucket_uuid: string;
    contractType: number;
    contractStatus: number;
    sourceHash: string;
    contractAddress: string;
    deployerAddress: string;
    transactionHash: string;
    data: {
      clusterId: string;
      ipfsGatewayUrl: string;
      nftChainRpcUrl: string;
      restrictToOwner: boolean;
      nftContractAddress: string;
    };
  }

  interface ContractResponse extends GeneralResponse<ContractInterface> {}
  interface ContractsResponse extends GeneralItemsResponse<ContractInterface> {}

  /**
   * Transaction
   */
  interface ComputingTransactionInterface {
    id: number;
    status: number;
    chainId: number;
    transactionType: number;
    refTable: string;
    refId: number;
    transactionStatus: number;
    transactionHash: string | null;
  }

  interface ComputingTransactionResponse
    extends GeneralItemsResponse<ComputingTransactionInterface> {}

  /**
   * Cloud Functions
   */
  interface CloudFunctionInterface extends BaseObjectInterface {
    activeJob_id: string;
    bucket_uuid: string;
    encrypted_variables: string;
    function_uuid: string;
    jobs: JobInterface[];
    project_uuid: string;
  }

  interface CloudFunctionResponse extends GeneralResponse<CloudFunctionInterface> {}
  interface CloudFunctionsResponse extends GeneralItemsResponse<CloudFunctionInterface> {}

  interface JobInterface extends BaseObjectInterface {
    endTime?: string;
    function_uuid: string;
    jobStatus: number;
    job_uuid: string;
    project_uuid: string;
    scriptCid: string;
    slots: number;
    startTime?: string;
  }

  interface JobResponse extends GeneralResponse<JobInterface> {}
  interface JobsResponse extends GeneralItemsResponse<JobInterface> {}

  type EnvVariable = {
    key: string;
    value: string;
  };
  interface EnvironmentResponse extends GeneralResponse<EnvVariable[]> {}

  interface CloudFunctionUsageInterface {
    error: boolean | null;
    function_uuid: string;
    success: boolean | null;
    timestamp: string;
  }
  interface CloudFunctionUsageResponse extends GeneralResponse<CloudFunctionUsageInterface[]> {}
}
