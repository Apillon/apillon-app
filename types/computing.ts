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
  UPLOAD = 2,
  ENCRYPT = 3,
}

declare global {
  /**
   * Contract
   */
  interface ContractInterface extends BaseObjectInterface {
    contract_uuid: string;
    project_uuid: string;
    contractType: number;
    contractStatus: number;
    sourceHash: string;
    clusterId: number;
    contractAddress: string;
    deployerAddress: string;
    transactionHash: string;
    data: string;
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
}
