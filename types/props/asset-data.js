const assetDataValidator = (
  propValue,
  key,
  componentName,
  location,
  propFullName
) => {
  const value = key !== null ? propValue[key] : propValue;

  if (typeof value !== 'string') {
    throw new Error(`${componentName}: incorrect prop ${propFullName}`);
  }

  if (!/^(0x)?[a-fA-F0-9]{40,}$/.test(value)) {
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
  const value = key !== null ? propValue[key] : propValue;

  if (value !== null && value !== undefined) {
    assetDataValidator(propValue, key, componentName, location, propFullName);
  }
};

assetDataProp.isRequired = assetDataValidator;
