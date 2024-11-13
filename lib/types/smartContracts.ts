export enum SmartContractStatus {
  CREATED = 0,
  DEPLOY_INITIATED = 1,
  DEPLOYING = 2,
  DEPLOYED = 3,
  FAILED = 4,
  TRANSFERRING = 5,
  TRANSFERRED = 6,
}

declare global {
  interface SmartContractABI {
    stateMutability?: string;
    type: string;
    inputs: Array<{
      name: string;
      description?: string;
      internalType: string;
      type: string;
    }>;
    name: string;
    description?: string;
    outputs?: Array<{
      name: string;
      internalType: string;
      type: string;
    }>;
    anonymous?: boolean;
    indexed?: boolean;
  }
  interface ContractMethod {
    createTime: string; // ISO 8601 format date string
    updateTime: string; // ISO 8601 format date string
    onlyOwner: boolean;
    name: string;
    description: string;
  }

  interface ContractVersion {
    createTime: string; // ISO 8601 format date string
    updateTime: string; // ISO 8601 format date string
    version: number;
    abi: SmartContractABI[];
    methods: ContractMethod[];
  }

  interface SmartContractInterface extends BaseObjectInterface {
    chainType: number;
    contractType: number;
    contractVersion?: ContractVersion;
    contract_uuid: string;
  }

  interface SmartContractResponse extends GeneralResponse<SmartContractInterface> {}
  interface SmartContractsResponse extends GeneralItemsResponse<SmartContractInterface> {}

  interface DeployedContractInterface {
    status: number;
    createTime: string; // ISO 8601 format date string
    updateTime: string | null; // ISO 8601 format date string or null
    contract_uuid: string; // UUID format string
    project_uuid: string; // UUID format string
    name: string;
    description: string | null;
    chainType: number;
    chain: number;
    version?: number;
    version_id: number;
    constructorArguments: string | null;
    contractStatus: number;
    contractAddress: string; // Ethereum or blockchain address format
    deployerAddress: string; // Ethereum or blockchain address format
    transactionHash: string | null;
    contractVersion: ContractVersion;
  }

  interface DeployedContractResponse extends GeneralResponse<DeployedContractInterface> {}
  interface DeployedContractsResponse extends GeneralItemsResponse<DeployedContractInterface> {}

  interface SmartContractCallInterface {
    id: number;
    status: number;
    address: string;
    to: string;
    chain: number;
    transactionStatus: number;
    chainType: number;
    transactionHash: string;
    referenceTable: string;
    referenceId: string;
    data: any | null; // 'data' can be of any type, or null.
    project_uuid: string;
  }
  interface SmartContractCallResponse extends GeneralResponse<SmartContractCallInterface> {}
}
