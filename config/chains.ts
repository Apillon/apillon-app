const chains: { [k: string]: any } = {
  '0x1': {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    rpcUrls: ['https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://etherscan.io/'],
  },
  '0x5': {
    chainId: '0x5',
    chainName: 'Goerli Test Network',
    rpcUrls: ['https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://goerli.etherscan.io/'],
  },
  // '0x89': {
  //   chainId: '0x89',
  //   chainName: 'Polygon Mainnet',
  //   rpcUrls: ['https://polygon-rpc.com'],
  //   nativeCurrency: {
  //     name: 'Matic',
  //     symbol: 'MATIC',
  //     decimals: 18
  //   },
  //   blockExplorerUrls: ['https://polygonscan.com/']
  // },
  // '0x13881': {
  //   chainId: '0x13881',
  //   chainName: 'Polygon Testnet Mumbai',
  //   rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
  //   nativeCurrency: {
  //     name: 'Matic',
  //     symbol: 'MATIC',
  //     decimals: 18
  //   },
  //   blockExplorerUrls: ['https://mumbai.polygonscan.com/']
  // }
};

export default chains;
