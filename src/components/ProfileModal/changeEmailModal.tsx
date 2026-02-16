import { Button, Form, Input, Modal } from 'antd';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import { useToast } from '@helpers/notifications/toast.notification';
import { getErrorMessage } from '@helpers/services/get-error-message';
import { useUpdateUserMutation } from '@redux/apis/user.api';

import './styles.scss';

import CancelButton from '../button/cancel-button/cancelButton';
import { UserDetails } from '../profile/interface';

export default function ChangeEmailModal({
  handleCancel,
  userDetails,
}: {
  handleCancel: () => void;
  userDetails: UserDetails;
}) {
  const [form] = Form.useForm();
  const router = useRouter();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const { showErrorToast, showSuccessToast } = useToast();

  const changeEmailHandler = async () => {
    try {
      const values = await form.validateFields();

      await updateUser({
        updatedData: {
          newEmail: values.email,
          password: values.password,
        },
        update_type: 'update_email',
      }).unwrap();
      showSuccessToast('Email updated successfully');
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
      <div className="d-flex flex-column p-24 gap-6 radius-8">
        <div className="d-flex flex-column gap-3 h-72 w-392">
          <p className="f-18-20-600-primary">Change Email Address</p>
          <p className="f-14-20-400-tertiary font-primary">
            Once you&apos;ve updated your email, all future communication and notifications will be sent to your new
            address.
          </p>
        </div>
        <div className="d-flex flex-column gap-1">
          <span className="f-14-20-400-tertiary">Current Email address</span>
          <p className="f-16-20-600-primary">{userDetails?.email}</p>
        </div>
        <div className="w-392 border-primary-1"></div>
        <Form form={form} layout="vertical" onFinish={changeEmailHandler}>
          <Form.Item
            name="email"
            label="New Email address"
            rules={[
              { required: true, message: 'Enter valid email' },
              { type: 'email', message: 'Please enter a valid email address' },
            ]}
          >
            <Input placeholder="Enter email address" type="email" />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Enter your password' }]}>
            <Input.Password placeholder="Enter password" />
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
              Change email address
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
