import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { ethers } from 'ethers';
import { blockchains, useBlockchain } from '@/composables/useBlockchain';

export function useDialogNft(walletPublicKey,
  contractAddress,
  abi,
  chainId,
  itemsPerPage) {
  const isNftDialogShowing = ref(false);
  const selectedNft = ref(null);
  const route = useRoute();

  function toggleIsNftDialogShowing() {
    isNftDialogShowing.value = !isNftDialogShowing.value;
  }

  function showNftDialog() {
    isNftDialogShowing.value = true;
  }

  // Access the 'tokenId' from the route parameters
  const tokenId = computed(() => {
    return route.params?.tokenId || null;
  });

  // Check if 'tokenId' exists in the route parameters
  const hasTokenId = computed(() => {
    if (!route.params) {
      return false;
    } else {
      return route.params.hasOwnProperty('tokenId');
    }
  });

  function selectNft(nft) {
    selectedNft.value = nft;
    showNftDialog();
  }

  onMounted(async () => {
    if (hasTokenId.value) {
      const { getTokenMetaData } = await useBlockchain(
        itemsPerPage,
        new ethers.providers.JsonRpcProvider(blockchains.fantom.publicRpc),
        walletPublicKey,
        walletPublicKey,
        contractAddress,
        abi,
        chainId
      );

      const nfts = await getTokenMetaData([tokenId.value]);
      selectNft(nfts[0]);
    }
  });

  return {
    isNftDialogShowing,
    toggleIsNftDialogShowing,
    showNftDialog,
    selectNft,
    hasTokenId,
    tokenId,
    selectedNft
  };
}
