'use client';

import { AutoComplete, Input } from 'antd';
import type { AutoCompleteProps } from 'antd';
import { Search, HardDrive, X as ClearSearchIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC, useState, useEffect, useCallback, ChangeEvent } from 'react';

import useMediaQuery from '@/hooks/useMediaQuery';
import { SearchBoxProps } from '@components/search-box/search-box.interface';
import { useLazyAssetPartialSearchQuery } from '@redux/apis/asset.api';

import './search-box.scss';

//Uncomment this when it is needed
// const FeaturedAssetDisplay = ({ asset }: { asset: AssetItem | null }) => {
//   if (!asset) return null;

//   return (
//     <div className="max-h-132">
//       <div className="f-10-14-400-tertiary">FEATURED ASSET</div>
//       <div className="d-flex align-center m-t-10 h-40">
//         <div className="d-flex align-center h-40">
//           <Image height={40} width={40} alt="" className="radius-4 border-primary-1" src={asset.icon} preview={false} />
//           <p className="f-14-16-500-primary m-l-10">{asset.title}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

export const SearchBox: FC<SearchBoxProps> = ({
  placeHolder,
  value: initialValue = '',
  autoFocus = true,
  setSearchValue,
}) => {
  const router = useRouter();
  const isMobileView = useMediaQuery('mobile');
  const [value, setValue] = useState(initialValue);
  const [options, setOptions] = useState<AutoCompleteProps['options']>([]);
  const [assetPartialSearch, { isFetching, isLoading, isSuccess }] = useLazyAssetPartialSearchQuery();

  const handleSearch = useCallback(
    async (inputValue: string) => {
      setValue(inputValue);
      if (setSearchValue) {
        setSearchValue(inputValue);
      }

      if (inputValue) {
        setOptions([]);
        const searchResults = await assetPartialSearch(inputValue).unwrap();

        const results = searchResults.response?.map((result: { name: string }, index: number) => ({
          value: result.name + `-${index}`,
          label: result.name,
          ...result,
        }));

        setOptions(results);
      } else {
        setOptions([]);
      }
    },
    [setSearchValue, assetPartialSearch],
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      handleSearch(value);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [value, handleSearch]);

  const generateOptions = () => {
    let generatedOptions: AutoCompleteProps['options'] = [];
    const hasSearchResults = options && options.length > 0;

    if (hasSearchResults) {
      options?.map((asset) =>
        generatedOptions?.push({
          value: asset.assetId,
          label: (
            <div className="h-36 d-flex align-center justify-start f-15-21-500-tertiary cursor-none">
              <Image
                height={40}
                width={40}
                alt={'asset-image'}
                className="radius-4 border-primary-1"
                src={asset?.images[0]}
                priority
              />
              <p className="f-14-16-500-primary m-l-10">{asset?.label}</p>
            </div>
          ),
        }),
      );
    } else if (value) {
      generatedOptions = [
        {
          value: 'not-found',
          label: (
            <div className="h-36 d-flex align-center justify-start f-15-21-500-tertiary cursor-none">
              {isFetching || isLoading ? (
                'Loading...'
              ) : isSuccess ? (
                <div className="d-flex align-center justify-center width-100">
                  <HardDrive /> <h4 className="m-l-12">No results found</h4>
                </div>
              ) : (
                'Loading...'
              )}
            </div>
          ),
          disabled: true,
        },
      ];
    }

    return generatedOptions;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setSearchValue?.(e.target.value);
  };

  return (
    <div className={`${isMobileView ? 'width-100' : 'w-400'} bg-white d-flex`}>
      <AutoComplete
        className={`${isMobileView ? 'width-100' : 'w-400'} bg-white search-box`}
        value={value}
        options={generateOptions()}
        defaultActiveFirstOption={false}
        dropdownStyle={{ zIndex: 11 }}
        onSelect={(selectedValue) => {
          router.push(`/asset/${selectedValue}`);
        }}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
      >
        <Input
          className={`${isMobileView ? 'width-100' : 'w-400'} f-14-20-400-search-text bg-white bg-white border-primary-1 header-search-box`}
          value={value}
          autoFocus={autoFocus}
          placeholder={placeHolder}
          onChange={handleInputChange}
          prefix={<Search width={16} height={16} />}
          suffix={
            value.length > 0 ? (
              <span
                className="p-x-8 position-relative left--20 top-5 cursor-pointer"
                onClick={() => {
                  setValue('');
                  setSearchValue?.('');
                }}
              >
                <ClearSearchIcon size={20} />
              </span>
            ) : null
          }
        />
      </AutoComplete>
    </div>
  );
};
