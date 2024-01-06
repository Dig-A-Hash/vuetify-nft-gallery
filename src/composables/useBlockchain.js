import axios from 'axios';
import { ethers } from 'ethers';

import { useGlobalMessageDialogStore } from '@/store/globalMessageDialog';
const globalMessageDialogStore = useGlobalMessageDialogStore();

// An object containing the supported blockchain definitions.
export const blockchains = {
  fantom: {
    chainId: 250,
    name: 'Fantom',
    enabled: true,
    isTestnet: false,
    env: 'Mainnet',
    iconUrl: '/img/blockchain-logos/fantom.png',
    explorerName: 'Fantom Mainnet Explorer',
    explorerUrl: 'https://ftmscan.com/',
    nativeCurrency: {
      name: 'FTM',
      symbol: 'FTM',
      decimals: 18,
    },
    publicRpc: 'https://rpc.ankr.com/fantom/',
  },
  avalanche: {
    chainId: 43114,
    name: 'Avalanche',
    enabled: true,
    isTestnet: false,
    env: 'Mainnet',
    iconUrl: '/img/blockchain-logos/avalanche.png',
    explorerName: 'SnowTrace Explorer',
    explorerUrl: 'https://snowtrace.io/',
    metaDataUrl: '/avalanche/mainnet/meta-data', // DAH API meta-data URL
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18,
    },
    publicRpc: 'https://api.avax.network/ext/bc/C/rpc',
  },
};

/**
 * Gets contract and NFT data from the Blockchain by setting up the useBlockchain 
 * composable with stateful parameters that must be setup by the caller.
 * This composable requires Ethers.js and Axios as dependencies.
 * @param {integer} pageSize - The number of items per page.
 * @param {object} provider - The ethers.js provider.
 * @param {string} publicKey - NFT holder's wallet, set to null to get all NFTs on contract (history).
 * @param {string} contractOwnerPublicKey - The contract owner's wallet.
 * @param {string} contractAddress - The contract address.
 * @param {array} contractABI - The contract ABI.
 * @param {integer} chainId - The chain ID.
 * @param {string} excludeWallet - The wallet to exclude from the NFTs. Only works when publicKey is null.
 * @returns An object containing the following properties:
 * getMyNfts: A function to get the NFTs for the current user.
 */
