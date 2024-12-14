<template>
  <v-sheet class="bg-transparent mx-xs-0 mx-sm-auto px-4" max-width="1000">
    <div class="text-center mb-8 pt-4 mt-8">
      <div class="d-flex justify-center">
        <v-img
          transition="fade-transition"
          src="/img/vuetify-nft-gallery.jpg"
          alt="Dig-A-Hash"
          max-width="600"
        />
      </div>

      <v-card
        class="mx-auto mt-10 pa-6 elevation-0 bg-grey-darken-4"
        max-width="600"
        rounded="xl"
      >
        <h1 class="text-h5 sm-text-h2 text-orange">Vuetify NFT Gallery</h1>

        <p class="text-body-1 mt-2 text-left">
          This is a demo of how to display NFTs by implementing the vue-evm-nft
          package with Vuetify and Vue.
        </p>

        <p class="text-body-1 mt-4 text-left">
          Below are links to websites using this package, followed by a
          sortable, paged list of NFTs using the Vuetify component library!
        </p>
      </v-card>

      <div class="d-flex align-center justify-space-around mt-8">
        <a href="https://www.dig-a-hash.com/" target="_new">
          <v-img src="/img/logo-hero-transparent.png" width="100"> </v-img>
        </a>
        <a href="https://www.dog-plex.com/" target="_new">
          <v-img src="/img/customers/dog-plex-logo.png" width="100"> </v-img>
        </a>
        <a href="https://www.urbanhomesteadx.com/" target="_new">
          <v-img src="/img/customers/urban-homestead-x.png" width="100"></v-img>
        </a>
        <a href="https://www.pour-house-studios.com/" target="_new">
          <v-img src="/img/customers/pour-house.png" width="100"></v-img>
        </a>
      </div>
    </div>
    <div class="text-h3 mb-4">vue-evm-nft Demo</div>
    <v-container
      fluid
      class="ma-0 border-top-grey border-bottom-grey bg-blue-darken-4"
    >
      <v-row class="">
        <v-col cols="12" sm="6" class="d-flex justify-start align-center">
          <div>
            <div class="text-h6 mb-0">Dig-A-Hash Roadmap</div>
            <div class="mt-n1">
              Each of the announcements below is an NFT on the Avalanche C-Chain
              Mainnet!
            </div>
          </div>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          class="d-flex justify-center justify-sm-end align-center"
        >
          <div v-if="nftStore.itemCollections[nftStoreItemCollectionName]">
            Viewing
            <v-chip class="mr-1">{{
              page === 1 ? '1' : (page - 1) * itemsPerPage + 1
            }}</v-chip>
            -
            <v-chip class="mr-1">{{
              page * itemsPerPage >
              nftStore.itemCollections[nftStoreItemCollectionName].itemCount
                ? nftStore.itemCollections[nftStoreItemCollectionName].itemCount
                : page * itemsPerPage
            }}</v-chip>
            of
            <v-chip class="mr-1">{{
              nftStore.itemCollections[nftStoreItemCollectionName].itemCount
            }}</v-chip>

            <v-btn
              size="small"
              :icon="isAscending ? 'mdi-arrow-down' : 'mdi-arrow-up'"
              class="ml-2"
              variant="outlined"
              color="white"
              :title="`Change Sort Order to ${
                isAscending ? '(Descending)' : '(Ascending)'
              }`"
              @click="onToggleSortOrder"
            ></v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-container fluid class="pt-8 pt-2 px-2 bg-grey-darken-4">
      <v-row v-for="(nft, index) in nfts" :key="nft.tokenId">
        <v-col cols="12" sm="3" md="2">
          <a href="#" @click.prevent="selectNft(nft)">
            <v-img :src="nft.metaData.image" class="ma-4"></v-img>
          </a>
        </v-col>
        <v-col>
          <div>
            <div class="text-orange text-h6 text-md-h5">
              {{ nft.metaData.name }}
            </div>
            <div class="my-2">
              <v-chip
                :color="
                  nftHelperStore.getStatusColor(
                    nftHelperStore.getStatus(nft.metaData)
                  )
                "
                >{{ nftHelperStore.getStatus(nft.metaData) }}</v-chip
              >
            </div>
            <span class="text-subtitle-1">
              <span
                v-if="
                  nftHelperStore.getStatus(nft.metaData).toLowerCase() ===
                  'complete'
                "
              >
                Release Date:
              </span>
              <span v-else> Target Release: </span>

              {{ nftHelperStore.getDate(nft.metaData) }}</span
            >
            <p class="mt-2" v-html="nft.metaData.description"></p>
            <v-btn
              class="mt-4 mr-2"
              variant="tonal"
              color="grey"
              rounded="lg"
              target="_blank"
              :href="`https://avascan.info/blockchain/c/erc721/0x33f1cdD52e7ec6F65Ab93dD518c1e2EdB3a8Dd63/nft/${nft.tokenId}`"
              append-icon="mdi-open-in-new"
              >Ava Scan NFT</v-btn
            >
            <v-btn
              class="mt-4"
              variant="tonal"
              color="grey"
              rounded="lg"
              target="_blank"
              :href="
                nftHelperStore.metaDataUrl(
                  nft.tokenId,
                  contractPublicKey,
                  chainId,
                  contractAddress
                )
              "
              append-icon="mdi-open-in-new"
              >NFT Meta-Data</v-btn
            >
          </div>
        </v-col>
        <v-divider class="my-4"></v-divider>
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
    </v-container>
  </v-sheet>

  <dialog-nft
    :is-showing="isNftDialogShowing"
    :nft="selectedNft"
    :contractAddress="contractAddress"
    :wallet-public-key="contractPublicKey"
    :chain-id="chainId"
    :artist-name-gallery-path="nftStoreItemCollectionName"
    @toggle-showing="toggleIsNftDialogShowing"
  ></dialog-nft>
