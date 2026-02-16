import Image from 'next/image';
import { FC } from 'react';

interface NoDataFoundInterface {
  className?: string;
  title?: string;
  description?: string;
}

export const NoDataFound: FC<NoDataFoundInterface> = ({ className, title, description }) => {
  return (
    <div className={`d-flex flex-column align-center justify-center ${className}`}>
      <Image src="/no-data.svg" alt="No data" height={72} width={95} />
      <h3 className="f-14-16-600-primary m-t-20 m-b-8">{title}</h3>
      <p className="f-14-20-400-tertiary">{description}</p>
    </div>
  );
};
