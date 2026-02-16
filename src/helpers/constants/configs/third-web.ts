import { createThirdwebClient } from 'thirdweb';
import { createWallet, inAppWallet, Wallet, WalletId } from 'thirdweb/wallets';

import { ENV_CONFIGS } from '@helpers/constants/configs/env-vars';

export const IN_APP_WALLET_AUTH_OPTIONS = ['email'];

export const WALLET_IDS = ['io.metamask', 'com.coinbase.wallet', 'com.trustwallet.app', 'app.core.extension'];

//Need to check with person who added this for this thirdwebclient and then need to remove it
// export const thirdwebClient = () => {
//   try {
//     return createThirdwebClient({
//       clientId: ENV_CONFIGS.thirdWebClientId as string,
//     });
//   } catch (error) {
//     if (error instanceof Error) throw new Error(error.message);
//   }
// };

export const thirdwebClient = createThirdwebClient({
  clientId: ENV_CONFIGS.THIRD_WEB_CLIENT_ID as string,
});

export const getThirdWebWallets = (): Wallet[] => {
  return [
    inAppWallet({
      auth: {
        options: IN_APP_WALLET_AUTH_OPTIONS as (
          | 'google'
          | 'apple'
          | 'facebook'
          | 'discord'
          | 'line'
          | 'farcaster'
          | 'telegram'
          | 'email'
          | 'phone'
          | 'passkey'
          | 'x'
        )[],
      },
    }),
    ...WALLET_IDS.map((walletId) => createWallet(walletId as WalletId)),
  ];
};
