const getActiveTabDatasetValue = (tabs, dataKey, defaultValue) => {
  const activeButton = tabs.querySelector('.tabs__control.is-active');

  return activeButton?.dataset[dataKey] ?? defaultValue;
}


const getItemsByType = (profiles, type, onlyVerified = false) => {
  const group = profiles[type];

  if (!group) {
    console.warn('Unknown type:', type);
    return [];
  }

  return onlyVerified ? group.verified : group.all;
};

export {
  getActiveTabDatasetValue,
  getItemsByType
}
