import { tattooBodyLocations } from '@/modules/tattooBodyLocations';
import { tattooSize } from '@/modules/tattooSize';
import { tattooStyle } from '@/modules/tattooStyle';
import { tattooHealing } from '@/modules/tattooHealing';

import { ref, onMounted, computed } from 'vue';

const painThresholds = [
  {
    id: 1,
    name: 'Low Pain',
    low: 1,
    high: 10
  },
  {
    id: 2,
    name: 'Medium Pain',
    low: 11,
    high: 15
  },
  {
    id: 3,
    name: 'High Pain',
    low: 16,
    high: 20
  },
  {
    id: 4,
    name: 'Very Spicy Pain',
    low: 21,
    high: 25
  },

]

export function usePainEstimator() {

  onMounted(async () => { });

  function calculatePainEstimate(styleId, locationId, sizeId, sessionHours, healingTypeId, isMale) {
    const bodyLocationPoints = isMale ? getBodyLocationPainPointsMale(locationId) : getBodyLocationPainPointsFemale(locationId);
    const painNumber = parseInt(styleId) + parseInt(sizeId) + parseInt(sessionHours) + parseInt(healingTypeId) + bodyLocationPoints;

    if (isNaN(painNumber)) {
      return '-';
    }

    const painLevel = painThresholds.find((item) =>
      painNumber <= item.high && painNumber >= item.low
    );
    return painLevel?.name;
  }

  function sumPainPoints(styleId, locationId, sizeId, sessionHours, healingTypeId, isMale) {
    const bodyLocationPoints = isMale ? getBodyLocationPainPointsMale(locationId) : getBodyLocationPainPointsFemale(locationId);
    const returnValue = parseInt(styleId) + parseInt(sizeId) + parseInt(sessionHours) + parseInt(healingTypeId) + bodyLocationPoints;
    if (isNaN(returnValue)) {
      return '-';
    }

    return returnValue;
  }

  function getBodyLocationPainPointsMale(bodyLocationId) {
    const foundLocation = Object.values(tattooBodyLocations).find(
      (item) => item.id === parseInt(bodyLocationId)
    );

    return parseInt(foundLocation?.painLevelMale || 0);
  }

  function getBodyLocationPainPointsFemale(bodyLocationId) {
    const foundLocation = Object.values(tattooBodyLocations).find(
      (item) => item.id === parseInt(bodyLocationId)
    );

    return parseInt(foundLocation?.painLevelFemale || 0);
  }

  function getBodyLocationById(bodyLocationId) {
    const foundLocation = Object.values(tattooBodyLocations).find(
      (item) => item.id === parseInt(bodyLocationId)
    );

    return foundLocation?.name || 'N/A';
  }

  function getSizeById(sizeId) {
    const foundLocation = Object.values(tattooSize).find(
      (item) => item.id === parseInt(sizeId)
    );

    return foundLocation?.name || 'N/A';
  }

  function getHealingById(healingTypeId) {
    const foundLocation = Object.values(tattooHealing).find(
      (item) => item.id === parseInt(healingTypeId)
    );

    return foundLocation?.name || 'N/A';
  }


  return {
    calculatePainEstimate,
    sumPainPoints,
    getBodyLocationById,
    getBodyLocationPainPointsMale,
    getBodyLocationPainPointsFemale,
    getSizeById,
    getHealingById
  };
}
