import { ref, onMounted, watch } from 'vue';
import { useBlockchain, blockchains } from '@/composables/useBlockchain';
import { useNftStore } from '@/store/nft';
import { ethers } from 'ethers';
import { useGlobalMessageDialogStore } from '@/store/globalMessageDialog';

/**
 * Initializes the NFT Gallery composable exposing several variables and
 * functions needed to call the blockchain for NFT Gallery purposes.
 * @param {string} walletPublicKey - The public key of the wallet holding the contract.
 * @param {string} contractAddress - The contract address.
 * @param {array} abi - The contract ABI.
 * @param {number} chainId - The EVM Chain ID.
 * @param {string} ethersProviderUrl - The Ethers provider for the Chain ID.
 * @param {number} itemsPerPage - The number of items to get per page.
 * @param {boolean} disableGlobalSpinner - Disables the global spinner, use your own.
 * @param {string} nftStoreItemCollectionName - The NFT Store collection name.
 * @param {boolean} isAscendingSort - Sorting value.
 * @returns page, numberOfPages, nfts, isAscending, onChangeSortOrder,
 */
export function useNftGallery(walletPublicKey, contractAddress, abi, chainId, ethersProviderUrl, itemsPerPage, disableGlobalSpinner, nftStoreItemCollectionName, isAscendingSort) {
  const nftStore = useNftStore();

  const globalMessageDialogStore = useGlobalMessageDialogStore();

  const page = ref(1);
  const numberOfPages = ref(0);
  const nfts = ref([]);
  const isAscending = ref(isAscendingSort);

  let getMyNfts = null;

  onMounted(async () => {
    const { getNfts } = await useBlockchain(
      parseInt(itemsPerPage),
      new ethers.JsonRpcProvider(ethersProviderUrl),
      null,
      walletPublicKey,
      contractAddress,
      abi,
      chainId
    );

    getMyNfts = getNfts;

    await onGetMyNfts(page.value);
  });

  watch(page, async (newPage, oldPage) => {
    if (newPage !== oldPage) {
      nftStore.itemCollections[nftStoreItemCollectionName].page = newPage;
      await onGetMyNfts(newPage);
    }
  });

  async function onChangeSortOrder() {
    isAscending.value = !isAscending.value;
    nftStore.itemCollections[nftStoreItemCollectionName].items = [];
    nftStore.itemCollections[nftStoreItemCollectionName].page = 1;
    page.value = 1;
    await onGetMyNfts(page.value);
  }

  async function onGetMyNfts(iPage) {
    // Skip fetching NFTs if we already have them.
    if (nftStore.itemCollections[nftStoreItemCollectionName].items[iPage - 1]) {
      nfts.value = nftStore.itemCollections[nftStoreItemCollectionName].items[iPage - 1];
      return;
    }

    try {
      if (!disableGlobalSpinner) {
        globalMessageDialogStore.showProgressSpinner();
      }
      const { tokens, pageSize, count } = await getMyNfts(iPage, isAscending.value);
      nfts.value = tokens;
      nftStore.setCollectionItems(iPage, tokens, nftStoreItemCollectionName);
      nftStore.itemCollections[nftStoreItemCollectionName].page = Math.ceil(count / pageSize);
      numberOfPages.value = nftStore.itemCollections[nftStoreItemCollectionName].page;

      nftStore.itemCollections[nftStoreItemCollectionName].itemCount = count;
      globalMessageDialogStore.hideProgressSpinner();
    } catch (error) {
      globalMessageDialogStore.hideProgressSpinner();
      globalMessageDialogStore.handleException(error);
    }
  }

  return {
    page,
    numberOfPages,
    nfts,
    isAscending,
    onChangeSortOrder
  };
}
