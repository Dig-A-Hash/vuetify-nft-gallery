<template>
  <v-container fluid class="ma-0">
    <v-row dense>
      <v-col class="" cols="12">
        <v-card
          height="100%"
          class="border-pink"
          color="pink-accent-2"
          variant="tonal"
        >
          <div class="text-h5 d-flex align-center mb-2 bg-pink-accent-4 pa-4">
            <v-icon class="mr-2">mdi-new-box</v-icon>Latest Tattoos
            <v-spacer></v-spacer>
            <v-btn variant="outlined">See All</v-btn>
          </div>
          <div class="px-2">
            <div class="text-center mb-8" v-if="nfts.length <= 0">
              <div class="mt-16 mb-6 d-flex justify-center">
                <v-progress-circular
                  :size="100"
                  :width="12"
                  color="pink-accent-4"
                  indeterminate
                ></v-progress-circular>
              </div>
              Connecting to Blockchain...
            </div>
            <v-list class="bg-transparent" v-if="nfts.length > 0">
              <v-list-item
                v-for="(nft, index) in nfts"
                :key="nft.tokenId"
                @click="selectNft(nft)"
                variant="tonal"
                class="navbar-item-color ml-2 mr-2 navbar-item-margin mb-2"
                active-class="navbar-item-color-active"
                rounded="lg"
              >
                <div class="d-flex align-center pa-2">
                  <v-avatar
                    size="95"
                    color="text-grey-lighten-2"
                    variant="outlined"
                    class="mr-6"
                  >
                    <v-img
                      :src="nftStore.getImageMedium(nft.metaData)"
                      cover
                    ></v-img>
                  </v-avatar>
                  <div class="text-pink-lighten-4">
                    <div class="text-h6">{{ nft.metaData.name }}</div>
                    <div>
                      {{ formatDate(nftStore.getDateAdded(nft.metaData)) }}
                    </div>
                  </div>
                </div>
              </v-list-item>
            </v-list>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <foot></foot>
  </v-container>
  <dialog-nft
    :is-showing="isNftDialogShowing"
    :nft="selectedNft"
    :contractAddress="contractAddress"
    :wallet-public-key="walletPublicKey"
    :chain-id="chainId"
    :artist-name-gallery-path="nftStoreCollectionName"
    @toggle-showing="toggleIsNftDialogShowing"
  ></dialog-nft>
</template>

<script setup>
import foot from '@/components/Footer.vue';
import dialogNft from '@/components/dialog-nft.vue';

import { useDialogNft } from '@/composables/useDialogNft';
import { useNftGallery } from '@/composables/useNftGallery';
import { blockchains } from '@/composables/useBlockchain';
import { formatDate } from '@/modules/dateUtils';

import { useNftStore } from '@/store/nft';

import { dahDemoV1Abi } from '@/modules/dahDemoV1Abi';

const walletPublicKey = import.meta.env.VITE_ART_WALLET_STEPHEN;
const contractAddress = import.meta.env.VITE_ART_CONTRACT_STEPHEN;
const chainId = blockchains.fantom.chainId;
const itemsPerPage = 3;
const nftStoreCollectionName = 'nftSmartContract1';

const nftStore = useNftStore();

const { isNftDialogShowing, toggleIsNftDialogShowing, selectedNft, selectNft } =
  useDialogNft(
    walletPublicKey,
    contractAddress,
    dahDemoV1Abi,
    chainId,
    itemsPerPage
  );

const { page, numberOfPages, nfts, isAscending, onChangeSortOrder } =
  useNftGallery(
    walletPublicKey,
    contractAddress,
    dahDemoV1Abi,
    chainId,
    blockchains.fantom.publicRpc,
    itemsPerPage,
    true,
    nftStoreCollectionName,
    false
  );
</script>
