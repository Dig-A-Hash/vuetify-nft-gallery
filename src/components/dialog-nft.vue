<template>
  <v-dialog
    v-model="props.isShowing"
    max-width="1000"
    scrollable
    @update:model-value="onChangeDialogShowing"
    :key="props.nft?.tokenId"
  >
    <v-card
      v-if="props.nft"
      width="100%"
      max-width="1300"
      class="backgrounds-dark-pink rounded-lg mx-auto"
      variant="outlined"
      color="purple-darken-1"
    >
      <v-toolbar elevation="0" class="bg-purple-darken-3 text-pink-lighten-4">
        <v-toolbar-items>
          <!-- Desktop Screen Size - Logo Button -->

          <v-btn @click="onToggleIsShowing" variant="text" title="Back to Home">
            <!-- <img height="40" src="/img/logo-icon.png" /> -->
            <span class="text-h6 font-frederick ml-1">Tattoo Viewer</span>
          </v-btn>
        </v-toolbar-items>

        <v-spacer class=""></v-spacer>
        <v-toolbar-items>
          <v-btn variant="text" size="x-large" @click="onToggleIsShowing"
            ><v-icon size="large" class="mt-1">mdi-close</v-icon>
            <span class="d-none d-sm-inline ml-2 font-splash2 text-capitalize"
              >Close</span
            ></v-btn
          >
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text
        class="pa-0 text-white"
        style="height: 100%; max-height: 1200px"
      >
        <v-container class="" fluid>
          <v-row>
            <v-col cols="12" md="8">
              <v-card class="bg-transparent">
                <v-img
                  :key="props.nft.tokenId"
                  :src="props.nft.metaData.image"
                  lazy-src="/img/place-holder.jpg"
                  cover
                  :style="{
                    transform: `scale(${zoomLevel}) translate(${dragX}px, ${dragY}px)`,
                  }"
                  @mousedown="onStartDrag"
                  @mousemove="onDrag"
                  @mouseup="onStopDrag"
                  @mouseleave="onStopDrag"
                  class="rounded-lg"
                  style="cursor: move"
                >
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular
                        color="purple-accent-4"
                        indeterminate
                        size="120"
                        width="12"
                      ></v-progress-circular>
                    </div>
                  </template>
                </v-img>
              </v-card>

              <div class="mt-2 d-flex justify-end">
                <v-btn
                  size="x-large"
                  variant="tonal"
                  class="mr-2"
                  icon="mdi-magnify-plus"
                  @click="onZoomIn"
                ></v-btn>
                <v-btn
                  size="x-large"
                  variant="tonal"
                  icon="mdi-magnify-minus"
                  @click="onZoomOut"
                ></v-btn>
              </div>
              <v-divider class="my-4"></v-divider>
              <div class="text-h6 text-pink-accent-2 mt-4">Description</div>
              {{ props.nft.metaData.description }}
            </v-col>
            <v-col cols="12" md="4" class="">
              <div class="text-h6 text-pink-accent-2">Name</div>
              <p>{{ props.nft.metaData.name }}</p>
              <v-divider class="my-4"></v-divider>

              <div v-if="nftStore.getOwner(props.nft.metaData)">
                <div class="text-h6 text-pink-accent-2">Owner Initials</div>
                <p class="mb-4">
                  {{ nftStore.getOwner(props.nft.metaData) }}
                </p>
                <v-divider class="my-4"></v-divider>
              </div>

              <div v-if="nftStore.getDateAdded(props.nft.metaData)">
                <div class="text-h6 text-pink-accent-2">Tattoo Completed</div>
                <p class="mb-4">
                  {{ formatDate(nftStore.getDateTaken(props.nft.metaData)) }}
                </p>
                <v-divider class="my-4"></v-divider>
              </div>

              <div v-if="nftStore.getDateAdded(props.nft.metaData)">
                <div class="text-h6 text-pink-accent-2">Added to Website</div>
                <p class="mb-4">
                  {{ formatDate(nftStore.getDateAdded(props.nft.metaData)) }}
                </p>
                <v-divider class="my-4"></v-divider>
              </div>

              <div v-if="nftStore.getSessionNumber(props.nft.metaData)">
                <div class="text-h6 text-pink-accent-2">Session Number</div>
                <p class="mb-4">
                  {{ nftStore.getSessionNumber(props.nft.metaData) }}
                </p>
                <v-divider class="my-4"></v-divider>
              </div>

              <div v-if="nftStore.getStyle(props.nft.metaData)">
                <div class="d-flex align-center">
                  <div>
                    <div class="text-h6 text-pink-accent-2">Style</div>
                    <div class="d-flex align-center">
                      <p class="mr-2">
                        {{ nftStore.getStyle(props.nft.metaData) }}
                      </p>
                    </div>
                  </div>
                  <v-spacer></v-spacer>
                  <v-chip size="x-large" color="amber">{{
                    nftStore.getStyleId(props.nft.metaData)
                  }}</v-chip>
                </div>
                <v-divider class="my-4"></v-divider>
              </div>

              <div v-if="nftStore.getBodyLocationId(props.nft.metaData)">
                <div class="text-h6 text-pink-accent-2">Location</div>
                <div>
                  <div class="mb-2 d-flex align-center">
                    <div>
                      {{
                        getBodyLocationById(
                          nftStore.getBodyLocationId(props.nft.metaData)
                        )
                      }}
                    </div>
                    <v-spacer></v-spacer>
                    Male
                    <v-chip
                      size="x-large"
                      color="light-blue-accent-1"
                      class="ml-2"
                      >{{
                        getBodyLocationPainPointsMale(
                          nftStore.getBodyLocationId(props.nft.metaData)
                        )
                      }}</v-chip
                    >
                  </div>

                  <div>
                    <div class="mb-2 d-flex align-center">
                      <v-spacer></v-spacer>
                      Female
                      <v-chip
                        size="x-large"
                        color="pink-accent-1"
                        class="ml-2"
                        >{{
                          getBodyLocationPainPointsFemale(
                            nftStore.getBodyLocationId(props.nft.metaData)
                          )
                        }}</v-chip
                      >
                    </div>
                  </div>
                </div>
              </div>
              <v-divider class="my-4"></v-divider>

              <div v-if="nftStore.getSizeId(props.nft.metaData)">
                <div class="d-flex align-center">
                  <div>
                    <div class="text-h6 text-pink-accent-2">Size</div>
                    <div class="d-flex align-center">
                      <p class="mr-2">
                        {{
                          getSizeById(nftStore.getSizeId(props.nft.metaData))
                        }}
                      </p>
                    </div>
                  </div>
                  <v-spacer></v-spacer>
                  <v-chip size="x-large" color="amber">{{
                    nftStore.getSizeId(props.nft.metaData)
                  }}</v-chip>
                </div>
                <v-divider class="my-4"></v-divider>
              </div>

              <div v-if="nftStore.getSessionHours(props.nft.metaData)">
                <div class="d-flex align-center">
                  <div>
                    <div class="text-h6 text-pink-accent-2">Session Hours</div>
                    <div class="d-flex align-center">
                      <p class="mr-2">
                        {{ nftStore.getSessionHours(props.nft.metaData) }}
                      </p>
                    </div>
                  </div>
                  <v-spacer></v-spacer>
                  <v-chip size="x-large" color="amber">{{
                    nftStore.getSessionHours(props.nft.metaData)
                  }}</v-chip>
                </div>
                <v-divider class="my-4"></v-divider>
              </div>

              <div v-if="nftStore.getHealingTypeId(props.nft.metaData)">
                <div class="d-flex align-center">
                  <div>
                    <div class="text-h6 text-pink-accent-2">Healing Type</div>
                    <div class="d-flex align-center">
                      <p class="mr-2">
                        {{
                          getHealingById(
                            nftStore.getHealingTypeId(props.nft.metaData)
                          )
                        }}
                      </p>
                    </div>
                  </div>
                  <v-spacer></v-spacer>
                  <v-chip size="x-large" color="amber">{{
                    nftStore.getHealingTypeId(props.nft.metaData)
                  }}</v-chip>
                </div>
                <v-divider class="my-4"></v-divider>
              </div>

              <div>
                <div class="text-h6 text-pink-accent-2">Pain Estimate</div>

                <div class="mr-2 mb-2 d-flex align-center">
                  {{
                    calculatePainEstimate(
                      nftStore.getStyleId(props.nft.metaData),
                      nftStore.getBodyLocationId(props.nft.metaData),
                      nftStore.getSizeId(props.nft.metaData),
                      nftStore.getSessionHours(props.nft.metaData),
                      nftStore.getHealingTypeId(props.nft.metaData),
                      true
                    )
                  }}
                  <v-spacer></v-spacer>
                  Male
                  <v-chip
                    class="ml-2"
                    size="x-large"
                    variant="tonal"
                    color="light-blue-accent-1"
                  >
                    {{
                      sumPainPoints(
                        nftStore.getStyleId(props.nft.metaData),
                        nftStore.getBodyLocationId(props.nft.metaData),
                        nftStore.getSizeId(props.nft.metaData),
                        nftStore.getSessionHours(props.nft.metaData),
                        nftStore.getHealingTypeId(props.nft.metaData),
                        true
                      )
                    }}
                    / 25
                  </v-chip>
                </div>
                <div class="mr-2 d-flex align-center">
                  {{
                    calculatePainEstimate(
                      nftStore.getStyleId(props.nft.metaData),
                      nftStore.getBodyLocationId(props.nft.metaData),
                      nftStore.getSizeId(props.nft.metaData),
                      nftStore.getSessionHours(props.nft.metaData),
                      nftStore.getHealingTypeId(props.nft.metaData),
                      false
                    )
                  }}
                  <v-spacer></v-spacer>
                  Female
                  <v-chip
                    size="x-large"
                    variant="tonal"
                    color="pink-accent-1"
                    class="ml-2"
                  >
                    {{
                      sumPainPoints(
                        nftStore.getStyleId(props.nft.metaData),
                        nftStore.getBodyLocationId(props.nft.metaData),
                        nftStore.getSizeId(props.nft.metaData),
                        nftStore.getSessionHours(props.nft.metaData),
                        nftStore.getHealingTypeId(props.nft.metaData),
                        false
                      )
                    }}
                    / 25
                  </v-chip>
                </div>
              </div>
              <div class="mt-4 text-center">
                <v-btn
                  variant="tonal"
                  prepend-icon="mdi-account-voice"
                  to="/pain"
                >
                  Pain Estimator
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <v-divider class="my-4"></v-divider>
          <v-row dense>
            <v-col class="mb-0">
              <div class="text-h6 text-pink-accent-2">NFT Details</div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="8">
              <div class="d-flex align-center">
                <p class="mr-2">Token ID</p>
                <v-chip>{{ props.nft.tokenId }}</v-chip>
              </div>
              <v-divider class="my-4"></v-divider>

              <div class="d-flex align-center mb-4">
                <v-text-field
                  variant="outlined"
                  hide-details
                  readonly
                  dense
                  label="Tattoo URL"
                  v-model="nftUrl"
                >
                </v-text-field>
              </div>

              <div class="d-flex align-center">
                <v-text-field
                  variant="outlined"
                  hide-details
                  readonly
                  dense
                  label="NFT Contract Address"
                  v-model="props.contractAddress"
                >
                </v-text-field>
              </div>
              <v-divider class="my-4"></v-divider>

              <div class="text-center mb-2">
                <v-btn
                  width="220"
                  class="px-4 mb-2 mr-2"
                  variant="outlined"
                  color="blue-lighten-2"
                  rounded="lg"
                  target="_new"
                  :href="`https://ftmscan.com/nft/${contractAddress}/${props.nft.tokenId}`"
                  append-icon="mdi-open-in-new"
                  >FTM Scan NFT</v-btn
                >
                <v-btn
                  width="220"
                  class="px-4 ml-0 mb-2 mr-2"
                  variant="outlined"
                  color="amber-darken-4"
                  rounded="lg"
                  target="_new"
                  :href="
                    nftStore.metaDataUrl(
                      props.nft.tokenId,
                      props.walletPublicKey,
                      props.chainId,
                      props.contractAddress
                    )
                  "
                  append-icon="mdi-open-in-new"
                  >NFT Meta-Data</v-btn
                >
              </div>

              <div class="text-center">
                <v-btn
                  width="220"
                  :href="`https://ftmscan.com/token/${contractAddress}#inventory`"
                  target="_new"
                  height="64"
                  color="blue-lighten-2"
                  variant="tonal"
                  class="mr-2 mb-2"
                  rounded="lg"
                >
                  <div class="mr-4">
                    <v-img src="/img/fantom.png" height="48" width="48"></v-img>
                  </div>

                  <div>Tokenized on<br />Fantom</div>
                </v-btn>

                <v-btn
                  width="220"
                  href="https://www.dig-a-hash.com"
                  target="_new"
                  height="64"
                  color="amber-darken-4"
                  variant="tonal"
                  class="mr-2 mb-2"
                  rounded="lg"
                >
                  <div class="mr-4">
                    <v-img
                      src="/img/dig-a-hash.png"
                      height="48"
                      width="48"
                    ></v-img>
                  </div>

                  <div>MetaData by<br />Dig-A-Hash</div>
                </v-btn>
              </div>
            </v-col>

            <v-col cols="12" md="4">
              <div
                class="d-flex justify-center justify-md-end align-center flex-wrap rounded-lg"
              >
                <figure class="qrcode rounded-lg">
                  <vue-qrcode
                    class="rounded-lg"
                    :value="nftUrl"
                    :options="{ width: 275 }"
                  ></vue-qrcode>
                  <img class="qrcode__image" src="/img/dig-a-hash.png" />
                </figure>
              </div>
              <div
                class="d-flex justify-center justify-md-end align-center flex-wrap"
              >
                <v-alert
                  max-width="275"
                  color="white"
                  variant="tonal"
                  border="start"
                  class="text-body-2 mt-4"
                  >Scanning the QR code with a phone will link directly to this
                  Tattoo.</v-alert
                >
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import VueQrcode from '@chenfengyuan/vue-qrcode';
import { usePainEstimator } from '@/composables/usePainEstimator';
import { formatDate } from '@/modules/dateUtils';

