# Vuetify NFT Gallery
This is a Web Front-End written with [Vue 3](https://vuejs.org/guide/introduction.html) and [Vuetify](https://dev.vuetifyjs.com/en/introduction/why-vuetify/#what-is-vuetify3f) in pure JavaScript. This demo shows you how to implement the [vue-evm-nft](https://github.com/Dig-A-Hash/vue-evm-nft/tree/main) package to display NFTs in the web browser, directly from the blockchain. No API needed, no wallet needed.

![](https://i.imgur.com/QVlMJcM.jpg)

There are several re-usable resources included like [Pinia](https://pinia.vuejs.org/introduction.html) stores, [components](https://vuejs.org/guide/components/registration.html), and [composables](https://vuejs.org/guide/extras/composition-api-faq.html) that can be used to call any EVM based blockchain for NFTs using [Ethers.js](https://github.com/ethers-io/ethers.js). Even a 404 route built-in using the [Vue Router](https://router.vuejs.org/guide/).

You can see examples of how it works on the following websites where this project is in production use...

https://www.thistleandthorntattoo.net/

https://www.urbanhomesteadx.com/

https://www.dog-plex.com/

https://www.pour-house-studios.com/

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
Install the latest version of [Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs), then clone this project and run...
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
