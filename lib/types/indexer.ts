export enum IndexerStatuses {
  CREATED = 1,
  HIBERNATED = 3,
  ACTIVE = 5,
}

declare global {
  interface IndexerBaseInterface extends BaseObjectInterface {
    indexer_uuid: string;
    lastDeploymentId: number;
    squidId?: number;
    squidReference?: string;
  }

  interface IndexerDeploymentInterface {
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
    totalElapsedTimeMs: number;
    updatedAt: string;
    createdAt: string;
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

  interface IndexerUsageMetricsInterface {
    ts: string;
    success: {
      count: number;
    };
    error: {
      count: number;
    };
  }
  interface IndexerUsageInterface {
    metrics: IndexerUsageMetricsInterface[];
  }

  interface IndexerBillingInterface {
    id: number;
    year: number;
    month: number;
    billedAmount: number;
  }

  interface IndexerInterface extends IndexerBaseInterface {
    squid: {
      id: number;
      api: {
        status: string;
        urls: [{ type: string; url: string }];
      };
      processors: {
        name: string;
        status: string;
        syncState: {
          totalBlocks: number;
          currentBlock: number;
        };
      };
      status: string;
      deployedAt: string;
      hibernatedAt: string;
    };
    lastDeployment: IndexerDeploymentInterface;
  }

  interface IndexersResponse extends GeneralItemsResponse<IndexerInterface> {}
  interface IndexerBaseResponse extends GeneralResponse<IndexerBaseInterface> {}
  interface IndexerResponse extends GeneralResponse<IndexerInterface> {}
  interface IndexerLogsResponse extends GeneralResponse<{ logs: IndexerLogInterface[]; nextPage: string }> {}

  interface IndexerDeploymentsResponse extends GeneralResponse<IndexerDeploymentInterface[]> {}
  interface IndexerUsageResponse extends GeneralResponse<IndexerUsageInterface> {}
  interface IndexerBillingResponse extends GeneralItemsResponse<IndexerBillingInterface> {}
}
