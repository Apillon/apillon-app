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
    termsAccepted: string;
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
  interface AirdropInterface extends GeneralInterface {
    user_uuid: string;
    projectCreated: boolean;
    bucketCreated: boolean;
    fileUploaded: boolean;
    websiteCreated: boolean;
    ipnsCreated: boolean;
    onSubscriptionPlan: boolean;
    creditsPurchased: boolean;
    grillChatCreated: boolean;
    nftCollectionCreated: boolean;
    domainLinked: boolean;
    websiteUploadedApi: boolean;
    fileUploadedApi: boolean;
    computingContractCreated: boolean;
    collaboratorAdded: boolean;
    kiltIdentityCreated: boolean;
    identitySdkUsed: boolean;
    nftMintedApi: boolean;
    usersReferred: number;
    creditsSpent: number;
    totalPoints: number;
  }
  interface AirdropResponse extends GeneralResponse<AirdropInterface> {}
}
