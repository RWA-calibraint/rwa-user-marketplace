'use client';
// Homepage.tsx
// import Cookies from 'js-cookie';
import { BookOpen, Building2, Lamp, PaintbrushVertical, Sparkles } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

// import KycPopup from '@/components/KYC/kyc-popup';
// import StyledModal from '@/components/Modal/Modal';
// import { KYC } from '@/helpers/constants/asset-status';
import mixpanel, { initMixpanel } from '@/helpers/constants/configs/mixpanel';
// import { getUserFromCookies } from '@/helpers/services/get-user-data';
// import { useCookieListener } from '@/hooks/useCookieListener';
// import { useUserListener } from '@/hooks/useUserListener';
// import {
//   useCreateApplicantMutation,
//   useLazyGetApplicantDetailsQuery,
//   useLazyGetVerificationUrlQuery,
//   useUpdateUserMutation,
// } from '@/redux/apis/user.api';
// import { UserDetailsData } from '@/redux/utils/interfaces/user.interface';
import ForYouLayout from '@app/homepage/ForYouSection';
import TabsPanel from '@components/TabsPanel/tabsPanel';

import ComingSoon from './ComingSoon';
// import { AddressDataInterface } from './homepage.interface';

function Homepage() {
  // const [updateUser] = useUpdateUserMutation();
  // const [createApplicant] = useCreateApplicantMutation();
  // const [getVerificationUrl] = useLazyGetVerificationUrlQuery();
  const startTimeRef = useRef<number | null>(null);
  const [activeKey, setActiveKey] = useState('1');
  // const [openKycPopup, setOpenKycPopup] = useState(false);
  // const user = getUserFromCookies();
  // const isTokenAdded = useCookieListener();
  // const userData = useUserListener();
  // const [triggerGetApplicantDetails, { data: applicantDetails }] = useLazyGetApplicantDetailsQuery();
  // const [modalOpen, setModalOpen] = useState<boolean>(false);
  // const [phoneNumber, setPhoneNumber] = useState<string>('');
  // const [dateOfBirth, setDateOfBirth] = useState<string>('');
  // const [addressData, setAddressData] = useState<AddressDataInterface>({
  //   address: '',
  //   city: '',
  //   state: '',
  //   country: '',
  //   postalCode: '',
  //   apartment: '',
  // });

  const reportTimeSpent = () => {
    const startTime = startTimeRef.current;

    if (startTime !== null) {
      const durationMs = Date.now() - startTime;
      const durationSec = Math.floor(durationMs / 1000);

      mixpanel.track('time_spent_on_home_page', {
        duration_seconds: durationSec,
      });
    }
  };

  useEffect(() => {
    initMixpanel();
    startTimeRef.current = Date.now();

    const handleBeforeUnload = () => {
      reportTimeSpent();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    const handleResetTabs = () => {
      setActiveKey('1');
    };

    window.addEventListener('resetTabs', handleResetTabs);
    window.addEventListener('cookieChange', handleResetTabs);

    return () => {
      window.removeEventListener('resetTabs', handleResetTabs);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('cookieChange', handleResetTabs);
    };
  }, []);

  // useEffect(() => {
  //   const hasUserDetails = userData?.address || userData?.phoneNumber;

  //   if (!isTokenAdded || !userData) return;

  //   if (userData?.applicantId) {
  //     (async () => {
  //       const result = await triggerGetApplicantDetails({ applicantId: userData.applicantId });
  //       const documents = result?.data?.response?.documents ?? [];

  //       if (documents.length > 0) {
  //         setModalOpen(false);
  //         setOpenKycPopup(false);
  //       } else {
  //         if (hasUserDetails) {
  //           setModalOpen(true);
  //         } else {
  //           setOpenKycPopup(true);
  //         }
  //       }
  //     })();
  //   } else {
  //     if (hasUserDetails) {
  //       setModalOpen(true);
  //     } else {
  //       setOpenKycPopup(true);
  //     }
  //   }
  // }, [isTokenAdded, userData]);

  // const handleInitiateKyc = async (userData?: UserDetailsData) => {
  //   if (!userData) userData = getUserFromCookies();

  //   const verificationUrl = await getVerificationUrl({ applicantId: userData?.applicantId ?? '' }).unwrap();

  //   window.location.href = verificationUrl.response.form_url;
  // };

  // const handleExternalVerification = async () => {
  //   const params = {
  //     firstName: user.firstName,
  //     lastName: user.lastName,
  //     email: user.email,
  //   };
  //   const applicant = await createApplicant(params).unwrap();
  //   const payload = {
  //     phoneNumber: phoneNumber,
  //     dateOfBirth: dateOfBirth,
  //     address: addressData.address,
  //     country: addressData.country,
  //     state: addressData.state,
  //     city: addressData.city,
  //     postalCode: addressData.postalCode,
  //     applicantId: applicant.response.applicant_id,
  //   };

  //   const userDetail = await updateUser({
  //     updatedData: payload,
  //     update_type: 'update_profile',
  //   }).unwrap();

  //   const { response: userData } = userDetail || {};

  //   Cookies.set('user', JSON.stringify(userData ?? {}));
  //   window.dispatchEvent(new Event('cookieChange'));

  //   await handleInitiateKyc(userData);
  // };

  const homePageTabs = [
    {
      key: '1',
      label: (
        <span className="d-inline-flex align-center gap-2">
          <Sparkles size={20} />
          For You
        </span>
      ),
      children: <ForYouLayout setActiveKey={setActiveKey} />,
    },
    {
      key: '2',
      label: (
        <span className="d-inline-flex align-center gap-2">
          <PaintbrushVertical size={20} />
          Art
        </span>
      ),
      children: <ComingSoon onGoHome={() => setActiveKey('1')} />,
    },
    {
      key: '3',
      label: (
        <span className="d-inline-flex align-center gap-2">
          <Building2 size={20} />
          Real Estate
        </span>
      ),
      children: <ComingSoon onGoHome={() => setActiveKey('1')} />,
    },
    {
      key: '4',
      label: (
        <span className="d-inline-flex align-center gap-2">
          <Lamp size={20} />
          Antiques
        </span>
      ),
      children: <ComingSoon onGoHome={() => setActiveKey('1')} />,
    },
    {
      key: '5',
      label: (
        <span className="d-inline-flex align-center gap-2">
          <BookOpen size={20} />
          Books
        </span>
      ),
      children: <ComingSoon onGoHome={() => setActiveKey('1')} />,
    },
    // {
    //   key: '6',
    //   label: (
    //     <span className="d-inline-flex align-center gap-2">
    //       <Watch size={20} />
    //       Luxury
    //     </span>
    //   ),
    //   children: <ComingSoon onGoHome={() => setActiveKey('1')} />,
    // },
    // {
    //   key: '7',
    //   label: (
    //     <span className="d-inline-flex align-center gap-2">
    //       <Gem size={20} />
    //       Jewellery
    //     </span>
    //   ),
    //   children: <ComingSoon onGoHome={() => setActiveKey('1')} />,
    // },
    // {
    //   key: '8',
    //   label: (
    //     <span className="d-inline-flex align-center gap-2">
    //       <Sofa size={20} />
    //       Furniture
    //     </span>
    //   ),
    //   children: <ComingSoon onGoHome={() => setActiveKey('1')} />,
    // },
    // {
    //   key: '9',
    //   label: (
    //     <span className="d-inline-flex align-center gap-2">
    //       <Layers size={20} />
    //       Collectibles
    //     </span>
    //   ),
    //   children: <ComingSoon onGoHome={() => setActiveKey('1')} />,
    // },
  ];

  return (
    <div className="d-flex align-center justify-center homepage-container">
      <TabsPanel
        tabs={homePageTabs}
        activeKey={activeKey}
        onTabChange={(key) => setActiveKey(key)}
        className="xl space-between p-t-5 custom-nav-list"
      />
      {/* <KycPopup
        isOpen={openKycPopup}
        closePopup={setOpenKycPopup}
        addressData={addressData}
        setAddressData={setAddressData}
        dateOfBirth={dateOfBirth}
        setDateOfBirth={setDateOfBirth}
        handleExternalVerification={handleExternalVerification}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
      />
      <StyledModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        className="max-w-460"
        type="KYC"
        actionType={KYC.INITIATE}
        handleCancel={() => setModalOpen(false)}
        handleConfirm={() => handleInitiateKyc()}
      /> */}
    </div>
  );
}

export default Homepage;
