<template>
  <v-sheet class="bg-grey-darken-4">
    <v-container fluid class="ma-0 border-top-grey border-bottom-grey">
      <v-row>
        <v-col cols="12" sm="6" class="d-flex justify-start align-center">
          <v-avatar
            class="mr-4"
            size="64"
            color="grey-darken-1"
            variant="outlined"
          >
            <v-icon>mdi-star</v-icon>
          </v-avatar>
          <div>
            <div class="text-h6 mb-0">Stephen Anderson's NFT Portfolio</div>
            <div class="mt-n1">
              This is a demo of the NFT Viewer for Vuetify. Change out the
              contract address and Chain ID to display your own NFTs.
            </div>
          </div>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          class="d-flex justify-center justify-sm-end align-center"
        >
          <div>
            Viewing
            <v-chip class="mr-1">{{
              page === 1 ? '1' : (page - 1) * nftStore.pageSize + 1
            }}</v-chip>
            -
            <v-chip class="mr-1">{{
              page * nftStore.pageSize >
              nftStore.itemCollections[nftStoreCollectionName].itemCount
                ? nftStore.itemCollections[nftStoreCollectionName].itemCount
                : page * nftStore.pageSize
            }}</v-chip>
            of
            <v-chip class="mr-1">{{
              nftStore.itemCollections[nftStoreCollectionName].itemCount
            }}</v-chip>

            <v-btn
              size="small"
              :icon="isAscending ? 'mdi-arrow-down' : 'mdi-arrow-up'"
              class="ml-2"
              color="success"
              variant="icon"
              :title="`Change Sort Order to ${
                isAscending ? '(Descending)' : '(Descending)'
              }`"
              @click="onChangeSortOrder"
            ></v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
  <v-container fluid class="ma-0 pt-2 px-2 bg-black">
    <v-row dense>
      <v-col
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
        v-for="(nft, index) in nfts"
        :key="nft.tokenId"
      >
        <v-card
          height="100%"
          width="100%"
          class="bg-transparent"
          @click="selectNft(nft)"
          variant="outlined"
          color="grey"
        >
          <v-img
            :src="nftStore.getImageLarge(nft.metaData)"
            cover
            height="100%"
          >
            <div
              class="bg-grey-darken-4 pa-4 border-bottom-grey d-flex align-center"
            >
              <div class="text-h6 text-pink-lighten-4">
                {{ nft.metaData.name }}
              </div>
              <v-spacer></v-spacer>

              <v-icon size="large" color="purple-lighten-2"
                >mdi-open-in-app</v-icon
              >
            </div>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-6">
      <v-col>
        <v-pagination
          v-model="page"
          :length="numberOfPages"
          rounded="circle"
        ></v-pagination>
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
import foot from '@/components/site-footer.vue';
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
const itemsPerPage = 24;
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
    false,
    nftStoreCollectionName,
    true
  );
</script>
