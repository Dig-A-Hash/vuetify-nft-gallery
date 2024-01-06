# Vuetify NFT Gallery

This is a Web Front-End written with Vue 3 and Vuetify. There are several other re-usable resources included like pinia stores, components, and composables that can be used to call any EVM based blockchain for NFTs, even if the browser does not have a wallet installed. See the following files for more info...

```
./src/composables/
./src/store/nft.js
```

This project has a .env file that is setup to work with Dig-A-Hash web services for Dynamic NFT Meta-Data.

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