import { useNftStore } from '@/store/nft';

const nftStore = useNftStore();
const {
  calculatePainEstimate,
  sumPainPoints,
  getBodyLocationById,
  getBodyLocationPainPointsMale,
  getBodyLocationPainPointsFemale,
  getSizeById,
  getHealingById,
} = usePainEstimator();
const zoomLevel = ref(1);
const zoomIncrement = 0.2;
const maxZoom = 3;
const minZoom = 1;

const dragX = ref(0);
const dragY = ref(0);
let isDragging = false;
let startX = 0;
let startY = 0;

const props = defineProps({
  isShowing: {
    type: Boolean,
    default: false,
  },
  nft: {
    type: Object,
  },
  contractAddress: {
    type: String,
  },
  walletPublicKey: {
    type: String,
  },
  chainId: {
    type: Number,
  },
  artistNameGalleryPath: {
    type: String,
  },
});

const emit = defineEmits(['toggleShowing']);

const nftUrl = computed(() => {
  return nftStore.nftUrl(props.nft?.tokenId || -1, props.artistNameGalleryPath);
});

onMounted(async () => {});

function onToggleIsShowing() {
  dragX.value = 0;
  dragY.value = 0;
  isDragging = false;
  startX = 0;
  startY = 0;
  zoomLevel.value = 1;
  emit('toggleShowing');
}

function onChangeDialogShowing(value) {
  if (props.isShowing) {
    emit('toggleShowing');
  }
}

function onZoomIn() {
  if (zoomLevel.value < maxZoom) {
    zoomLevel.value += zoomIncrement;
  }
}

function onZoomOut() {
  if (zoomLevel.value > minZoom) {
    zoomLevel.value -= zoomIncrement;
  }
}

function onStartDrag(event) {
  event.preventDefault();
  isDragging = true;
  startX = event.clientX - dragX.value;
  startY = event.clientY - dragY.value;
}

function onDrag(event) {
  if (isDragging) {
    dragX.value = event.clientX - startX;
    dragY.value = event.clientY - startY;
  }
}

function onStopDrag() {
  isDragging = false;
}
</script>
