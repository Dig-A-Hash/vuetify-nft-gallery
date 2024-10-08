import { defineStore } from 'pinia';
import { useNftStore } from 'vue-evm-nft';

const nftStore = useNftStore();

/**
 * Gets the base URL for all DAH meta data.
 * @param {string} walletPublicKey
 * @param {number} chainId
 * @param {string} contractAddress
 * @returns a string of the base URL without a token ID.
 */
function deriveMetaDataBaseUrl(walletPublicKey, chainId, contractAddress) {
  return `${
    import.meta.env.VITE_DAH_NFT_CDN
  }profiles/${walletPublicKey.toLowerCase()}/meta-data/${chainId}/${contractAddress.toLowerCase()}/`;
}

/**
 * This is intended to be customized to create helpers for NFT
 * meta data.
 */
export const useNftHelperStore = defineStore('nftHelperStore', {
  state: () => ({}),

  getters: {
    // NFT Meta Data Attributes
    nftFtmScanUrl: (state) => {
      return (tokenId) => {
        return `https://ftmscan.com/token/${
          import.meta.env.VITE_POUR_HOUSE_CONTRACT
        }?a=${tokenId}`;
      };
    },
    nftUrl: () => {
      return (tokenId, artistPathName) =>
        `${import.meta.env.VITE_SITE_URL}${artistPathName}/${tokenId}`;
    },
    metaDataBaseUrl: () => {
      return (walletPublicKey, chainId, contractAddress) => {
        return deriveMetaDataBaseUrl(walletPublicKey, chainId, contractAddress);
      };
    },
    metaDataUrl: () => {
      return (tokenId, walletPublicKey, chainId, contractAddress) => {
        return `${deriveMetaDataBaseUrl(
          walletPublicKey,
          chainId,
          contractAddress
        )}${tokenId}.json`;
      };
    },

    getStatus: () => {
      return (metaData) => {
        return nftStore.getPublicAttributeValue(metaData, 'status') || 'N/A';
      };
    },
    getDate: () => {
      return (metaData) => {
        return nftStore.getPublicAttributeValue(metaData, 'date') || 'N/A';
      };
    },
    getStatusColor: () => {
      return (status) => {
        switch (status) {
          case 'N/A':
            return 'gray';
          case 'Beta':
            return 'yellow';
          case 'Complete':
            return 'success';
          case 'In Progress':
            return 'warning';
          default:
            return 'gray';
        }
      };
    },
  },
});
