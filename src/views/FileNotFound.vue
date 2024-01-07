<template>
  <v-container class="fill-height">
    <v-row>
      <v-col class="text-center fill-height">
        <v-icon class="text-error text-h1">mdi-web-remove</v-icon>
        <div class="mt-4 mb-8 text-h5 text-error">(404) File Not Found</div>
        <v-btn color="success" variant="outlined" to="/">Home</v-btn>
        <div class="mb-16 pt-8" />
        <site-footer />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import siteFooter from '@/components/Footer.vue';
</script>
