'use client';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import { Form, FormInstance, Input, Skeleton } from 'antd';
import { SetStateAction, useEffect, useRef, useState } from 'react';

import { ENV_CONFIGS } from '@/helpers/constants/configs/env-vars';

const libraries: 'places'[] = ['places'];

const EditAssetLocation = ({
  form,
  address,
  setAddress,
}: {
  form?: FormInstance<unknown>;
  address: string;
  setAddress: React.Dispatch<SetStateAction<string>>;
}) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [expectedPostalCode, setExpectedPostalCode] = useState<string>('');
  const [disabledFields, setDisabledFields] = useState({
    city: false,
    state: false,
    country: false,
    postalCode: false,
  });

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: ENV_CONFIGS.GOOGLE_API_KEY,
    libraries,
  });

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();

      if (!place || !place.address_components) return;

      const addressData = {
        address: place.formatted_address || '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
      };

      const updatedDisabledFields = {
        city: false,
        state: false,
        country: false,
        postalCode: false,
      };

      place.address_components.forEach((component) => {
        const types = component.types;

        if (types.includes('locality')) {
          addressData.city = component.long_name;
          updatedDisabledFields.city = true;
        }
        if (types.includes('administrative_area_level_1')) {
          addressData.state = component.long_name;
          updatedDisabledFields.state = true;
        }
        if (types.includes('country')) {
          addressData.country = component.long_name;
          updatedDisabledFields.country = true;
        }
        if (types.includes('postal_code')) {
          addressData.postalCode = component.long_name;
          updatedDisabledFields.postalCode = true;
          setExpectedPostalCode(component.long_name);
        }
      });

      setAddress(addressData.address);
      setDisabledFields(updatedDisabledFields);
      form?.setFieldsValue(addressData);
    }
  };
  const watchedPostalCode = Form.useWatch('postalCode', form);

  useEffect(() => {
    if (!disabledFields.postalCode && expectedPostalCode && watchedPostalCode !== expectedPostalCode) {
      form?.validateFields(['postalCode']);
    }
  }, [watchedPostalCode, expectedPostalCode, disabledFields.postalCode, form]);
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;

    setAddress(newAddress);

    if (newAddress !== address) {
      setExpectedPostalCode('');
    }
  };

  if (loadError) return <p>Failed to load Google Maps</p>;

  return (
    <div className={`w-662 border-none-0 radius-12 bg-white overflow-auto`}>
      {!isLoaded ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <div>
          <Form.Item
            label={
              <span className="form-input form-label">
                Address <span className="f-14-16-500-status-red">*</span>
              </span>
            }
            name="address"
            className="m-b-16"
            rules={[{ required: true, message: 'Address is required' }]}
          >
            <Input
              className="placeholder"
              maxLength={100}
              placeholder="Enter Address"
              value={address}
              onChange={handleAddressChange}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="form-input form-label">
                Country <span className="f-14-16-500-status-red">*</span>
              </span>
            }
            name="country"
            className="m-b-16"
            rules={[{ required: true, message: 'Country is required' }]}
          >
            <Input className="placeholder" maxLength={50} placeholder="Country" disabled={disabledFields.country} />
          </Form.Item>

          <Form.Item
            label={
              <span className="form-input form-label">
                Town / City <span className="f-14-16-500-status-red">*</span>
              </span>
            }
            name="city"
            className="m-b-16"
            rules={[{ required: true, message: 'Town / City is required' }]}
          >
            <Input className="placeholder" maxLength={50} placeholder="City" disabled={disabledFields.city} />
          </Form.Item>

          <Form.Item
            label={
              <span className="form-input form-label">
                State / Province / Region <span className="f-14-16-500-status-red">*</span>
              </span>
            }
            name="state"
            className="m-b-16"
            rules={[{ required: true, message: 'State / Province / Region is required' }]}
          >
            <Input className="placeholder" placeholder="State" maxLength={50} disabled={disabledFields.state} />
          </Form.Item>

          <Form.Item
            label={
              <span className="form-input form-label">
                Postal Code <span className="f-14-16-500-status-red">*</span>
              </span>
            }
            name="postalCode"
            rules={[
              { required: true, message: 'Postal Code is required' },
              () => ({
                validator(_, value) {
                  if (expectedPostalCode && !disabledFields.postalCode && value !== expectedPostalCode) {
                    return Promise.reject(
                      `Postal Code does not match the selected address. It should be like ${expectedPostalCode}`,
                    );
                  }

                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              className="placeholder"
              placeholder="Postal Code"
              maxLength={20}
              disabled={disabledFields.postalCode}
            />
          </Form.Item>
        </div>
      )}
    </div>
  );
};

export default EditAssetLocation;
