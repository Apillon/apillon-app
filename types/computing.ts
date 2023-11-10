export enum ComputingContractType {
  SCHRODINGER = 1,
}

export enum ComputingEventType {
  CREATE_CONTRACT = 'create-contract',
  LIST_CONTRACTS = 'list-contract',
  GET_CONTRACT_BY_UUID = 'get-contract-by-uuid',
  DEPOSIT_TO_CONTRACT_CLUSTER = 'fund-contract-cluster',
  TRANSFER_CONTRACT_OWNERSHIP = 'transfer-contract-ownership',
}

export enum ContractType {
  DEPLOY_CONTRACT = 1,
  TRANSFER_CONTRACT_OWNERSHIP = 2,
  DEPOSIT_TO_CONTRACT_CLUSTER = 3,
}

export enum ContractStatus {
  CREATED = 0,
  DEPLOY_INITIATED = 1,
  DEPLOYING = 2,
  DEPLOYED = 3,
  TRANSFERRED = 4,
  FAILED = 5,
}

declare global {
  /**
   * Contract
   */
  type FormContract = {
    name: string;
    description?: string;
    nftContractAddress?: string;
    nftChainRpcUrl?: string;
    contractType?: number;
    restrictToOwner?: boolean;
  };

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
}
