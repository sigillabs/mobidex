const styleValidator = (
  propValue,
  key,
  componentName,
  location,
  propFullName
) => {
  if (Array.isArray(propValue)) {
    propValue.map((value, index) =>
      styleValidator(value, index, componentName, location, propFullName)
    );
  }

  if (propValue !== null && typeof propValue !== 'object') {
    throw new Error(`${componentName}: incorrect prop ${propFullName}`);
  }
};

export const styleProp = styleValidator;
