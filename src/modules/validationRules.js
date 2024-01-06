export const validationRules = {
  required: (v) => !!v || v === 0 || 'Required',
  textMin: (v, min) => !v || v.length >= min || min + ' Characters Min.',
  textMax: (v, max) => !v || v.length <= max || max + ' Characters Max.',
  integer: (v) => !v || Number.isInteger(parseFloat(v)) || 'Integers Only',
  intMin: (v, min) => !v || v >= min || min + ' Min.',
  intMax: (v, max) => !v || v <= max || max + ' Max.',
  email: (v) => !v || /.+@.+\..+/.test(v) || 'E-mail must be valid',
  url: (v) => !v || isUrl(v) || 'Valid URLs only',
  httpsUrl: (v) => !v || isHttpsUrl(v) || 'HTTPS URLs only',
  ethereumPrivateKey: (v) =>
    !v || /^0x([A-Fa-f0-9]{40})$/.test(v) || 'Ethereum Address is invalid',
  ethereumContractAddress: (v) =>
    !v || /^0x([A-Fa-f0-9]{40})$/.test(v) || 'Contract Address is invalid',
  array: (v) => !v || Array.isArray(v) || 'Value must be an array',
};

function isUrl(str) {
  let url;

  try {
    url = new URL(str);
  } catch (ex) {
    return false;
  }

  return url.protocol === 'https:' || url.protocol === 'http:';
}

function isHttpsUrl(str) {
  let url;

  try {
    url = new URL(str);
  } catch (ex) {
    return false;
  }

  return url.protocol === 'https:';
}
