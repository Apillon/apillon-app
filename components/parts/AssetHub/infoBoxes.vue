<template>
  <div class="flex h-full max-w-lg flex-col justify-between pb-[185px]">
    <div>
      <div class="min-h-[192px]">
        <div class="flex flex-col border border-bg-lighter p-2 md:flex-row">
          <span class="icon-info mt-1"></span>
          <p class="mt-2 md:ml-2">
            We recommend creating your asset on the testnet first, to preview and test it thoroughly. Once you’re
            satisfied with the outcome, you can confidently deploy it on the mainnet. Keep in mind, once deployed,
            asset’s name, symbol, ID, and other characteristics will be permanently reserved on the blockchain.
          </p>
        </div>
      </div>
      <div class="mt-2 flex flex-col border border-bg-lighter p-2 md:flex-row">
        <span class="icon-info mt-1"></span>
        <p class="mt-2 md:ml-2">
          These are the key characteristics of your soon-to-be created asset. We’ll automatically validate the asset’s
          name, symbol, and ID, and notify you if any of these are already in use by an existing asset. <br /><br />Feel
          free to learn more about asset parameters in the
          <a class="text-yellow underline" target="_blank" href="https://crates.parity.io/pallet_assets/index.html">
            documentation here.
          </a>
        </p>
      </div>
    </div>
    <div class="flex flex-col border border-bg-lighter p-2 md:flex-row">
      <span class="icon-info mt-1"></span>
      <p class="mt-2 md:ml-2">
        <strong>Issuer:</strong> An account with unique ability to mint a specific class of assets.
        <br />
        <strong>Freezer:</strong> An account with exclusive rights to restrict another account from transferring a
        certain class of assets.
      </p>
    </div>
  </div>
</template>
