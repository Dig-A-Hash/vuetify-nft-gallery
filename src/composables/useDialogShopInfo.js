// useShopInfo.js
import { ref } from 'vue';

export function useDialogShopInfo() {
  const isShopInfoShowing = ref(false);

  function toggleIsShopInfoShowing() {
    isShopInfoShowing.value = !isShopInfoShowing.value;
  }

  return {
    isShopInfoShowing,
    toggleIsShopInfoShowing,
  };
}
