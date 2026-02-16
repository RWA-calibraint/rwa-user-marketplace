import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import { Form, Input, Skeleton } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { SetStateAction, useEffect, useRef, useState } from 'react';

import { ENV_CONFIGS } from '@/helpers/constants/configs/env-vars';
import { useToast } from '@/helpers/notifications/toast.notification';
import { getErrorMessage } from '@/helpers/services/get-error-message';

import Button from '../button/button';

interface AddressComponentProps {
  currentStep: number;
  handleExternalVerification: () => void;
  addressData: AddressDataInterface;
  setAddressData: React.Dispatch<SetStateAction<AddressDataInterface>>;
  closePopup: (open: boolean) => void;
}

interface AddressDataInterface {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export default function KycAddressForm({
  currentStep,
  addressData,
  handleExternalVerification,
  setAddressData,
  closePopup,
}: AddressComponentProps) {
  const { showErrorToast } = useToast();
  const libraries: 'places'[] = ['places'];
  const [hasErrors, setHasErrors] = useState(false);
  const [form] = useForm();

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: ENV_CONFIGS.GOOGLE_API_KEY,
    libraries,
  });

  const [address, setAddress] = useState('');
  const [expectedPostalCode, setExpectedPostalCode] = useState<string>('');

  const [disabledFields, setDisabledFields] = useState({
    city: false,
    state: false,
    country: false,
    postalCode: false,
  });

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();

      if (!place || !place.address_components) return;

      const tempAddressData = {
        address: '',
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

        tempAddressData.address = place.formatted_address || component.long_name || '';

        if (types.includes('locality')) {
          tempAddressData.city = component.long_name;
          updatedDisabledFields.city = true;
        }
        if (types.includes('administrative_area_level_1')) {
          tempAddressData.state = component.long_name;
          updatedDisabledFields.state = true;
        }
        if (types.includes('country')) {
          tempAddressData.country = component.long_name;
          updatedDisabledFields.country = true;
        }
        if (types.includes('postal_code')) {
          tempAddressData.postalCode = component.long_name;
          updatedDisabledFields.postalCode = true;
          setExpectedPostalCode(component.long_name);
        }
      });

      setAddress(tempAddressData.address);
      setDisabledFields(updatedDisabledFields);
      setAddressData(tempAddressData);
      form.setFieldsValue({ postalCode: tempAddressData.postalCode });
    }
  };
  const watchedPostalCode = Form.useWatch('postalCode', form);

  useEffect(() => {
    if (!disabledFields.postalCode && expectedPostalCode && watchedPostalCode !== expectedPostalCode) {
      form?.validateFields(['postalCode']);
    }
  }, [watchedPostalCode, expectedPostalCode, disabledFields.postalCode, form]);

  useEffect(() => {
    const allFieldsFilled =
      addressData.country.trim() &&
      addressData.address.trim() &&
      addressData.city.trim() &&
      addressData.state.trim() &&
      addressData.postalCode.trim();

    setHasErrors(!allFieldsFilled);
  }, [addressData]);

  useEffect(() => {
    if (address.trim() === '') {
      setAddressData({
        address: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
      });
      setDisabledFields({
        city: false,
        state: false,
        country: false,
        postalCode: false,
      });
    }
  }, [address, setAddressData]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;

    setAddress(newAddress);
    setAddressData((prev) => ({ ...prev, address: newAddress }));

    if (newAddress !== address) {
      setExpectedPostalCode('');
    }
  };

  const handleSubmit = async () => {
    try {
      handleExternalVerification();
    } catch (error) {
      showErrorToast(error, getErrorMessage(error));
    }
  };

  if (loadError) return <p>Failed to load Google Maps</p>;

  return (
    <section className={currentStep === 2 ? 'd-block' : 'd-none'}>
      {!isLoaded ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <>
          <Form form={form}>
            <div className="m-b-16">
              <label>
                Address Line<span className="f-14-16-500-status-red">*</span>
              </label>
              <Autocomplete
                onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                onPlaceChanged={handlePlaceSelect}
              >
                <Input
                  placeholder="1234 Elm Street"
                  className="m-t-8 p-y-8 p-x-12"
                  value={address}
                  onChange={(e) => {
                    handleAddressChange(e);
                  }}
                />
              </Autocomplete>
            </div>
            <div className="m-b-16">
              <label>
                Country<span className="f-14-16-500-status-red">*</span>
              </label>
              <Input
                placeholder="United States"
                className="m-t-8 p-y-8 p-x-12"
                value={addressData.country}
                onChange={(e) => setAddressData((prev) => ({ ...prev, country: e.target.value }))}
                disabled={disabledFields.country}
              />
            </div>
            <div className="m-b-16">
              <label>
                Town / City<span className="f-14-16-500-status-red">*</span>
              </label>
              <Input
                placeholder="Beverly Hills"
                className="m-t-8 p-y-8 p-x-12"
                value={addressData.city}
                onChange={(e) => setAddressData((prev) => ({ ...prev, city: e.target.value }))}
                disabled={disabledFields.city}
              />
            </div>
            <div className="m-b-16">
              <label>
                State / Province / Region<span className="f-14-16-500-status-red">*</span>
              </label>
              <Input
                placeholder="California"
                className="m-t-8 p-y-8 p-x-12"
                value={addressData.state}
                onChange={(e) => setAddressData((prev) => ({ ...prev, state: e.target.value }))}
                disabled={disabledFields.state}
              />
            </div>
            <div className="m-b-16">
              <label>Postal code</label>
              <Form.Item
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
                  placeholder="90210"
                  className="m-t-8 p-y-8 p-x-12"
                  value={addressData.postalCode}
                  onChange={(e) => setAddressData((prev) => ({ ...prev, postalCode: e.target.value }))}
                  disabled={disabledFields.postalCode}
                />
              </Form.Item>
            </div>
            <Button disabled={hasErrors} htmlType="button" onClick={() => handleSubmit()}>
              Submit and Proceed
            </Button>
          </Form>
        </>
      )}
    </section>
  );
}
