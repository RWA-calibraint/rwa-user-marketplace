import { ENV_CONFIGS } from '@/helpers/constants/configs/env-vars';

import NoData from './no-data';

interface DetailsProps {
  tokens: number;
  price: number;
  soldTokens: number;
  contractTokenId: string;
  arweaveMetadataUrl: string;
}

const Details = ({ tokens, price, soldTokens, contractTokenId, arweaveMetadataUrl }: DetailsProps) => {
  const details = [
    {
      key: 'Contract Address',
      value: `${ENV_CONFIGS.RWA_TOKEN_CONTRACT_ADDRESS.slice(0, 5)}...${ENV_CONFIGS.RWA_TOKEN_CONTRACT_ADDRESS.slice(-4)}`,
      link: `${ENV_CONFIGS.POLYGON_URL}/${ENV_CONFIGS.RWA_TOKEN_CONTRACT_ADDRESS}`,
    },
    {
      key: 'Token ID',
      value: `${contractTokenId}`,
      link: arweaveMetadataUrl,
    },
    {
      key: 'Token Standard',
      value: 'ERC1155',
    },
    {
      key: 'No of tokens',
      value: `${tokens}`,
    },
    {
      key: 'Price per token $(USD)',
      value: `${(price / tokens).toFixed(4)}`,
    },
    {
      key: 'Available tokens',
      value: `${tokens - soldTokens}`,
    },
    {
      key: 'Sold tokens',
      value: `${soldTokens}`,
    },
    {
      key: 'Token Value',
      value: `${price}`,
    },
  ];

  const handleClick = (link?: string) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="d-flex flex-column gap-4 p-16">
      {details.length > 0 ? (
        details.map((item) => (
          <div key={item.key} className="d-flex align-center justify-space-between">
            <p className="f-14-16-400-primary">{item.key}</p>
            <p
              className={`${item.key === 'Contract Address' || item.key === 'Token ID' ? 'f-14-16-400-b-s cursor-pointer' : 'f-14-16-400-primary'}`}
              onClick={() => handleClick(item.link)}
            >
              {item.value}
            </p>
          </div>
        ))
      ) : (
        <NoData description={'No Activity Yet'} />
      )}
    </div>
  );
};

export default Details;
