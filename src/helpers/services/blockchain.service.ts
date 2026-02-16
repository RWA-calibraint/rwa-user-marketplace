import { SetStateAction } from 'react';
import {
  createThirdwebClient,
  getContract,
  prepareContractCall,
  readContract,
  resolveMethod,
  sendTransaction,
  waitForReceipt,
} from 'thirdweb';
import { polygonAmoy } from 'thirdweb/chains';
import { Account, getWalletBalance } from 'thirdweb/wallets';

import { AssetData } from '@/components/asset-details/interface';

import marketplaceAbi from '../../helpers/abis/RareAgoraMarketplace.json';
import RwaTokenAbi from '../abis/RWAToken.json';
import { ENV_CONFIGS } from '../constants/configs/env-vars';
import { PAYMENT_STATUS } from '../constants/constants';
import { ERROR_MESSAGE } from '../constants/error-message';
import { SUCCESS_MESSAGES } from '../constants/success.message';

interface buyCryptoInterface {
  assetData: AssetData;
  isPaymentModalOpen?: boolean;
  setIsPaymentModalOpen: React.Dispatch<SetStateAction<boolean>>;
  paymentStatus?: PAYMENT_STATUS | null;
  setPaymentStatus: React.Dispatch<SetStateAction<PAYMENT_STATUS | null>>;
  activeAccount: Account | undefined;
  assetRefetch: (() => Promise<unknown>) | undefined;
  buyTokens: number;
  selectedListingId: string;
  showErrorToast: (error1: string, error2: string) => void;
  showSuccessToast: (message: string) => void;
  setOpenMoonpayModal: React.Dispatch<SetStateAction<boolean>>;
  setOpenCryptoToFiatModal: React.Dispatch<SetStateAction<boolean>>;
}
interface cryptoListingInterface {
  assetData: AssetData;
  activeAccount: Account | undefined;
  tokens: number;
  price: number;
  selectedListingId: string;
  showErrorToast: (message: unknown, fallback: string) => void;
  showSuccessToast: (message: string) => void;
}

const client = createThirdwebClient({
  clientId: ENV_CONFIGS.THIRD_WEB_CLIENT_ID,
});

const marketplaceAddress = ENV_CONFIGS.MARKETPLACE_PROXY as `0x${string}`;

const marketplacecontract = getContract({
  address: marketplaceAddress,
  chain: polygonAmoy,
  client,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abi: marketplaceAbi as any,
});

const RWAToken = ENV_CONFIGS.RWA_TOKEN_CONTRACT_ADDRESS as `0x${string}`;

