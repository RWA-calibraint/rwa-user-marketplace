import { Modal, Progress, DatePicker, Form } from 'antd';
import dayjs from 'dayjs';
import { CalendarDays, X as CloseIcon } from 'lucide-react';
import React, { SetStateAction, useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';

import { AddressDataInterface } from '@/app/homepage/homepage.interface';

import Button from '../button/button';

import AadhaarOtpForm from './kyc-aadhaar-otp';
import KycAddressForm from './kyc-address-form';

import './kyc-popup.scss';
import 'react-phone-input-2/lib/style.css';

interface KycInterface {
  isOpen: boolean;
  closePopup: (open: boolean) => void;
  phoneNumber: string;
  setPhoneNumber: React.Dispatch<SetStateAction<string>>;
  dateOfBirth: string;
  setDateOfBirth: React.Dispatch<SetStateAction<string>>;
  addressData: AddressDataInterface;
  setAddressData: React.Dispatch<SetStateAction<AddressDataInterface>>;
  handleExternalVerification: () => void;
  onAadhaarVerified?: () => void;
  initialStep?: number;
}

export default function KycPopup(kycProps: KycInterface) {
  const {
    isOpen,
    closePopup,
    addressData,
    setAddressData,
    phoneNumber,
    setPhoneNumber,
    dateOfBirth,
    setDateOfBirth,
    handleExternalVerification,
    onAadhaarVerified,
    initialStep = 1,
  } = kycProps;
  const [currentStep, setCurrentStep] = useState(initialStep);

  const [form] = Form.useForm();

  const TOTAL_STEPS = 3;

  const stepProgress = Math.round((currentStep / TOTAL_STEPS) * 100);

  const stepTitles: Record<number, string> = {
    1: 'Tell us about yourself',
    2: 'Tell us about your address',
    3: 'Verify your Aadhaar',
  };

  useEffect(() => {
    form.setFieldsValue({
      phoneNumber: phoneNumber,
      dateOfBirth: dateOfBirth ? dayjs(dateOfBirth, 'DD/MM/YYYY') : undefined,
    });
  }, [phoneNumber, dateOfBirth, form]);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(initialStep);
    }
  }, [isOpen, initialStep]);

  const changeStepForwardHandler = async (step: number) => {
    if (step === TOTAL_STEPS) return;

    try {
      await form.validateFields();

      setCurrentStep(step + 1);
    } catch (error) {}
  };

  const handleAddressSubmit = () => {
    handleExternalVerification();
    setCurrentStep(3);
  };

  return (
    <div>
      <Modal title={null} open={isOpen} closable={false} footer={false} width={500} className="w-500" centered={true}>
        <section className="d-flex align-end justify-space-between p-x-28 p-t-28 p-b-10 kyc-popup-container">
          <div>
            <h3 className="f-19-20-600-secondary">Complete your account</h3>
          </div>
          <div>
            <CloseIcon onClick={() => closePopup(false)} className="icon-24-primary cursor-pointer" size={24} />
          </div>
        </section>
        <Progress
          strokeLinecap={'butt'}
          size={{
            height: 5,
          }}
          className="width-100 kyc-progress-container"
          percent={stepProgress}
          showInfo={false}
        />
        <section className="p-28">
          <div>
            <div className="m-b-32">
              <h5 className="f-13-14-400-secondary">Step {currentStep} of {TOTAL_STEPS}</h5>
              <h2 className="f-17-18-600-secondary p-y-10">
                {stepTitles[currentStep]}
              </h2>
              <h5 className="f-13-20-400-secondary">
                {"We'll"} collect your personal details, address, and verification documents to ensure a secure and
                seamless experience on RareAgora
              </h5>
            </div>
            <Form
              form={form}
              initialValues={{
                phoneNumber,
                dateOfBirth: dateOfBirth ? dayjs(dateOfBirth, 'DD/MM/YYYY') : undefined,
                addressData: addressData,
              }}
            >
              {/* step 1 */}
              <section className={currentStep === 1 ? 'd-block' : 'd-none'}>
                <div className="m-b-16 position-relative kyc-phone-input kyc-input-field">
                  <Form.Item
                    name="phoneNumber"
                    rules={[
                      { required: true, message: 'Enter your phone number' },
                      {
                        validator: async (_, value) => {
                          if (!value) return Promise.reject(new Error(''));
                          const digitsOnly = value.replace(/\D/g, '');
                          const localNumber =
                            digitsOnly.startsWith('91') && digitsOnly.length > 10 ? digitsOnly.slice(2) : digitsOnly;
                          const firstDigit = localNumber.length > 0 ? parseInt(localNumber[0]) : 0;

                          if (firstDigit < 6) {
                            return Promise.reject(new Error('Please enter a valid phone number'));
                          }

                          if (localNumber.length !== 10) {
                            return Promise.reject(new Error('Phone number must be exactly 10 digits'));
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                    validateTrigger={['onChange', 'onBlur']}
                  >
                    <div>
                      <label className="f-14-16-500-primary">Phone number</label>
                      <PhoneInput
                        country={'in'}
                        value={phoneNumber}
                        onChange={(value) => {
                          setPhoneNumber(value);
                          form.setFieldsValue({ phoneNumber: value });
                        }}
                        countryCodeEditable={false}
                        inputProps={{
                          name: 'phoneNumber',
                          required: true,
                          autoFocus: true,
                        }}
                        containerStyle={{ width: '100%' }}
                        inputStyle={{ width: '100%' }}
                        enableSearch={true}
                      />
                    </div>
                  </Form.Item>
                </div>
                <div className="m-b-16 kyc-input-field">
                  <Form.Item name="dateOfBirth" rules={[{ required: true, message: 'Enter your date of birth' }]}>
                    <div className="date-picker-input">
                      <label className="f-14-16-500-primary">Date of birth</label>

                      <DatePicker
                        value={dateOfBirth ? dayjs(dateOfBirth, 'DD/MM/YYYY') : undefined}
                        onChange={(date, dateString) => {
                          setDateOfBirth(typeof dateString === 'string' ? dateString : '');
                          form.setFieldsValue({ dateOfBirth: date });
                        }}
                        getPopupContainer={(trigger) => trigger.parentElement ?? trigger}
                        className="m-y-8 p-y-8 p-x-12 kyc-date-input"
                        placeholder="DD/MM/YYYY"
                        format={'DD/MM/YYYY'}
                        suffixIcon={<CalendarDays className="icon-16-tertiary" size={16} />}
                        disabledDate={(current) => current && current > dayjs().endOf('day')}
                      />
                    </div>
                  </Form.Item>
                  <span className="f-13-20-400-secondary">Date of birth should match National ID</span>
                </div>
                <Button htmlType="button" onClick={() => changeStepForwardHandler(1)}>
                  Continue
                </Button>
              </section>
            </Form>

            {/* step 2 */}
            <KycAddressForm
              currentStep={currentStep}
              handleExternalVerification={handleAddressSubmit}
              addressData={addressData}
              setAddressData={setAddressData}
              closePopup={closePopup}
            />

            {/* step 3 */}
            <section className={currentStep === 3 ? 'd-block' : 'd-none'}>
              <AadhaarOtpForm
                onVerified={() => {
                  if (onAadhaarVerified) onAadhaarVerified();
                  closePopup(false);
                }}
              />
            </section>
          </div>
        </section>
      </Modal>
    </div>
  );
}

