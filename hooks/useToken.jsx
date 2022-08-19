const useStorage = () => {
  const storageType = (type = null) => `${type ?? 'session'}Storage`;

  const isBrowser = (() => typeof window !== 'undefined')();

  const getItem = (key, type = null) => {
    return isBrowser ? window[storageType(type)][key] : '';
  };

  const setItem = (key, value, type = null) => {
    if (isBrowser) {
      window[storageType(type)].setItem(key, value);
      return true;
    }

    return false;
  };

  const removeItem = (key, type = null) => {
    window[storageType(type)].removeItem(key);
  };

  return {
    getItem,
    setItem,
    removeItem,
  };
};

export default useStorage;