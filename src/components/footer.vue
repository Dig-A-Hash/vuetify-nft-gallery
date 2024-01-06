<template>
  <div class="text-center">
    <v-row class="d-flex align-center justify-center mt-10">
      <v-col cols="10" sm="8" md="6" lg="5" xl="4"
        ><v-divider></v-divider
      ></v-col>
    </v-row>
    <v-row dense class="mt-8 text-grey-darken-2">
      <v-col>
        <div class="mb-3">
          <v-btn to="/" variant="plain" size="60" title="Home">
            <!-- <img height="52" src="/img/logo-icon.png" /> -->
            Logo
          </v-btn>
        </div>
        <div class="text-body-2 mb-6">
          <v-icon icon="mdi-copyright" size="xs" class=""></v-icon>
          2023-{{ new Date().getFullYear() }}
          <div>Your Company Name v{{ version }}</div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import pkgJson from '../../package.json';
export default {
  data() {
    return {
      version: pkgJson.version,
    };
  },
  mounted() {},
};
</script>
