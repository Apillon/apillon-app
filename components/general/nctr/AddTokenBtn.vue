<template>
  <div class="flex flex-col items-center">
    <Btn class="w-full" type="primary" event-code="add_nctr_to_metamsk" @click="addToken">
      Add $NCTR to MetaMask
    </Btn>
    <Notification v-if="wasAdded" type="info">
      You have successfully added $NCTR tokens to your wallet. You will now be able to see them on
      your account’s token list.
    </Notification>
  </div>
</template>

<script setup lang="ts">
// https://ethereum.stackexchange.com/questions/99343/how-to-automatically-add-a-custom-token-to-metamask-with-ethers-js/99344#99344
// TODO: correct NCTR adress to be added later
const tokenDecimals = 18;
const tokenImage = 'https://apillon.io/apillon-nctr.jpg';
// init with null so we can toggle bool
const wasAdded = ref<null | boolean>(null);

async function addToken() {
  try {
    wasAdded.value = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address: '0xFfFFfFfF8A9736B44EbF188972725bED67BF694E', // The address that the token is at.
          symbol: 'xcNCTR', // A ticker symbol or shorthand, up to 5 chars.
          decimals: tokenDecimals, // The number of decimals in the token
          image: tokenImage, // A string url of the token logo
        },
      },
    });
    wasAdded.value = true;
    setTimeout(() => {
      wasAdded.value = false;
    }, 7000);
  } catch (error) {
    wasAdded.value = false;
  }
}
</script>
