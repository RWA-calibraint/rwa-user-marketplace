import { Button } from 'antd';
import Image from 'next/image';

import useMediaQuery from '@hooks/useMediaQuery';
interface ComingSoonProps {
  onGoHome: () => void;
}

function ComingSoon({ onGoHome }: ComingSoonProps) {
  const isMobile = useMediaQuery('mobile');

  return (
    <div className={`d-flex p-y-40 h-640 w-full align-center justify-center flex-column`}>
      <div className={`${!isMobile ? 'w-400' : ''}d-flex flex-column gap-8`}>
        <div className="d-flex justify-center align-center items-center">
          <Image
            src="/sandglass.svg"
            alt="sandglass"
            width={60}
            height={116}
            className="w-full h-auto object-cover responsive-image"
          />
        </div>

        <div className="d-flex flex-column justify-center align-center items-center gap-5">
          <div className="d-flex flex-column justify-center align-left items-center gap-2">
            <span className="f-24-42-600-primary text-center font-secondary">&nbsp;Coming Soon</span>
            <p className="f-14-20-400-tertiary text-center font-secondary">
              We&apos;re working on something exciting! This feature is not available yet, but stay tuned for updates.
            </p>
          </div>

          <Button type="primary" className="f-14-20-400-primary custom-btn" onClick={onGoHome}>
            Take me home
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ComingSoon;
