import { Button, Form, Input, Modal } from 'antd';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import { useUpdateUserMutation } from '@/redux/apis/user.api';
import { useToast } from '@helpers/notifications/toast.notification';
import './styles.scss';
import { getErrorMessage } from '@helpers/services/get-error-message';

import CancelButton from '../button/cancel-button/cancelButton';

export default function ChangePasswordModal({ handleCancel }: { handleCancel: () => void }) {
  const [form] = Form.useForm();
  const router = useRouter();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const { showErrorToast, showSuccessToast } = useToast();

  const changePasswordHandler = async () => {
    try {
      const values = await form.validateFields();

      await updateUser({
        updatedData: values,
        update_type: 'update_password',
      }).unwrap();
      showSuccessToast('Password updated successfully');
      Cookies.remove('token');
      Cookies.remove('user');
      window.dispatchEvent(new Event('cookieDeleted'));
      router.replace('/');
    } catch (error) {
      showErrorToast(error, getErrorMessage(error));
    }
  };

  return (
    <Modal open={true} footer={null} closable={false} centered className="custom-close">
      <div className="d-flex flex-column p-24 gap-4 radius-8">
        <div className="d-flex flex-column gap-3 h-52 w-392">
          <p className="f-18-20-600-primary w-200 h-22">Change Password</p>
          <p className="f-14-20-400-tertiary font-primaryh-40 w-392 ">
            Set a new password to keep your account secure.
          </p>
        </div>
        <Form form={form} layout="vertical" className="d-flex flex-column gap-2" onFinish={changePasswordHandler}>
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true, message: 'Enter your Current password' }]}
          >
            <Input.Password className="custom-input-blue" placeholder="Enter Current password" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[{ required: true, message: 'Enter new password' }]}
          >
            <Input.Password className="custom-input-blue" placeholder="Enter new password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password className="custom-input-blue" placeholder="Confirm password" />
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
            >
              Change password
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
