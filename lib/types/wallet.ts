import {
  InjectedExtension,
  InjectedMetadata,
  InjectedProvider,
  Unsubcall,
} from '@polkadot/extension-inject/types';
import { Signer } from '@polkadot/types/types';

export {};

declare global {
  /* eslint-disable no-use-before-define */
  type SubscriptionFn = (accounts: WalletAccount[] | undefined) => void | Promise<void>;
  type WalletDeviceType = 'desktop' | 'mobile';

  interface WalletAccount {
    address: string;
    source: string;
    name?: string;
    wallet?: Wallet;
    signer?: unknown;
  }

  interface WalletInfo {
    type: WalletDeviceType;
    extensionName: string;
    title: string;
    installUrl: Record<string, string>;
    icon?: string;
    image?: string;
  }

  interface WalletMethods {
    enable: () => Promise<unknown>;

    subscribeAccounts: (callback: SubscriptionFn) => Promise<Unsubcall | null>;

    getAccounts: () => Promise<WalletAccount[] | null>;
  }

  interface Wallet extends WalletInfo, WalletMethods {
    installed: boolean | undefined;

    extension: InjectedExtension | undefined;

    signer: Signer | undefined;

    metadata: InjectedMetadata | undefined;

    provider: InjectedProvider | undefined;
  }

  interface WalletContextInterface {
    wallet?: Wallet;
    accounts: WalletAccount[];
    setWallet: (wallet: Wallet | undefined) => void;
  }

  interface OpenSelectWalletInterface {
    isOpen: boolean;
    open: () => void;
    close: () => void;
  }
}