export const handleBuyWithCrypto = async (buyCryptoData: buyCryptoInterface) => {
  const {
    assetData: { tokens, price, listingId, ContractListingId, sellerId, initialSeller },
    activeAccount,
    setIsPaymentModalOpen,
    setPaymentStatus,
    assetRefetch,
    buyTokens,
    selectedListingId,
    showErrorToast,
    showSuccessToast,
    setOpenMoonpayModal,
    setOpenCryptoToFiatModal,
  } = buyCryptoData;

  const usdtAddress = ENV_CONFIGS.USDT_ADDRESS as `0x${string}`;
  const marketplaceAddress = ENV_CONFIGS.MARKETPLACE_PROXY as `0x${string}`;

  const client = createThirdwebClient({
    clientId: ENV_CONFIGS.THIRD_WEB_CLIENT_ID,
  });

  if (!activeAccount) {
    showErrorToast(ERROR_MESSAGE.WALLET_NOT_CONNECTED, ERROR_MESSAGE.DEFAULT);

    return;
  }
  if (!usdtAddress || !marketplaceAddress) {
    showErrorToast(ERROR_MESSAGE.BUY_TOKEN_FAILED, 'Invalid contract addresses.');

    return;
  }

  const pricePerToken = Math.round((price / tokens) * 10 ** 6);

  const marketplaceFee = 500;

  const totalPrice = buyTokens * Number(pricePerToken);

  const feeAmount = Math.round((totalPrice * marketplaceFee) / 10000);

  const usdtAmount = totalPrice + feeAmount;

  // check if seller have wallet address
  if (!sellerId?.walletAddress) {
    return setOpenCryptoToFiatModal(true);
  }

  try {
    // Use assetData.listingId directly since it's the blockchain listing ID
    const effectiveListingId = ContractListingId;

    if (!effectiveListingId || !/^\d+$/.test(effectiveListingId)) {
      showErrorToast(ERROR_MESSAGE.BUY_TOKEN_FAILED, 'Invalid listing ID.');

      return;
    }

    const usdt = getContract({
      address: usdtAddress,
      chain: polygonAmoy,
      client,
    });

    try {
      const usdtBalance = await readContract({
        contract: usdt,
        method: resolveMethod('balanceOf'),
        params: [activeAccount.address],
      });

      const userBalance = BigInt(usdtBalance as unknown as string);

      if (userBalance < BigInt(usdtAmount)) {
        setOpenMoonpayModal(true);

        return;
      }
    } catch (error) {
      showErrorToast('Failed to check USDC balance.', ERROR_MESSAGE.DEFAULT);

      return;
    }

    const allowance = await readContract({
      contract: usdt,
      method: resolveMethod('allowance'),
      params: [activeAccount.address, marketplaceAddress],
    });

    const allowanceValue = allowance as unknown as bigint;

    // Check if allowance is less than required amount
    if (allowanceValue < BigInt(usdtAmount)) {
      const approveTx = await prepareContractCall({
        contract: usdt,
        method: resolveMethod('approve'),
        params: [marketplaceAddress, usdtAmount],
      });

      const approveResult = await sendTransaction({
        transaction: approveTx,
        account: activeAccount,
      });

      await waitForReceipt(approveResult);
      showSuccessToast(SUCCESS_MESSAGES.APPROVAL_MESSAGE);
    } else {
    }
    const marketplacecontract = getContract({
      address: marketplaceAddress,
      chain: polygonAmoy,
      client,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      abi: marketplaceAbi as any,
    });

    function safeBigInt(value: string | number | undefined): bigint {
      if (value === undefined) {
        throw new Error('Cannot convert undefined to BigInt');
      }

      return BigInt(value);
    }
    const purchaseTx = await prepareContractCall({
      contract: marketplacecontract,
      method: {
        type: 'function',
        name: 'purchase',
        inputs: [
          {
            name: 'listingId',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'seller',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'amount',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'usdcAmount',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'assetListingId',
            type: 'string',
            internalType: 'string',
          },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },

      params: [
        safeBigInt(ContractListingId),
        initialSeller,
        safeBigInt(buyTokens),
        safeBigInt(usdtAmount),
        selectedListingId,
      ],
    });

    try {
      const purchaseTransaction = await sendTransaction({
        transaction: purchaseTx,
        account: activeAccount,
      });

      await waitForReceipt(purchaseTransaction);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.code === 4001 || error.message.includes('User rejected') || error.message.includes('User denied')) {
        showErrorToast('Failed to Buy Token.', ERROR_MESSAGE.USER_DENIED_FAILED);
      } else {
        showErrorToast('Failed to Buy Token.', ERROR_MESSAGE.USER_DENIED_FAILED);
      }
      throw error;
    }

    // Show success
    showSuccessToast(SUCCESS_MESSAGES.TOKEN_PURCHASED);
    setPaymentStatus(PAYMENT_STATUS.SUCCESS);
    setIsPaymentModalOpen(true);
    if (assetRefetch) assetRefetch();
  } catch (error) {
    setPaymentStatus(PAYMENT_STATUS.FAILURE);
    setIsPaymentModalOpen(true);
  }
};

