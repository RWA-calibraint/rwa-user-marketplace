'use client';
import { Button } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import CategoryTabs from '@/components/catergory-tabs/page';
function ErrorPage() {
  const router = useRouter();

  return (
    <div className="d-flex flex-column">
      <CategoryTabs />
      <div className="d-flex p-y-32 h-640 w-full align-center justify-center flex-column">
        <div className="w-400 d-flex justify-center align-center items-center">
          <Image
            src="/404.svg"
            alt="sandglass"
            width={232}
            height={154}
            className="w-full h-auto object-cover responsive-image"
          />
        </div>

        <div className="w-400 d-flex flex-column justify-center align-center items-center m-t-28">
          <div className="d-flex flex-column justify-center align-left items-center">
            <span className="f-14-27-600-primary text-center font-primary">&nbsp;Page Not Found</span>
            <p className="f-14-27-400-tertiary text-center font-primary">
              We&apos;re not sure what went wrong. Go back or click the button below to go home.
            </p>
          </div>
        </div>

        <div className="m-t-18">
          <Button type="primary" className="font-primary f-14-27-500-primary" onClick={() => router.push('/')}>
            Take me home
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
