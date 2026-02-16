'use client';

import { Menu, Layout, Typography, Row, Col, Divider } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { termsData } from '@/helpers/constants/tos-data';

import { DataSectionItem, ToSData } from './interface';

const { Sider, Content } = Layout;
const { Title } = Typography;

const availableMenu = (key: string): keyof ToSData => {
  const keys = Object.keys(termsData);

  return (keys.find((menuKey) => menuKey === key) ?? keys[0]) as keyof ToSData;
};

const Terms = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get('target');

  const [selectedCategory, setSelectedCategory] = useState<keyof ToSData>(availableMenu(search ?? 'buyer'));

  useEffect(() => {
    router.replace(`/terms?target=${selectedCategory}`);
  }, [router, selectedCategory]);

  return (
    <div className="d-flex flex-column align-center justify-center p-x-80 p-y-60">
      <div className="xl m-b-60">
        <h1 className="p-b-12">Terms and Conditions</h1>
        <div className="d-flex gap-3">
          <span className="f-16-22-400-tertiary">
            Effective Date: <span className="f-16-22-400-tertiary">&nbsp;13/3/2025</span>
          </span>
          <span className="f-16-22-400-tertiary">•</span>
          <span className="f-16-22-400-tertiary">
            Last Updated: <span className="f-16-22-400-tertiary">&nbsp;13/3/2025</span>
          </span>
        </div>
      </div>
      <Layout
        style={{
          minHeight: '100vh',
          backgroundColor: '#fff',
        }}
        className="xl"
      >
        <Row gutter={[24, 16]} className="gap-20 xl">
          <Col flex="240px" className="p-0">
            <Sider width={240} theme="light">
              <Title className="f-12-14-400-tertiary p-x-14 p-y-10">CATEGORY</Title>
              <Menu
                mode="inline"
                className="custom-menu "
                selectedKeys={[selectedCategory]}
                defaultSelectedKeys={[selectedCategory]}
                onClick={({ key }) => {
                  setSelectedCategory(key as keyof ToSData);
                  router.replace(`/terms-and-conditions?target=${key}`);
                }}
                items={[
                  { key: 'buyer', label: 'Buyers & Investors' },
                  { key: 'seller', label: 'Seller' },
                ]}
              />
            </Sider>
          </Col>
          <Col flex="700px" className="p-0">
            <Content
              style={{
                textAlign: 'left',
                background: '#fff',
                minHeight: '300px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Title className="f-28-42-600-primary">{termsData[selectedCategory]?.label}</Title>
              <Row gutter={[0, 16]}>
                <div className="d-flex flex-column">
                  {termsData[selectedCategory] && (
                    <span
                      className="f-16-26-400-secondary"
                      dangerouslySetInnerHTML={{ __html: termsData[selectedCategory]?.heading ?? '' }}
                    />
                  )}

                  <Divider className="m-t-30 m-b-30" />

                  {termsData[selectedCategory]?.sections?.map((section: DataSectionItem, index) => (
                    <div key={index} className={`d-flex flex-column gap-3`}>
                      <h2 className="f-20-22-600-primary">
                        {index + 1}.&nbsp;{section.title}
                      </h2>

                      {section.content && (
                        <p className="f-16-22-400-secondary" dangerouslySetInnerHTML={{ __html: section.content }} />
                      )}

                      {section.nested &&
                        section.nested.map((nested, idx) => (
                          <div className="d-flex flex-column gap-2" key={idx}>
                            <h3 className="f-18-22-600-primary">
                              {index + 1}.{idx + 1}&nbsp;
                              {nested.heading}
                            </h3>
                            {nested.content && <p className="f-16-22-400-secondary">{nested.content}</p>}
                            {nested.listItems && (
                              <ul className="m-0">
                                {nested.listItems.map((item, index) => (
                                  <li
                                    key={index}
                                    className="f-16-22-400-secondary"
                                    dangerouslySetInnerHTML={{ __html: item }}
                                  />
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}

                      {section.listItems && (
                        <ul className="m-0">
                          {section.listItems.map((item, index) => (
                            <li
                              key={index}
                              className="f-16-22-400-secondary"
                              dangerouslySetInnerHTML={{ __html: item }}
                            />
                          ))}
                        </ul>
                      )}
                      {section.contentMiddle && (
                        <p
                          className="f-16-22-400-secondary"
                          dangerouslySetInnerHTML={{ __html: section.contentMiddle }}
                        />
                      )}
                      {section.listItems2 && (
                        <ul className="m-0">
                          {section.listItems2.map((item, index) => (
                            <li
                              key={index}
                              className="f-16-22-400-secondary"
                              dangerouslySetInnerHTML={{ __html: item }}
                            />
                          ))}
                        </ul>
                      )}
                      {section.contentEnd && (
                        <span
                          key={index}
                          className="f-16-22-400-secondary"
                          dangerouslySetInnerHTML={{ __html: section.contentEnd }}
                        />
                      )}
                      <Divider className="m-t-30 m-b-30" />
                    </div>
                  ))}
                  {selectedCategory === 'buyer' && (
                    <div>
                      <h3 className="f-24-22-600-primary m-b-12">ACKNOWLEDGEMENT</h3>
                      <p className="f-16-22-400-secondary">
                        By investing on asset displayed in Rareagora.com , you acknowledge that you understand and agree
                        to these terms and conditions.
                      </p>
                    </div>
                  )}
                </div>
              </Row>
            </Content>
          </Col>
        </Row>
      </Layout>
    </div>
  );
};

export default function TermsBoundary() {
  return (
    <Suspense>
      <Terms />
    </Suspense>
  );
}
