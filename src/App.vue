<template>
  <div>
    <router-view />
    <v-dialog
      v-model="globalMessageDialogStore.isShowing"
      width="100%"
      max-width="550"
    >
      <v-card class="bg-grey-darken-4 ma-4" rounded="lg">
        <v-toolbar :class="globalMessageDialogStore.titleClass" height="45"
          ><span class="ml-4 text-h6">{{
            globalMessageDialogStore.title
          }}</span></v-toolbar
        >
        <v-card-text>
          <p>{{ globalMessageDialogStore.message }}</p>
        </v-card-text>
        <v-card-actions class="d-flex justify-center mb-2">
          <v-btn
            variant="flat"
            color="secondary"
            @click.prevent="globalMessageDialogStore.isShowing = false"
            >Dismiss</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="globalMessageDialogStore.progressSpinner.isShowing"
      width="100%"
      persistent
      max-width="350"
    >
      <v-card class="bg-grey-darken-4" rounded="lg">
        <v-toolbar class="bg-primary" height="45"
          ><span class="ml-4 text-h6">Working</span></v-toolbar
        >
        <v-container>
          <v-row>
            <v-col>
              <v-progress-linear
                color="orange"
                indeterminate
                rounded
                height="10"
                class="mt-6"
              ></v-progress-linear>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-center mb-2">
              {{ globalMessageDialogStore.progressSpinner.message }}
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { useGlobalMessageDialogStore } from '@/store/globalMessageDialog';
const globalMessageDialogStore = useGlobalMessageDialogStore();
</script>
