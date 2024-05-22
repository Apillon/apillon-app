export {};
declare global {
  interface ReferralTask extends BaseObjectInterface {
    activeFrom?: string;
    activeTo?: string;
    data?: any;
    maxCompleted?: any;
    realizations: Array<any>;
    reward: number;
    type: number;
  }
  interface ReferralInterface {
    id: number;
    user_uuid: string;
    userEmail: string;
    balance: number;
    balance_all: number;
    refCode: string;
    referrals: Array<any>;
    referrer_id?: number;
    shippingInfo?: string;
    status: number;
    tasks: Array<any>;
  }

  interface RewardsInterface extends BaseObjectInterface {
    attributes: {
      name: string;
      id: number;
      options: string[];
      description: string;
      inputType: number;
    }[];
    imageUrl: string;
    maxOrderCount: number;
    orderCount: number;
    price: number;
    stock: number;
  }

  interface ReferralResponse extends GeneralResponse<ReferralInterface> {}
  interface ReferralRewardsResponse extends GeneralItemsResponse<RewardsInterface> {}

  /**
   * Airdrop
   */
  type AirdropTask = {
    name: string;
    value: boolean;
  };
  interface AirdropStatsInterface extends GeneralInterface {
    bucketCreated: boolean;
    collaboratorAdded: boolean;
    computingContractCreated: boolean;
    creditsPurchased: boolean;
    creditsSpent: number;
    domainLinked: boolean;
    fileUploaded: boolean;
    fileUploadedViaApi: boolean;
    grillChatCreated: boolean;
    identitySdkUsed: boolean;
    ipnsCreated: boolean;
    kiltIdentityCreated: boolean;
    nftCollectionCreated: boolean;
    nftMintedApi: boolean;
    onSubscriptionPlan: boolean;
    projectCreated: boolean;
    totalPoints: number;
    user_uuid: string;
    usersReferred: number;
    websiteCreated: boolean;
    websiteUploadedViaApi: boolean;
    galxeTasksCompleted: number;
  }
  interface TokenClaimInterface extends GeneralInterface {
    blocked: boolean;
    claimCompleted: boolean;
    totalNctr: number;
    user_uuid: string;
    wallet: string;
  }
  interface AirdropInterface {
    airdropStats: AirdropStatsInterface;
    tokenClaim: TokenClaimInterface;
  }
  interface AirdropResponse extends GeneralResponse<AirdropInterface> {}
}