export const handleListCrypto = async (listingData: cryptoListingInterface) => {
  const { activeAccount, assetData, price, tokens, selectedListingId, showErrorToast, showSuccessToast } = listingData;

  try {
    // const { activeAccount, assetData, price, tokens } = listingData;
    function safeBigInt(value: string | number | undefined): bigint {
      if (value === undefined) {
        throw new Error('Cannot convert undefined to BigInt');
      }

      return BigInt(value);
    }
    if (!activeAccount) {
      showErrorToast(ERROR_MESSAGE.WALLET_NOT_CONNECTED, ERROR_MESSAGE.DEFAULT);

      return;
    }

    await handleContractCall(activeAccount, showErrorToast, showSuccessToast);
    let getListing;

    try {
      getListing = (await readContract({
        contract: marketplacecontract,
        method: {
          type: 'function',
          name: 'getListing',
          inputs: [
            {
              name: 'listingId',
              type: 'uint256',
              internalType: 'uint256',
            },
          ],
          outputs: [
            {
              name: '',
              type: 'tuple',
              internalType: 'struct MarketplaceManagement.ListingView',
              components: [
                {
                  name: 'listingType',
                  type: 'uint8',
                  internalType: 'enum MarketplaceManagement.ListingType',
                },
                {
                  name: 'collectionId',
                  type: 'bytes32',
                  internalType: 'bytes32',
                },
                {
                  name: 'tokenContract',
                  type: 'address',
                  internalType: 'address',
                },
                {
                  name: 'tokenId',
                  type: 'uint256',
                  internalType: 'uint256',
                },
                {
                  name: 'assetId',
                  type: 'bytes32',
                  internalType: 'bytes32',
                },
                {
                  name: 'physicalId',
                  type: 'bytes32',
                  internalType: 'bytes32',
                },
                {
                  name: 'totalAmount',
                  type: 'uint256',
                  internalType: 'uint256',
                },
                {
                  name: 'isActive',
                  type: 'bool',
                  internalType: 'bool',
                },
              ],
            },
          ],
          stateMutability: 'view',
        },
        params: [BigInt(Number(assetData.ContractListingId))],
      })) as {
        listingType: number;
        collectionId: `0x${string}`;
        tokenContract: string;
        tokenId: bigint;
        assetId: `0x${string}`;
        physicalId: `0x${string}`;
        totalAmount: bigint;
        isActive: boolean;
      };
    } catch (error) {
      getListing = null; // or handle the fallback logic accordingly
    }

    if (!getListing) {
      console.error('Listing not found or failed to fetch.');

      return; // or handle fallback logic here
    }

    // Extract tokenId and collectionId
    const tokenId = getListing.tokenId; // bigint
    const collectionId = getListing.collectionId;
    const pricePerToken = Math.round((price / tokens) * 10 ** 6);

    // Validate extracted fields
    if (tokenId === undefined || tokenId < 0) {
      throw new Error('Invalid tokenId');
    }
    if (!collectionId || !/^0x[0-9a-fA-F]{64}$/.test(collectionId)) {
      throw new Error('Invalid collectionId');
    }

    if (assetData.ContractListingId && assetData.tokenAssetId) {
      const purchaseTx = await prepareContractCall({
        contract: marketplacecontract,
        method: {
          type: 'function',
          name: 'updateListingAsOwner',
          inputs: [
            {
              name: 'listingId',
              type: 'uint256',
              internalType: 'uint256',
            },
            {
              name: 'newAmount',
              type: 'uint256',
              internalType: 'uint256',
            },
            {
              name: 'newPricePerToken',
              type: 'uint256',
              internalType: 'uint256',
            },
            {
              name: 'assetListingId',
              type: 'string',
              internalType: 'string',
            },
          ],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        params: [
          BigInt(Number(assetData.ContractListingId)),
          safeBigInt(tokens),
          safeBigInt(pricePerToken),
          selectedListingId,
        ],
      });

      // Step 5: Execute the contract transaction
      const listtransaction = await sendTransaction({
        transaction: purchaseTx,
        account: activeAccount,
      });

      await waitForReceipt(listtransaction);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.code === 4001) {
      // MetaMask transaction rejected by user
      showErrorToast('Transaction rejected by user.', 'Cancelled');
    } else {
      showErrorToast('Failed to List Token.', ERROR_MESSAGE.LIST_TOKEN_FAILED);
    }
    throw error; // Propagate error to caller
  }
};

export const handleContractCall = async (
  activeAccount: Account,
  showErrorToast: (message: unknown, fallback: string) => void,
  showSuccessToast: (message: string) => void,
) => {
  if (!activeAccount) {
    showErrorToast(ERROR_MESSAGE.WALLET_NOT_CONNECTED, ERROR_MESSAGE.DEFAULT);

    return false;
  }

  try {
    const balance = await getWalletBalance({
      address: activeAccount.address,
      chain: polygonAmoy,
      client,
    });

    const balanceInEth = parseFloat(balance.displayValue);

    if (balanceInEth < 0.001) {
      showErrorToast(ERROR_MESSAGE.INSUFFICIENT_POL_BALANCE, ERROR_MESSAGE.DEFAULT);

      return false;
    }

    const rwaContract = getContract({
      address: RWAToken,
      chain: polygonAmoy,
      client,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      abi: RwaTokenAbi as any,
    });

    const isApproved = (await readContract({
      contract: rwaContract,
      method: {
        type: 'function',
        name: 'isApprovedForAll',
        inputs: [
          { name: 'account', type: 'address', internalType: 'address' },
          { name: 'operator', type: 'address', internalType: 'address' },
        ],
        outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
        stateMutability: 'view',
      },
      params: [activeAccount.address, marketplaceAddress],
    })) as boolean;

    if (isApproved) {
      return true;
    }

    // 👇 Proceed only if not approved
    const approveTx = await prepareContractCall({
      contract: rwaContract,
      method: {
        type: 'function',
        name: 'setApprovalForAll',
        inputs: [
          { name: 'operator', type: 'address', internalType: 'address' },
          { name: 'approved', type: 'bool', internalType: 'bool' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      params: [marketplaceAddress, true],
    });

    const approveResult = await sendTransaction({
      transaction: approveTx,
      account: activeAccount,
    });

    await waitForReceipt(approveResult);

    showSuccessToast('Approval successful');

    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === 4001 || error.message.includes('User rejected') || error.message.includes('User denied')) {
      showErrorToast('Approval Failed', ERROR_MESSAGE.USER_DENIED_FAILED);
    } else {
      showErrorToast('Approval Failed.', ERROR_MESSAGE.USER_DENIED_FAILED);
    }
    throw error;
  }
};
