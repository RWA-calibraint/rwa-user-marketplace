import { Image, Skeleton } from 'antd';
import Cookies from 'js-cookie';
import { TriangleAlert, RotateCcw, CircleAlert } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { kycConstants } from '@/helpers/constants/constants';
import { KycDocument, KycProfile } from '@/redux/apis/interface';
import { useLazyGetUserDetailsQuery } from '@/redux/apis/user.api';

import Button from '../button/button';

interface KYCProps {
  applicantDetails?: KycProfile;
  handleInitiateKyc: () => void;
}

const RenderImageWithSkeleton = (url: string | undefined, width: number) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ width, position: 'relative' }}>
      {!loaded && <Skeleton.Image style={{ width, height: 180 }} active />}
      {url && (
        <Image
          src={url}
          alt="kyc-img"
          width={width}
          height={loaded ? 'auto' : 0}
          style={{ objectFit: 'cover', display: loaded ? 'block' : 'none' }}
          onLoad={() => setLoaded(true)}
          preview={false}
        />
      )}
    </div>
  );
};

const KYC: React.FC<KYCProps> = ({ applicantDetails, handleInitiateKyc }) => {
  const searchParams = useSearchParams();
  const [getUserDetails] = useLazyGetUserDetailsQuery();
  const verificationParams = searchParams.get('verification');

  const documents: KycDocument[] = applicantDetails?.response?.documents ?? [];

  const documentImages = documents.filter((doc) => doc.type !== 'SELFIE_IMAGE');
  const selfieImages = documents.filter((doc) => doc.type === 'SELFIE_IMAGE');

  const documentStatus = documentImages?.[0]?.status ?? '';
  const photoStatus = selfieImages?.[0]?.status ?? '';

  const finalStatus = documentStatus === 'pending' && photoStatus === 'pending';

  const renderImages = (urls: (string | undefined)[], width = 250) =>
    urls
      .filter(Boolean)
      .map((url, index) => <React.Fragment key={index}>{RenderImageWithSkeleton(url, width)}</React.Fragment>);

  const renderKycStatus = (type: 'photo' | 'document') => {
    const message = type === 'photo' ? kycConstants.KYC_REJECTED.LIVE_PHOTO : kycConstants.KYC_REJECTED.NATIONAL_ID;

    return (
      <div className="d-flex align-center bg-error p-12 radius-6">
        <TriangleAlert style={{ color: 'red' }} className="m-r-8" />
        <span>{message}</span>
      </div>
    );
  };

  const renderKycPendingStatus = () => {
    const message = kycConstants.KYC_PENDING;

    return (
      <div className="d-flex align-center bg-warning p-12 radius-6">
        <CircleAlert size={20} className="kyc-pending-alert-icon m-r-8" />
        <span>{message}</span>
      </div>
    );
  };

  useEffect(() => {
    if (verificationParams === 'success') {
      (async () => {
        const userDetail = await getUserDetails({}).unwrap();

        Cookies.set('user', JSON.stringify(userDetail?.response ?? {}));
        window.dispatchEvent(new Event('userAdded'));
      })();
    }
  }, [verificationParams]);

  return (
    <div className="d-flex flex-column gap-5">
      <div className="width-80 d-flex main-container flex-column gap-5 p-0">
        {finalStatus && renderKycPendingStatus()}
        {documentStatus && (
          <>
            <div className="f-24-24-600-secondary">Documents</div>
            {documentStatus !== 'valid' && documentStatus !== 'pending' && renderKycStatus('document')}
            {documentImages.length > 0 ? (
              documentImages.map((doc, idx) => (
                <div key={idx} className="d-flex gap-5">
                  {renderImages([doc.front_side, doc.back_side], 150)}
                </div>
              ))
            ) : (
              <div>No documents available</div>
            )}
          </>
        )}

        {photoStatus && (
          <>
            <div className="f-24-24-600-secondary">Profile</div>
            {photoStatus !== 'valid' && photoStatus !== 'pending' && renderKycStatus('photo')}
            {selfieImages.length > 0 ? (
              selfieImages.map((doc, idx) => (
                <div key={idx} className="d-flex gap-5">
                  {renderImages([doc.other_side_1 ?? undefined, doc.other_side_2 ?? undefined], 150)}
                </div>
              ))
            ) : (
              <div>No profile images available</div>
            )}
          </>
        )}

        {((documentStatus !== 'valid' && photoStatus !== 'pending') ||
          (photoStatus !== 'valid' && photoStatus !== 'pending')) && (
          <Button className="w-165 p-x-16 p-y-8 m-t-20" onClick={handleInitiateKyc}>
            <RotateCcw className="w-20" />
            Resubmit KYC
          </Button>
        )}
      </div>
    </div>
  );
};

export default KYC;
