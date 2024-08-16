export {};

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
  // Your code here
  interface SmartContractInterface {
    chainType: number;
    contractType: number;
    contract_uuid: string;
    description: string;
    id: number;
    name: string;
    status: number;
  }

  interface ContractsResponse {
    items: SmartContractInterface[];
    total: number;
    page: number;
    limit: number;
  }
}
