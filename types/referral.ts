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
    github_id?: string;
    twitter_id?: string;
    github_name?: string;
    twitter_name?: string;
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
}
