const assetDataValidator = (
  propValue,
  key,
  componentName,
  location,
  propFullName
) => {
  if (typeof propValue !== 'string') {
    throw new Error(`${componentName}: incorrect prop ${propFullName}`);
  }

  if (!/^(0x)?[a-fA-F0-9]{40,}$/.test(propValue)) {
    throw new Error(`${componentName}: incorrect prop ${propFullName}`);
  }
};

export const assetDataProp = (
  propValue,
  key,
  componentName,
  location,
  propFullName
) => {
  if (propValue !== null && propValue !== undefined) {
    assetDataValidator(propValue, key, componentName, location, propFullName);
  }
};

assetDataProp.isRequired = assetDataValidator;