export async function useBlockchain(
  pageSize,
  provider,
  publicKey,
  contractOwnerPublicKey,
  contractAddress,
  contractABI,
  chainId
) {
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  var balance = 0;
  contractOwnerPublicKey = contractOwnerPublicKey.toLowerCase();
  contractAddress = contractAddress.toLowerCase();



  /**
   * Gets NFTs, plus Meta-Data in specified order.
   * @param {integer} page - The page number.
   * @param {boolean} isAscending - True to sort in ascending order, false to sort in descending order.
   * @returns An object containing the items, pageSize, and a totalCount of all NFTs on this contract.
   */
  async function getNfts(page, isAscending) {
    globalMessageDialogStore.progressSpinner.message =
      'Connecting to Blockchain...';

    if (publicKey) {
      // Get Contract NFT balance for the specified wallet.
      publicKey = publicKey.toLowerCase();
      balance = await contract.balanceOf(publicKey);
      balance = balance.toNumber();
    } else {
      // Get Contract NFT balance for the entire contract.
      balance = await contract.totalSupply();
      balance = balance.toNumber();
    }

    // Calculate the last page.
    const lastPage = Math.ceil(balance / pageSize);

    if (!page) {
      page = 1;
    }

    // Calculate the start and end indexes for the current page
    var startIndex, endIndex;

    if (!isAscending) {
      startIndex = Math.max(0, balance - pageSize * page);
      endIndex = Math.max(0, balance - pageSize * (page - 1));
    } else {
      startIndex = pageSize * (page - 1);
      endIndex = Math.min(balance, pageSize * page);
    }

    // Batch fetching token IDs
    const batchedTokenIdPromises = [];

    if (!publicKey) {
      // get All tokens on contract historical.
      for (let tokenId = endIndex; tokenId > startIndex; tokenId--) {
        batchedTokenIdPromises.push(contract.ownerOf(tokenId).then(owner => {
          return ({ tokenId, owner });
        }));
      }
    } else {
      // get tokens for specified wallet.
      for (let i = endIndex; i > startIndex; i--) {
        batchedTokenIdPromises.push(
          contract.tokenOfOwnerByIndex(publicKey, i - 1).then(tokenId => (
            {
              tokenId: tokenId.toNumber(),
              owner: publicKey
            })).catch(error => {
              console.error(`Error fetching token at index ${i}:`, error);
              throw error;
            }));
      }
    }

    const batchedTokenIds = await Promise.all(batchedTokenIdPromises);

    const tokens = await getMetaDataBatch(batchedTokenIds, isAscending);

    return { tokens, pageSize, count: balance };
  }

  /**
   * Prepares and post processes the batched token IDs to assemble meta-data and 
   * on chain token IDs and owners.
   * @param {*} batchedTokenIds 
   * @param {*} isAscending 
   * @returns An array of objects containing the tokens and their meta-data.
   */
  async function getMetaDataBatch(batchedTokenIds, isAscending) {
    // Create an array to store the valid token IDs
    const validTokenIds = [];
    for (const batchedToken of batchedTokenIds) {
      if (batchedToken.owner !== null) {
        validTokenIds.push(batchedToken.tokenId);
      }
    }

    // Get Meta-Data for each token.
    const tokensWithMetaData = await getTokenMetaData(validTokenIds);

    // Match up owner's publicKey with tokens to set the owner property.
    const tokens = tokensWithMetaData.map(metaData => {
      const matchingToken = batchedTokenIds.find(token => token.tokenId === metaData.tokenId);
      if (matchingToken) {
        return { ...metaData, owner: matchingToken.owner };
      }
      return metaData;
    });

    // Sort the tokens by tokenId if Ascending.
    if (isAscending) {
      tokens.sort((a, b) => {
        return a.tokenId - b.tokenId;
      });
    }
    return tokens;
  }

  /**
   * Gets the NFT Meta-Data for a list of token IDs.
   * @param {array} tokenIds - The token IDs.
   * @returns An array of objects containing the token ID, meta-data URL,
   * meta-data, and private data.
   */
  async function getTokenMetaData(tokenIds) {
    const tokens = [];
    globalMessageDialogStore.progressSpinner.message = 'Fetching Meta-Data...';

    const metaDataUrls = tokenIds.map((tokenId) => {
      return `${import.meta.env.VITE_DAH_NFT_CDN
        }profiles/${contractOwnerPublicKey.toLowerCase()}/meta-data/${chainId}/${contractAddress}/${tokenId.toString()}.json`;
    });

    const metaDataPromises = metaDataUrls.map(async (metaDataUrl) => {
      var publicMetaData = {};
      try {
        publicMetaData = await axios.get(metaDataUrl + '?v=' + Date.now());
      } catch (error) {
        publicMetaData.data = null;
      }

      return publicMetaData.data;
    });

    const metaData = await Promise.all(metaDataPromises);

    for (let i = 0; i < tokenIds.length; i++) {
      const tokenId = tokenIds[i];
      tokens.push({
        tokenId,
        metaDataUrl: metaDataUrls[i],
        metaData: metaData[i],
        privateData: null,
      });
    }

    return tokens;
  }

  /**
   * Gets the owner of a token.
   * @param {*} tokenId - The token ID.
   * @returns A wallet address.
   */
  async function getTokenOwner(tokenId) {
    try {
      const owner = await contract.ownerOf(tokenId);
      return owner;
    } catch (error) {
      console.error(`Error fetching token with ID ${tokenId}:`, error);
      throw error;
    }
  }

  return { getNfts, getTokenOwner, getMetaDataBatch, getTokenMetaData };
}