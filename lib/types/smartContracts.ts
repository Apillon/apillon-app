export {};

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
