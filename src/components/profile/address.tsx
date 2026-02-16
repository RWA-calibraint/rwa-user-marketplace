'use client';

import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import { Button, Form, Input, Skeleton } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

import { isValidPostalCode } from '@/helpers/services/validate-postalcode';
import { ENV_CONFIGS } from '@helpers/constants/configs/env-vars';

import { AddressProps } from './interface';

const libraries: 'places'[] = ['places'];

const Address = ({ isLoading, handleSave, userDetails, form }: AddressProps) => {
  const [address, setAddress] = useState<string>('');
  const [expectedPostalCode, setExpectedPostalCode] = useState<string>('');
  const [disabledFields, setDisabledFields] = useState({
    city: false,
    state: false,
    country: false,
    postalCode: false,
  });

  useEffect(() => {
    setAddress(userDetails?.address || '');
  }, [userDetails]);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handlePlaceSelect = () => {
    if (!autocompleteRef.current) return;

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
  };

  const watchedPostalCode = Form.useWatch('postalCode', form);

  useEffect(() => {
    if (!disabledFields.postalCode && expectedPostalCode && watchedPostalCode !== expectedPostalCode) {
      form?.validateFields(['postalCode']);
    }
  }, [watchedPostalCode, expectedPostalCode, disabledFields.postalCode, form]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: ENV_CONFIGS.GOOGLE_API_KEY,
    libraries,
  });

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;

    setAddress(newAddress);

    if (newAddress !== address) {
      setExpectedPostalCode('');
    }
  };

  if (loadError) return <p>Failed to load Google Maps</p>;

  return (
    <>
      {!isLoaded ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <div className="d-flex flex-column gap-8">
          <div className="d-flex flex-column gap-2">
            <Form.Item
              label={
                <span>
                  Address line <span className="f-14-16-500-status-red">*</span>
                </span>
              }
              name="address"
              className="m-b-16"
              rules={[{ required: true, message: 'Address is required' }]}
            >
              <Autocomplete
                onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                onPlaceChanged={handlePlaceSelect}
              >
                <Input
                  className="placeholder custom-input"
                  maxLength={100}
                  placeholder="1234 Elm Street"
                  value={address}
                  onChange={handleAddressChange}
                />
              </Autocomplete>
            </Form.Item>

            <Form.Item
              label={
                <span>
                  Country <span className="f-14-16-500-status-red">*</span>
                </span>
              }
              name="country"
              className="m-b-16"
              rules={[{ required: true, message: 'Country is required' }]}
            >
              <Input
                className="custom-input"
                maxLength={50}
                placeholder="United States"
                disabled={disabledFields.country}
              />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  Town / City <span className="f-14-16-500-status-red">*</span>
                </span>
              }
              name="city"
              className="m-b-16"
              rules={[{ required: true, message: 'Town / City is required' }]}
            >
              <Input
                className="custom-input"
                maxLength={50}
                placeholder="Beverly Hills"
                disabled={disabledFields.city}
              />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  State / Province / Region <span className="f-14-16-500-status-red">*</span>
                </span>
              }
              name="state"
              className="m-b-16"
              rules={[{ required: true, message: 'State / Province / Region is required' }]}
            >
              <Input className="custom-input" placeholder="California" maxLength={50} disabled={disabledFields.state} />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  Postal Code <span className="f-14-16-500-status-red">*</span>
                </span>
              }
              name="postalCode"
              className="m-b-16"
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
              <Input className="custom-input" placeholder="90210" maxLength={20} disabled={disabledFields.postalCode} />
            </Form.Item>
          </div>

          <div className="save-btn h-44">
            <Button
              type="primary"
              loading={isLoading}
              className="h-44 radius-6 p-x-16 p-y-8 gap-2 custom-btn m-b-0"
              onClick={async () => {
                const isValid = await isValidPostalCode(form.getFieldValue('postalCode'), form.getFieldValue('city'));

                if (disabledFields.postalCode || isValid) {
                  handleSave();
                } else {
                  form.setFields([
                    {
                      name: 'postalCode',
                      errors: ['postalCode does not match the selected city'],
                    },
                  ]);
                }
              }}
              style={{ width: '100px' }}
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Address;
