# Vuetify NFT Gallery

This is a Web Front-End written with [Vue 3](https://vuejs.org/guide/introduction.html) and [Vuetify](https://dev.vuetifyjs.com/en/introduction/why-vuetify/#what-is-vuetify3f).

You can see examples of how it works on the following websites where this project is in production use...

https://www.thistleandthorntattoo.net/

https://www.pour-house-studios.com/

This project has a .env file that is setup to work with Dig-A-Hash web services for Dynamic NFT Meta-Data.

https://www.dig-a-hash.com/

There are several other re-usable resources included like [Pinia](https://pinia.vuejs.org/introduction.html) stores, [components](https://vuejs.org/guide/components/registration.html), and [composables](https://vuejs.org/guide/extras/composition-api-faq.html) that can be used to call any EVM based blockchain for NFTs using [Ethers.js](https://github.com/ethers-io/ethers.js), even if the browser does not have a wallet installed. See the following files for more info...

```
./src/composables/
./src/store/nft.js
```

There is also a 404 route built-in using the [Vue Router](https://router.vuejs.org/guide/).

## CSS Notes

SCSS is installed along with numerous utility classes that compliment or override Vuetify defaults. This app ships with two fonts installed that are ready to be used or swapped out. See the following files for more info...

```
./src/scss/fonts.scss

```

## Optional

This project also ships with Vercel support for SPA applications, and a GitHub Workflow action that can be customized to setup automatic deployments to an AWS S3 bucket sitting on the Cloud Front CDN. See the following files for more info...

```
./vercel.json
./.github/workflows.deploy.yml
```

## Project setup

```
npm install

```

### Compiles and hot-reloads for development

```
npm run dev
# or
npm start
```

### Compiles and minifies for production

```
npm run build
```
