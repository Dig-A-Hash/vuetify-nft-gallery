import { defineStore } from 'pinia';

/**
     * Gets the specified public meta-data attributes value.
     * @param {object} metaData - The NFT meta-data.
     * @param {object} propertyName - The NFT meta-data property name.
     * @returns A value from the meta-data attributes.
     */
function metaDataAttributeValue(metaData, propertyName) {
  return metaData?.attributes?.find((item) => {
    return item.trait_type?.toLowerCase() === propertyName.toLowerCase();
  })?.value || null;
}

/**
     * Gets the specified public meta-data attribute value or the NFT image if
     * the  meta-data attribute value does not exist. This is used to 
     * get smaller versions of the original image from meta-data
     * attributes.
     * @param {object} metaData - The NFT meta-data.
     * @param {object} propertyName - The NFT meta-data property name.
     * @returns A value from the meta-data.
     */
function metaDataAttributeValueOrImage(metaData, propertyName) {
  return metaData?.attributes?.find((item) => {
    return item.trait_type?.toLowerCase() === propertyName.toLowerCase();
  })?.value || metaData.image;
}

/**
 * Gets the base URL for all DAH meta data.
 * @param {string} walletPublicKey 
 * @param {number} chainId 
 * @param {string} contractAddress 
 * @returns a string of the base URL without a token ID.
 */
function metaDataBaseUrl(walletPublicKey, chainId, contractAddress) {
  return `${import.meta.env.VITE_DAH_NFT_CDN}profiles/${walletPublicKey.toLowerCase()}/meta-data/${chainId}/${contractAddress.toLowerCase()}/`;
}

/**
 * Defines the nftStore.
 */
export const useNftStore = defineStore('nftStore', {
  state: () => ({
    itemCollections: {
      stephen: {
        items: [],
        itemCount: 0, // Total number of items.
        page: 1,
      },
      stephenRecent: {
        items: [],
        itemCount: 0, // Total number of items.
        page: 1,
      }
    }
  }),

  getters: {
    // Utilities

    pageSize() {
      return parseInt(import.meta.env.VITE_ITEMS_PER_PAGE);
    },


    // Meta-Data URLs & Contract Addresses

    nftFtmScanUrl: (state) => {
      return (tokenId) => {
        return `https://ftmscan.com/token/${import.meta.env.VITE_POUR_HOUSE_CONTRACT}?a=${tokenId}`;
      }
    },
    nftUrl: () => {
      return (tokenId, artistPathName) => `${import.meta.env.VITE_SITE_URL}gallery/${artistPathName}/${tokenId}`;
    },
    metaDataBaseUrl: () => {
      return (walletPublicKey, chainId, contractAddress) => {
        return metaDataBaseUrl(walletPublicKey, chainId, contractAddress);
      }
    },
    metaDataUrl: () => {
      return (tokenId, walletPublicKey, chainId, contractAddress) => {
        return `${metaDataBaseUrl(walletPublicKey, chainId, contractAddress)}${tokenId}.json`;
      }
    },

    // NFT Meta Data Attributes

    getImageLarge: () => {
      return (metaData) => {
        return metaDataAttributeValueOrImage(metaData, 'url-large');
      }
    },
    getImageMedium: () => {
      return (metaData) => {
        return metaDataAttributeValueOrImage(metaData, 'url-medium');
      }
    },
    getOwner: () => {
      return (metaData) => {
        return metaDataAttributeValue(metaData, 'owner');
      }
    },
    getDateAdded: () => {
      return (metaData) => {
        return metaDataAttributeValue(metaData, 'date-added');
      }
    },
    getDateTaken: () => {
      return (metaData) => {
        return metaDataAttributeValue(metaData, 'date-taken');
      }
    },
    getSessionNumber: () => {
      return (metaData) => {
        return metaDataAttributeValue(metaData, 'session-number');
      }
    },
    getStyle: () => {
      return (metaData) => {
        return metaDataAttributeValue(metaData, 'style');
      }
    },
    getStyleId: () => {
      return (metaData) => {
        return metaDataAttributeValue(metaData, 'style-id');
      }
    },
    getBodyLocationId: () => {
      return (metaData) => {
        return metaDataAttributeValue(metaData, 'body-location-id');
      }
    },
    getSizeId: () => {
      return (metaData) => {
        return metaDataAttributeValue(metaData, 'size-id');
      }
    },
    getSessionHours: () => {
      return (metaData) => {
        return metaDataAttributeValue(metaData, 'session-hours-id');
      }
    },
    getHealingTypeId: () => {
      return (metaData) => {
        return metaDataAttributeValue(metaData, 'healing-type-id');
      }
    },
  },
  actions: {
    setCollectionItems(page, items, collectionName) {
      this.itemCollections[collectionName].items[page - 1] = items;
    }
  }
});