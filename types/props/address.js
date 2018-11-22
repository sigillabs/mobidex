const addressValidator = (
  propValue,
  key,
  componentName,
  location,
  propFullName
) => {
  const value = key !== null ? propValue[key] : propValue;

  if (typeof value !== 'string') {
    throw new Error(
      `${componentName}: incorrect prop ${propFullName} -- ${JSON.stringify(
        propValue
      )}`
    );
  }

  if (!/^(0x)?[a-fA-F0-9]{40}$/.test(value)) {
    throw new Error(
      `${componentName}: incorrect prop ${propFullName} -- ${JSON.stringify(
        propValue
      )}`
    );
  }
};

export const addressProp = (
  propValue,
  key,
  componentName,
  location,
  propFullName
) => {
  const value = key !== null ? propValue[key] : propValue;

  if (value !== null && value !== undefined) {
    addressValidator(propValue, key, componentName, location, propFullName);
  }
};

addressProp.isRequired = addressValidator;
