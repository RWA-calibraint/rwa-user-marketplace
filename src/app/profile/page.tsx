'use client';

import { Card, Col, Form, Row } from 'antd';
import Cookies from 'js-cookie';
import { Home, MapPin, ShieldCheck, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { Menu } from '@/components/menu';
import './styles.scss';
import EmptyState from '@/components/profile/emptyState';
import { KYC_STATUS } from '@/helpers/constants/user-status';
import { useUserListener } from '@/hooks/useUserListener';
import { useGetUserRewardsQuery, useUpdateUserMutation } from '@/redux/apis/user.api';
import Address from '@components/profile/address';
import { UserDetails } from '@components/profile/interface';
import ProfileDetails from '@components/profile/profile';
import Rewards from '@components/profile/rewards';
import { useToast } from '@helpers/notifications/toast.notification';
import useMediaQuery from '@hooks/useMediaQuery';

const availableMenu = (key: string) => {
  const menu = [
    { key: 'profile', label: 'Profile' },
    { key: 'address', label: 'Address' },
    { key: 'rewards', label: 'Rewards' },
    { key: 'kyc', label: 'KYC' },
  ];

  return menu.find((menuItem) => menuItem.key === key) ?? menu[0];
};

const Profile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showErrorToast, showSuccessToast } = useToast();
  const search = searchParams.get('target');
  const kycVerification = JSON.parse(searchParams.get('verification') ? 'true' : 'false');
  const isMobile = useMediaQuery('mobile');

  const userData = useUserListener(kycVerification);
  const [menu, setMenu] = useState(availableMenu(search ?? 'Account'));
  const [form] = Form.useForm();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const { data: rewardsList } = useGetUserRewardsQuery({});

  const [userDetails, setUserDetails] = useState<UserDetails>();
  const [isClient, setIsClient] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState<boolean>(false);
  const [hasAddress, setHasAddress] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [kycStatus, setKycStatus] = useState<string | undefined>('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (kycVerification) {
      window.dispatchEvent(new Event('userAdded'));
    }
  }, [isClient, kycVerification]);

  useEffect(() => {
    if (isClient) {
      setUserDetails(userData);
      setHasAddress(!!(userData?.address && userData?.city && userData?.country));
    }
  }, [isClient, userData]);

  useEffect(() => {
    if (userData?.kycVerificationStatus === 'completed') {
      setKycStatus(KYC_STATUS.VERIFIED);
    } else if (userData?.kycVerificationStatus === 'review') {
      setKycStatus(KYC_STATUS.RESUBMIT);
    } else {
      setKycStatus(KYC_STATUS.PENDING);
    }
  }, [userData]);

  useEffect(() => {
    form.setFieldsValue({
      firstName: userDetails?.firstName,
      lastName: userDetails?.lastName,
      email: userDetails?.email,
      password: userDetails?.password,
      phoneNumber: userDetails?.phoneNumber,
      address: userDetails?.address,
      country: userDetails?.country,
      state: userDetails?.state,
      city: userDetails?.city,
      postalCode: userDetails?.postalCode,
    });
  }, [form, userDetails]);

  const handleMenu = (e: { key: string }) => {
    setMenu(availableMenu(e.key));
    router.replace(`/profile?target=${e.key}`);

    if (e.key === 'address') {
      setShowAddressForm(false);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (menu.key === 'profile') {
        const userDetail = await updateUser({
          updatedData: {
            firstName: values.firstName,
            lastName: values.lastName,
          },
          file: imageFile,
          update_type: 'update_profile',
        });

        Cookies.set('user', JSON.stringify(userDetail?.data?.response ?? {}));
        window.dispatchEvent(new Event('cookieChange'));
        window.dispatchEvent(new Event('userAdded'));
        showSuccessToast('User updated successfully');
      } else {
        const payload = {
          address: values.address,
          country: values.country,
          state: values.state,
          city: values.city,
          postalCode: values.postalCode,
        };
        const userDetail = await updateUser({ updatedData: payload, update_type: 'update_profile' });

        Cookies.set('user', JSON.stringify(userDetail?.data?.response ?? {}));
        showSuccessToast('User address updated successfully');
        setHasAddress(true);
      }
    } catch (error) {
      showErrorToast(error, 'Failed to Update User');
    }
  };

  const handleAddNewAddress = () => {
    setShowAddressForm(true);
  };

  const handleInitiateKyc = () => {
    window.dispatchEvent(new Event('openKycPopup'));
  };

  return (
    <div
      className={`bg-secondary d-flex align-center justify-center overflow-x-hidden ${isMobile ? '' : ' p-x-80 p-y-32'}`}
    >
      <div className="xl d-flex flex-column gap-6 width-100">
        <Row gutter={40} className="d-flex gap-10 width-100 justify-space-between m-0">
          <Col span={isMobile ? 30 : 5} className={`${isMobile ? 'width-100' : 'width-20 '} p-0`}>
            <Menu
              items={[
                {
                  key: 'menu',
                  label: 'MENU',
                  type: 'group',
                  children: [
                    {
                      icon: <User className="h-20 w-20 icon-2-primary" />,
                      key: 'profile',
                      label: 'Profile',
                    },
                    {
                      icon: <MapPin className="h-20 w-20 icon-2-primary" />,
                      key: 'address',
                      label: 'Address',
                    },
                    {
                      icon: (
                        <Image
                          src={`${menu.key === 'rewards' ? '/icons/flash-circle.svg' : '/icons/flash-circle-black.svg'}`}
                          width={24}
                          height={24}
                          alt="rewards-icon"
                          className="h-20 w-20 icon-2-primary"
                        />
                      ),
                      key: 'rewards',
                      label: 'Rewards',
                    },
                    {
                      icon: <ShieldCheck className="h-20 w-20 icon-2-primary" />,
                      key: 'kyc',
                      label: (
                        <div className="d-flex align-center justify-space-between">
                          <span>KYC</span>
                          {kycStatus !== KYC_STATUS.VERIFIED && (
                            <span className="f-10-12-500-warning-secondary bg-warning p-x-8 p-y-4 m-l-2">
                              {kycStatus}
                            </span>
                          )}
                        </div>
                      ),
                    },
                  ],
                },
              ]}
              onClick={handleMenu}
              defaultSelectedKeys={menu.key}
            />
          </Col>

          <Col span={isMobile ? 30 : 18} className={`${isMobile ? 'width-100' : 'm-b-0 width-70'} p-0`}>
            <Card className="p-28 custom-card d-flex flex-column">
              <h1 className="f-18-30-600-primary m-b-32">{menu.label}</h1>
              <Form form={form} layout="vertical" className="overflow-y-scroll">
                {menu.key === 'profile' ? (
                  <ProfileDetails
                    isLoading={isLoading}
                    handleSave={handleSave}
                    userDetails={userDetails as UserDetails}
                    setImageFile={setImageFile}
                    imageFile={imageFile}
                  />
                ) : menu.key === 'address' ? (
                  (hasAddress || showAddressForm) === true ? (
                    <Address
                      form={form}
                      isLoading={isLoading}
                      handleSave={handleSave}
                      userDetails={userDetails as UserDetails}
                    />
                  ) : (
                    <EmptyState
                      title="No Address Yet"
                      subtitle="Add your address to make purchases easier"
                      buttonText="Add New Address"
                      onButtonClick={handleAddNewAddress}
                      hasPlus={true}
                      icon={<Home className="icon-2-brand bg-hold-secondary d-flex align-center" />}
                    />
                  )
                ) : menu.key === 'rewards' ? (
                  Array.isArray(rewardsList?.response) && rewardsList?.response?.length > 0 ? (
                    <Rewards rewardList={rewardsList?.response} />
                  ) : (
                    <EmptyState
                      title="No Rewards Yet"
                      subtitle="Start earning rewards by purchasing rare assets on the marketplace."
                      buttonText="Explore Marketplace"
                      onButtonClick={() => router.push('/')}
                      hasPlus={false}
                      icon={
                        <Image
                          src="/icons/flash-circle.svg"
                          width={24}
                          height={24}
                          alt="rewards-icon"
                          className="icon-2-brand bg-hold-secondary d-flex align-center"
                        />
                      }
                    />
                  )
                ) : kycStatus === KYC_STATUS.VERIFIED ? (
                  <div className="d-flex flex-column align-center justify-center p-y-32">
                    <ShieldCheck size={48} color="#52c41a" />
                    <h3 className="f-17-18-600-secondary m-t-16">KYC Verified</h3>
                    <p className="f-13-20-400-secondary m-t-8">Your identity has been verified successfully.</p>
                  </div>
                ) : (
                  <EmptyState
                    title={kycStatus === KYC_STATUS.RESUBMIT ? 'KYC needs resubmission' : 'KYC is incomplete'}
                    subtitle="It is necessary to complete KYC Verification before you can purchase or sell assets in RareAgora Marketplace."
                    buttonText={kycStatus === KYC_STATUS.RESUBMIT ? 'Resubmit KYC' : 'Complete KYC'}
                    onButtonClick={() => handleInitiateKyc()}
                    hasPlus={false}
                    icon={
                      <Image
                        src="/icons/id-card.svg"
                        width={24}
                        height={24}
                        alt="rewards-icon"
                        className="icon-2-brand bg-hold-secondary d-flex align-center"
                      />
                    }
                  />
                )}
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default function ProfileBoundary() {
  return (
    <Suspense>
      <Profile />
    </Suspense>
  );
}
