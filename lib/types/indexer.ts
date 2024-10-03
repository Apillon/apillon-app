declare global {
  interface IndexerBaseInterface extends BaseObjectInterface {
    indexer_uuid: string;
    lastDeploymentId: number;
  }

  interface IndexerDeploymentInferface {
    id: number;
    type: string;
    failed: string;
    status: string;
    logs: [{ message: string; severity: string }];
    squid?: {
      id: number;
      name: string;
      slot: string;
      reference: string;
    };
  }

  interface IndexerLogInterface {
    id: string;
    level: string;
    timestamp: string;
    container: string;
    payload: {
      msg: string;
      ns: string;
    };
  }

  interface IndexerInterface extends IndexerBaseInterface {
    lastDeployment: IndexerDeploymentInferface;
  }

  interface IndexersResponse extends GeneralItemsResponse<IndexerInterface> {}
  interface IndexerBaseResponse extends GeneralResponse<IndexerBaseInterface> {}
  interface IndexerResponse extends GeneralResponse<IndexerInterface> {}
  interface IndexerLogsResponse
    extends GeneralResponse<{ logs: IndexerLogInterface[]; nextPage: string }> {}
}
