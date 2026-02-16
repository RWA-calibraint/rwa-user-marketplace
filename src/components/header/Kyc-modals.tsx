import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';

import KycPopup from '@/components/KYC/kyc-popup';
import StyledModal from '@/components/Modal/Modal';
import { KYC } from '@/helpers/constants/asset-status';
import { useCookieListener } from '@/hooks/useCookieListener';
import { useUserListener } from '@/hooks/useUserListener';
import { useLazyGetUserDetailsQuery, useUpdateUserMutation } from '@/redux/apis/user.api';
import { AddressDataInterface } from '@app/homepage/homepage.interface';

export default function KycModals() {
  const [openKycPopup, setOpenKycPopup] = useState(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [initialStep, setInitialStep] = useState(1);

  const isTokenAdded = useCookieListener();
  const userData = useUserListener();
  const [updateUser] = useUpdateUserMutation();
  const [getUserDetails] = useLazyGetUserDetailsQuery();

  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [addressData, setAddressData] = useState<AddressDataInterface>({
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
  });

  const openKycPopupHandler = () => {
    try {
      const hasUserDetails = userData?.address && userData?.phoneNumber;

      if (!isTokenAdded || !userData || !userData?._id) return;

      // Check if KYC is already completed
      if (userData?.kycVerificationStatus === 'completed') {
        setModalOpen(false);
        setOpenKycPopup(false);

        return;
      }

      // If status is 'review', show the review modal
      if (userData?.kycVerificationStatus === 'review') {
        setModalOpen(true);

        return;
      }

      if (hasUserDetails) {
        // User has details but not verified — go directly to Aadhaar OTP step
        setInitialStep(3);
      } else {
        setInitialStep(1);
      }
      setOpenKycPopup(true);
    } catch (error) {
      console.error('Error opening KYC popup:', error);
      setModalOpen(false);
      setOpenKycPopup(false);
    }
  };

  useEffect(() => {
    if (window.location.pathname === '/') {
      openKycPopupHandler();
    }
  }, [isTokenAdded, userData]);

  useEffect(() => {
    window.addEventListener('openKycPopup', openKycPopupHandler);

    return () => {
      window.removeEventListener('openKycPopup', openKycPopupHandler);
    };
  }, [openKycPopupHandler]);

  const handleExternalVerification = async () => {
    // Save user profile data (phone, DOB, address) before moving to Aadhaar step
    const payload = {
      phoneNumber: phoneNumber,
      dateOfBirth: dateOfBirth,
      address: addressData.address,
      country: addressData.country,
      state: addressData.state,
      city: addressData.city,
      postalCode: addressData.postalCode,
    };

    const userDetail = await updateUser({
      updatedData: payload,
      update_type: 'update_profile',
    }).unwrap();

    const { response: updatedUserData } = userDetail || {};

    Cookies.set('user', JSON.stringify(updatedUserData ?? {}));
    window.dispatchEvent(new Event('cookieChange'));
  };

  const handleAadhaarVerified = async () => {
    const userDetail = await getUserDetails({}).unwrap();
    const refreshedUser = userDetail?.response;

    if (refreshedUser) {
      Cookies.set('user', JSON.stringify(refreshedUser));
      window.dispatchEvent(new Event('cookieChange'));
      window.dispatchEvent(new Event('userAdded'));
    }
  };

  return (
    <>
      <KycPopup
        isOpen={openKycPopup}
        closePopup={setOpenKycPopup}
        addressData={addressData}
        setAddressData={setAddressData}
        dateOfBirth={dateOfBirth}
        setDateOfBirth={setDateOfBirth}
        handleExternalVerification={handleExternalVerification}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        onAadhaarVerified={handleAadhaarVerified}
        initialStep={initialStep}
      />
      <StyledModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        className="max-w-460"
        type="KYC"
        actionType={KYC.REVIEW}
        handleCancel={() => setModalOpen(false)}
        handleConfirm={() => setModalOpen(false)}
      />
    </>
  );
}
