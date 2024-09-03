export default function useSmartContractWallets() {
  function shortHash(val: string) {
    if (!val || val.length <= 10) {
      return val;
    }
    return `${val.slice(0, 6)}...${val.slice(-4)}`;
  }

  function validate(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] === null || obj[key] === '') {
          return false; // Fail validation
        }
      }
    }
    return true;
  }

  return { shortHash, validate };
}
