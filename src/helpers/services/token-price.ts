export const calculateTokenPrice = (price: number, tokens: number, toFixed: number) => {
  if (!tokens) {
    return 0;
  }

  return (price / tokens).toFixed(toFixed);
};
