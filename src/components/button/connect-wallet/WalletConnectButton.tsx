import Cookies from 'js-cookie';
import { Copy, LogOut, Wallet } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
  useConnectModal,
  useDisconnect,
  useWalletDetailsModal,
  WalletIcon,
  WalletName,
  WalletProvider,
} from 'thirdweb/react';
import { Account } from 'thirdweb/wallets';

import { ERROR_MESSAGE } from '@/helpers/constants/error-message';
import { handleContractCall } from '@/helpers/services/blockchain.service';
import { useCookieListener } from '@/hooks/useCookieListener';
import { useUserListener } from '@/hooks/useUserListener';
import {
  useLazyGetUserDetailsQuery,
  useUpdateWalletAddressMutation,
  useVerifyCryptoAddressMutation,
} from '@/redux/apis/user.api';
import { ErrorResponse } from '@/redux/utils/interfaces/user.interface';
import DropdownComponent from '@components/drop-down/drop-down';
import { getThirdWebWallets, thirdwebClient } from '@helpers/constants/configs/third-web';
import { useToast } from '@helpers/notifications/toast.notification';
import useMediaQuery from '@hooks/useMediaQuery';

const WalletConnectButton = () => {
  const isTokenAdded = useCookieListener();
  const detailsModal = useWalletDetailsModal();
  const { showSuccessToast, showErrorToast } = useToast();
  const user = useUserListener();
  const isMobileView = useMediaQuery('mobile');
  const account: Account | undefined = useActiveAccount();
  const activeWallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  const { connect } = useConnectModal();
  const [updateWalletAddress] = useUpdateWalletAddressMutation();
  const [verifyCryptoAddress, { isLoading: isVerifying }] = useVerifyCryptoAddressMutation();
  const [getUserDetail] = useLazyGetUserDetailsQuery();
  const [loading, setLoading] = useState<boolean>(false);

  const shortenAddress = (address: string) => {
    if (!address) return '';
    const start = address.slice(0, 8);
    const end = address.slice(-6);

    return `${start}...${end}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(account?.address || '');
    showSuccessToast('Copied');
  };

  const handleActiveAccountChanges = useCallback(async () => {
    if (account) {
      const payload = {
        walletAddress: account.address,
      };

      try {
        await updateWalletAddress(payload).unwrap();
        const walletTransactionSuccess = await handleContractCall(account, showErrorToast, showSuccessToast);

        if (!walletTransactionSuccess) {
          setLoading(false);

          return;
        }
      } catch (error: unknown) {
        if ((error as ErrorResponse).status === 409) {
          showErrorToast(new Error(ERROR_MESSAGE.WALLET_ALREADY_USED), ERROR_MESSAGE.WALLET_ALREADY_USED);
          await new Promise((res) => setTimeout(res, 2000));
          detailsModal.open({
            connectOptions: { connectModal: { size: 'compact', title: 'Connect Wallet', showThirdwebBranding: false } },
            client: thirdwebClient,
            theme: 'light',
            onClose: () => {
              if (activeWallet) disconnect(activeWallet);
            },
          });
        } else {
          showErrorToast(error, ERROR_MESSAGE.DEFAULT);
        }
      }
      if (!user.kytServiceRequest) {
        await verifyCryptoAddress(payload);
        const userDetail = await getUserDetail({}).unwrap();

        Cookies.set('user', JSON.stringify(userDetail?.response ?? {}));
        window.dispatchEvent(new Event('userAdded'));
      }
    }
  }, [account, updateWalletAddress]);

  useEffect(() => {
    handleActiveAccountChanges();
  }, [handleActiveAccountChanges]);

  async function handleConnect() {
    if (isTokenAdded)
      await connect({
        client: thirdwebClient,
        size: 'compact',
        title: 'Connect Wallet',
        showThirdwebBranding: false,
        theme: 'light',
        wallets: getThirdWebWallets(),
      });
    else showErrorToast(new Error(ERROR_MESSAGE.LOGIN_REQUIRED), ERROR_MESSAGE.LOGIN_REQUIRED);
  }
  const handleDisconnect = () => {
    if (activeWallet) {
      disconnect(activeWallet);
    }
  };

  function handleClick() {
    detailsModal.open({
      connectOptions: { connectModal: { size: 'compact', title: 'Connect Wallet', showThirdwebBranding: false } },
      client: thirdwebClient,
      theme: 'light',
    });
  }

  useEffect(() => {
    if (!isTokenAdded && activeWallet) {
      disconnect(activeWallet);
    }
  }, [activeWallet, disconnect, isTokenAdded]);

  return (
    <div>
      {account ? (
        <div>
          <DropdownComponent
            menuItems={[
              {
                label: (
                  <div className="d-flex align-center gap-2">
                    <div
                      style={{ background: 'linear-gradient(to bottom, #863BE9, #4E01B3)' }}
                      className="radius-100 h-36 w-36 "
                    >
                      <WalletProvider id={activeWallet?.id ?? 'io.metamask'}>
                        <div className="position-absolute bottom-5 left-25 bg-white p-4 radius-100 h-20 w-20 d-flex align-center justify-center border-primary-1">
                          <WalletIcon style={{ height: '10px', width: '10px' }} className="radius-100" />
                        </div>
                      </WalletProvider>
                    </div>
                    <div className="d-flex flex-column">
                      <div className="d-flex align-center gap-2">
                        <p className="f-14-16-400-primary">{shortenAddress(account.address)}</p>
                        <Copy size={16} onClick={copyToClipboard} className="cursor-pointer" />
                      </div>
                      <p className="f-12-16-400-tertiary">
                        <WalletProvider id={activeWallet?.id ?? 'io.metamask'}>
                          <WalletName />
                        </WalletProvider>
                      </p>
                    </div>
                  </div>
                ),
                key: 'wallet-address',
              },
              { label: 'Manage wallet', key: 'manage-wallet', icon: <Wallet size={16} /> },
              { type: 'divider' },
              {
                label: 'Disconnect wallet',
                key: 'disconnect-wallet',
                icon: <LogOut size={16} />,
              },
            ]}
            label={
              !isMobileView ? (
                <button className="d-flex align-center gap-2 p-10 cursor-pointer radius-360 bg-white border-primary-1">
                  <Wallet size={20} className="icon-20-wallet cursor-pointer" />
                  <span className="f-15-16-500-secondary">{shortenAddress(account.address)}</span>
                </button>
              ) : (
                <Wallet size={20} className="icon-20-wallet cursor-pointer" />
              )
            }
            handleClick={(params) => {
              if (params.key === 'disconnect-wallet') {
                handleDisconnect();
              } else if (params.key === 'manage-wallet') {
                handleConnect();
              } else {
                handleClick();
              }
            }}
            triggerAction={['click']}
            dropdownPlacement="bottomRight"
          />
        </div>
      ) : (
        <ConnectButton
          client={thirdwebClient}
          connectButton={{
            label: !isMobileView ? (
              <div className="p-y-10 p-x-14 d-flex align-center gap-2 bg-brand-color h-44 radius-360 cursor-pointer">
                <Wallet size={20} className="icon-20-white cursor-pointer" />
                <span className="f-15-16-500-logo">Connect Wallet</span>
              </div>
            ) : (
              <div className="p-y-10">
                <Wallet size={20} className="icon-20-wallet cursor-pointer" />
              </div>
            ),
            className: 'min-w-40 max-w-165 bg-white p-0',
          }}
          wallets={getThirdWebWallets()}
          theme="light"
          connectModal={{
            size: 'compact',
            title: 'Connect Wallet',
            showThirdwebBranding: false,
          }}
        />
      )}
    </div>
  );
};

export default WalletConnectButton;
