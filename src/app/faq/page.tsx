'use client';

import { Collapse, Menu, Layout, Typography, Row, Col, Divider } from 'antd';
import Image from 'next/image';
import { useState } from 'react';

import { faqData } from '@/helpers/constants/faq-data';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const FaqComponent = () => {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof faqData>('Sellers');
  const [activePanels, setActivePanels] = useState<string[]>([]);

  const handleCategoryChange = (key: keyof typeof faqData) => {
    setSelectedCategory(key);
    setActivePanels([]);
  };

  return (
    <div className="d-flex flex-column align-center justify-center p-x-80 p-y-60">
      <div className="xl m-b-60">
        <h1 className="f-32-56-600-primary">Frequently Asked Questions (FAQs)</h1>
        <p className="m-t-12 f-16-20-400-tertiary">
          Find quick answers to common questions about our platform, features, and services.
        </p>
      </div>
      <Layout
        style={{
          minHeight: '75vh',
          backgroundColor: '#fff',
        }}
        className="xl"
      >
        <Row gutter={[24, 16]} className="gap-20 justify-space-betweeen">
          <Col flex="240px" className="p-l-12">
            <Sider width={240} theme="light">
              <Title className="f-12-14-400-tertiary p-x-14 p-y-10">CATEGORY</Title>
              <Menu
                mode="inline"
                className="custom-menu"
                selectedKeys={[selectedCategory]}
                onClick={({ key }) => handleCategoryChange(key as keyof typeof faqData)}
                items={[
                  { key: 'Sellers', label: 'Sellers' },
                  { key: 'Buyers & Investors', label: 'Buyers & Investors' },
                  { key: 'General Users', label: 'General Users' },
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
              <Title className="f-28-42-600-primary">{selectedCategory}</Title>
              <Row>
                {faqData[selectedCategory].map((item, index) => (
                  <Col span={24} key={index}>
                    <Collapse
                      activeKey={activePanels}
                      onChange={(keys) => setActivePanels(keys as string[])}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: 'transparent',
                      }}
                      expandIcon={({ isActive }) =>
                        isActive ? (
                          <Image height={36} width={36} src={'/Minus.svg'} alt={'Minus'} />
                        ) : (
                          <Image height={36} width={36} src={'/Plus.svg'} alt={'Plus'} />
                        )
                      }
                      expandIconPosition="end"
                      bordered={false}
                      items={[
                        {
                          key: index.toString(),
                          label: item.question,
                          children: (
                            <>
                              <Text className="f-14-22-400-secondary">{item.content}</Text>
                              {item.listItems && Array.isArray(item.listItems) && (
                                <ol style={{ paddingLeft: '20px', marginTop: '10px' }}>
                                  {item.listItems.map((point, i) => (
                                    <li key={i} style={{ marginBottom: '5px' }}>
                                      <Text className="f-14-22-400-secondary">{point}</Text>
                                    </li>
                                  ))}
                                </ol>
                              )}
                            </>
                          ),
                        },
                      ]}
                    />
                    <Divider className="m-0" />
                  </Col>
                ))}
              </Row>
            </Content>
          </Col>
        </Row>
      </Layout>
    </div>
  );
};

export default FaqComponent;
