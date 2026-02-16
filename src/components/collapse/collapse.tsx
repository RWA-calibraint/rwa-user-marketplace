'use client';

import { Collapse, Divider } from 'antd';
import { ChartNoAxesCombined, ChevronDown } from 'lucide-react';
import Image from 'next/image';

import PriceChartComponent from '@components/asset-details/price-chart-graph';

import { CollapseProps } from './interface';

const StyledCollapse = ({ assetData, accordionSections, handlePreview }: CollapseProps) => {
  const items = [
    {
      key: 'price',
      label: 'Asset Value Over Time',
      children: (
        <div>
          {assetData.priceHistory.length > 0 ? (
            <PriceChartComponent priceHistory={assetData.priceHistory} />
          ) : (
            <div className="border-primary-1 radius-6 p-24 gap-6 d-flex flex-column align-center justify-center width-100">
              <div className="p-10 radius-100 bg-hold-secondary d-flex align-center display-center">
                <ChartNoAxesCombined className="icon-20-brand-secondary" />
              </div>
              <p className="f-14-22-400-tertiary">No Data Available for Chart</p>
            </div>
          )}
        </div>
      ),
    },
    ...accordionSections.map((section) => {
      const documentsForSection = assetData?.documents?.filter((doc) => doc.type === section.key);

      return {
        key: section.key,
        label: section.label,
        children:
          documentsForSection && documentsForSection.length > 0 ? (
            <div className="documents-grid">
              {documentsForSection.map((doc, idx) => (
                <div key={idx} className="document-item">
                  {doc.documentUrl && /\.(jpg|jpeg|png|svg)$/.test(doc.documentUrl) ? (
                    <Image
                      src={doc.documentUrl}
                      alt={doc.type}
                      width={40}
                      height={40}
                      className="cursor-pointer"
                      onClick={() => handlePreview?.(doc)}
                    />
                  ) : (
                    <Image
                      src="/icons/pdf.svg"
                      alt={doc.type}
                      width={40}
                      height={40}
                      className="cursor-pointer"
                      onClick={() => handlePreview?.(doc)}
                    />
                  )}
                  <span className="f-14-16-400-secondary cursor-pointer" onClick={() => handlePreview?.(doc)}>
                    {doc.documentName.length > 20
                      ? `${doc.documentName.slice(0, 12)}...${doc.documentName.slice(-3)}`
                      : doc.documentName}
                  </span>
                </div>
              ))}
            </div>
          ) : null,
      };
    }),
  ];

  return (
    <>
      <Collapse
        expandIcon={({ isActive }) => <ChevronDown className={`collapse-icon ${isActive ? 'active' : ''}`} />}
        className="custom-collapse"
        items={items}
        expandIconPosition="end"
        bordered={false}
      />
      <Divider className="custom_ant_divider" />
    </>
  );
};

export default StyledCollapse;
