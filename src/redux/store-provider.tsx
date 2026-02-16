'use client';
import '@ant-design/v5-patch-for-react-19';
import { ReactNode, useRef } from 'react';
import { Provider } from 'react-redux';

import { AppStore, makeStore } from './store';

export default function StoreProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