</template>

<script setup>
import { watch } from 'vue';
import dialogNft from '@/components/dialog-nft.vue';
import { useDialogNft } from '@/composables/useDialogNft';
import {
  useEvmNftGallery,
  blockchains,
  dahDemoV1Abi as abi,
  useNftStore,
} from 'vue-evm-nft';
import { useNftHelperStore } from '@/store/nftHelperStore';
import { useGlobalMessageDialogStore } from '@/store/globalMessageDialog';

const contractPublicKey = import.meta.env.VITE_SITE_WALLET;
const contractAddress = import.meta.env.VITE_CONTRACT_1_ADDRESS;
const chainId = blockchains.avalanche.chainId;
const itemsPerPage = 5;
const nftStoreItemCollectionName = 'nftSmartContract1';

const nftStore = useNftStore();
const nftHelperStore = useNftHelperStore();
const globalMessageDialogStore = useGlobalMessageDialogStore();

const { isNftDialogShowing, toggleIsNftDialogShowing, selectedNft, selectNft } =
  useDialogNft(contractPublicKey, contractAddress, abi, chainId, itemsPerPage);

const {
  page,
  numberOfPages,
  nfts,
  isLoading,
  nftLoadingMessage,
  isAscending,
  onToggleSortOrder,
} = useEvmNftGallery(
  contractPublicKey,
  contractAddress,
  abi,
  chainId,
  null,
  blockchains.avalanche.publicRpc,
  itemsPerPage,
  nftStoreItemCollectionName,
  false
);

watch(isLoading, (newValue) => {
  if (newValue === true) {
    globalMessageDialogStore.showProgressSpinner();
  } else {
    globalMessageDialogStore.hideProgressSpinner();
  }
});

watch(nftLoadingMessage, (newValue) => {
  globalMessageDialogStore.progressSpinner.message = newValue;
});
</script>
