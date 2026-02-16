import { Button, Form, Input, Modal } from 'antd';
import Cookies from 'js-cookie';
import PhoneInput from 'react-phone-input-2';

import { useUpdateUserMutation } from '@/redux/apis/user.api';
import { useToast } from '@helpers/notifications/toast.notification';
import './styles.scss';
import { getErrorMessage } from '@helpers/services/get-error-message';

import CancelButton from '../button/cancel-button/cancelButton';

import 'react-phone-input-2/lib/style.css';

export default function ChangePhoneNumberModal({ handleCancel }: { handleCancel: () => void }) {
  const [form] = Form.useForm();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const { showErrorToast, showSuccessToast } = useToast();

  const changePhoneNumberHandler = async () => {
    try {
      const values = await form.validateFields();

      const userDetail = await updateUser({
        updatedData: values,
        update_type: 'update_phone_number',
      }).unwrap();

      showSuccessToast('Phone number updated successfully');
      Cookies.set('user', JSON.stringify(userDetail?.response ?? {}));
      window.dispatchEvent(new Event('cookieChange'));
      window.location.reload();
    } catch (error) {
      showErrorToast(error, getErrorMessage(error));
    }
  };

  return (
    <Modal open={true} footer={null} centered className="custom-close" closable={false}>
      <div className="d-flex flex-column p-24 gap-6 radius-8">
        <div className="d-flex flex-column gap-3 h-72 w-392">
          <p className="f-18-20-600-primary w-200 h-22">Change Phone Number</p>
          <p className="f-14-20-400-tertiary font-primary h-40 w-392 ">
            Your new phone number will be used for all future communications.
          </p>
        </div>
        <Form form={form} layout="vertical" className="custom-form" onFinish={changePhoneNumberHandler}>
          <Form.Item
            name="phoneNumber"
            label="New Phone Number"
            rules={[
              { required: true, message: 'Enter your phone number' },
              {
                validator: async (_, value) => {
                  if (!value) return Promise.reject(new Error(''));
                  const digitsOnly = value.replace(/\D/g, '');
                  const localNumber =
                    digitsOnly.startsWith('91') && digitsOnly.length > 10 ? digitsOnly.slice(2) : digitsOnly;

                  if (localNumber && parseInt(value.slice(4)[0]) <= 5) {
                    return Promise.reject(new Error('Please enter a valid phone number'));
                  }
                  if (localNumber.length !== 10) {
                    return Promise.reject(new Error('Phone number must be exactly 10 digits'));
                  }

                  return Promise.resolve();
                },
              },
            ]}
            validateTrigger={['onSubmit']}
          >
            <div className="custom-phone-input">
              <PhoneInput
                country={'in'}
                inputProps={{
                  required: true,
                  autoFocus: false,
                  maxLength: 15,
                }}
                containerClass="phone-input-container"
                inputClass="phone-input"
                buttonClass="phone-input-button"
                dropdownClass="phone-input-dropdown"
                countryCodeEditable={false}
              />
            </div>
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Enter your password' }]}>
            <Input.Password className="custom-input" placeholder="Enter password" />
          </Form.Item>
          <div className="d-flex justify-flex-end gap-2">
            <CancelButton
              className="radius-6 border-primary-1 f-14-24-500-primary cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </CancelButton>
            <Button
              type="primary"
              htmlType="submit"
              className="change-profile-settings f-14-24-500-white-primary custom-btn"
              loading={isLoading}
              autoFocus={true}
            >
              Change phone number
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
