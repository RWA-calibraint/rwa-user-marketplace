import Image from 'next/image';
import React from 'react';

const NoDataFound = ({ title, description, isMobile }: { title: string; description: string; isMobile?: boolean }) => {
  return (
    <div
      className={`${isMobile ? 'p-x-0 h-300' : ' p-x-80 h-400'} d-flex flex-column align-center justify-center gap-8`}
    >
      <Image
        src="/sandglass.svg"
        alt="sandglass"
        width={60}
        height={116}
        className="w-full h-auto object-cover responsive-image"
      />
      <div
        className={`d-flex flex-column gap-2 align-center justify-center ${isMobile ? 'width-100' : 'w-400'} text-center`}
      >
        <h1 className={`${isMobile ? 'f-20-22-600-primary' : 'f-24-20-600-primary'}`}>{title}</h1>
        <p className="f-14-20-400-tertiary">{description}</p>
      </div>
    </div>
  );
};

export default NoDataFound;
