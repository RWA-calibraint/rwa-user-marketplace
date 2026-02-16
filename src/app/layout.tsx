import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, App as AntdApp } from 'antd';
import type { Metadata } from 'next';
import { ReactNode, Suspense } from 'react';
import { ThirdwebProvider } from 'thirdweb/react';

import Footer from '@components/footer/footer';
import { Header } from '@components/header/header';
import { ToastProvider } from '@helpers/notifications/toast.notification';
import StoreProvider from '@redux/store-provider';

import '@styles/global.scss';

export const metadata: Metadata = {
  title: 'Rare Agora',
  description: 'Rare Agora',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                fontFamily: 'Bricolage Grotesque, sans-serif',
              },
            }}
          >
            <AntdApp>
              <Suspense>
                <StoreProvider>
                  <ThirdwebProvider>
                    <ToastProvider>
                      <div className="d-flex flex-column flex-grow-1 width-100">
                        <Header />
                        <div className="d-flex flex-column width-100 flex-grow-1">
                          <div className="m-t-84 flex-grow-1">{children}</div>
                          <Footer />
                        </div>
                      </div>
                    </ToastProvider>
                  </ThirdwebProvider>
                </StoreProvider>
              </Suspense>
            </AntdApp>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
