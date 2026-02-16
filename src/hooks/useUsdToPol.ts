import { useState, useEffect } from 'react';

export const useUsdToPolConverter = () => {
  const [pol, setPol] = useState<number>(0);

  useEffect(() => {
    async function getUSDToPOL() {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd');
        const data = await res.json();

        const price = data['matic-network'].usd;

        setPol(price);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error getting USD to POL conversion rate:', error);
      }
    }

    getUSDToPOL();
  }, []);

  const convertUsdToPol = (usdAmount: number): number => {
    if (!pol || pol <= 0) return 0;

    return parseFloat((usdAmount / pol).toFixed(2));
  };

  return {
    pol,
    convertUsdToPol,
  };
};
