const PREDEFINED_WALLETS: WalletInfo[] = [
  {
    extensionName: 'polkadot-js',
    title: 'Polkadot{.js}',
    installUrl:
      'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd',
    icon: 'wallet/polkadot',
  },
  {
    extensionName: 'subwallet-js',
    title: 'SubWallet',
    installUrl:
      'https://chrome.google.com/webstore/detail/subwallet/onhogfjeacnfoofkfgppdlbmlmnplgbn',
    icon: 'wallet/subwallet',
  },
  {
    extensionName: 'talisman',
    title: 'Talisman',
    installUrl:
      'https://chrome.google.com/webstore/detail/talisman-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld',
    icon: 'wallet/talisman',
  },
];

const walletList: Wallet[] = [];

// Add more wallet, please sure you call this method before any getWallets or getWalletBySource
export function addWallet(data: WalletInfo) {
  const wallet = new DotSamaWallet(data) as Wallet;

  walletList.push(wallet);
}

// Implement predefined wallets
PREDEFINED_WALLETS.forEach(walletInfo => {
  addWallet(walletInfo);
});

// Get all wallet
export function getWallets(): Wallet[] {
  return walletList;
}

export function getWalletBySource(source: string | unknown): Wallet | undefined {
  return getWallets().find(wallet => {
    return wallet.extensionName === source;
  });
}

export function isWalletInstalled(source: string | unknown): boolean {
  const wallet = getWalletBySource(source);

  return wallet?.installed as boolean;
}
