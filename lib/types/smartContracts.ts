export enum SmartContractStatus {
  CREATED = 0,
  DEPLOY_INITIATED = 1,
  DEPLOYING = 2,
  DEPLOYED = 3,
  FAILED = 4,
  TRANSFERRING = 5,
  TRANSFERRED = 6,
}
export enum SmartContractType {
  OTHER = 1,
  ERC_20 = 2,
  ERC_1155 = 3,
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
    createTime: string;
    updateTime: string;
    onlyOwner: boolean;
    name: string;
    description: string;
  }

  interface ContractVersion {
    createTime: string;
    updateTime: string;
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

  interface DeployedContractInterface extends BaseObjectInterface {
    chain: number;
    chainType: number;
    contractAddress: string;
    contractStatus: number;
    contractVersion: number | any;
    contractType: number;
    contract_uuid: string;
    deployerAddress: string;
    project_uuid: string;
    version_id: number;
  }
  interface DeployedContractDetailsInterface extends DeployedContractInterface {
    constructorArguments: string | null;
    contractVersion: ContractVersion;
    transactionHash: string | null;
  }

  interface DeployedContractResponse extends GeneralResponse<DeployedContractDetailsInterface> {}
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
    data: any | null;
    project_uuid: string;
  }
  interface SmartContractCallResponse extends GeneralResponse<SmartContractCallInterface> {}
}
