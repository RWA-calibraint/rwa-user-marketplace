import { Modal, Form, Input, Divider } from 'antd';
import { useEffect, useState } from 'react';

import './styles.scss';

import { PasswordModalProps } from '@components/AuthModal/AuthModal.interface';
import Button from '@components/button/button';
import { useToast } from '@helpers/notifications/toast.notification';
import { getErrorMessage } from '@helpers/services/get-error-message';
import { useConfirmSignupMutation, useForgetPasswordMutation, useResetPasswordMutation } from '@redux/apis/auth.api';

export default function PasswordModal({ isOpen, email, setEmail, type, setModalType }: PasswordModalProps) {
  const timerValue = 60;
  const [form] = Form.useForm();
  const [forgotPassword, { isLoading: forgotLoading }] = useForgetPasswordMutation();
  const [resetPassword, { isLoading: resetLoading }] = useResetPasswordMutation();
  const [confirmSignup] = useConfirmSignupMutation();
  const [timer, setTimer] = useState(timerValue);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const { showErrorToast, showSuccessToast } = useToast();

  const onClose = () => {
    setModalType(null);
  };
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (values: any) => {
    try {
      if (type === 'forgot') {
        await forgotPassword(values).unwrap();
        setEmail(values.email);
        setModalType('reset');
        showSuccessToast('Verification code sent to your email');
      } else if (type === 'confirmSignup') {
        values['email'] = email;
        await confirmSignup(values).unwrap();
        setModalType('login');
        showSuccessToast('Account created successfully');
      } else {
        values['email'] = email;
        await resetPassword(values).unwrap();
        setModalType('login');
        showSuccessToast('Password reset successfully');
      }
      form.resetFields();
    } catch (error) {
      showErrorToast(error, getErrorMessage(error));
    }
  };

  useEffect(() => {
    if (timer > 0 && (type === 'reset' || type === 'confirmSignup')) {
      setIsResendDisabled(true);
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer, type]);

  const handleResendClick = async () => {
    if (isResendDisabled) return;
    setIsResendDisabled(true);
    setTimer(60);
    const formData = {
      email,
    };

    try {
      await forgotPassword(formData);
      showSuccessToast('Verification code has been sent to your email');
    } catch (error) {
      showErrorToast(error, getErrorMessage(error));
    }
  };

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} centered className="custom-close">
      <div className="d-flex justify-center">
        <p className="modal-header">Sign in or create an account</p>
      </div>
      <Divider className="m-0" />
      <div className="password-modal">
        <h2>
          {type === 'forgot' ? 'Forgot Password?' : type === 'reset' ? 'Reset Password' : 'Verify Your Email Address'}
        </h2>
        <p>
          {type === 'forgot'
            ? 'Don’t worry, you can regain access in just a few steps.'
            : 'We have just sent a verification code to your email.Please enter the verification code and set your new password'}
        </p>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {type === 'reset' || type === 'confirmSignup' ? (
            <>
              <Form.Item
                name="confirmationCode"
                label="Verification Code"
                rules={[{ required: true, message: 'Enter the verification code' }]}
              >
                <Input className="form-input" placeholder="Enter code" />
              </Form.Item>

              <div className="verify-block">
                {timer > 0 && (
                  <span>
                    <span className="footer-text">Time Remaining:</span>{' '}
                    <span className="footer-text" style={{ fontWeight: 'bold', marginLeft: '5px' }}>
                      0:{timer < 10 ? `0${timer}` : timer}
                    </span>
                  </span>
                )}
                <span
                  className={`btn-signin ${isResendDisabled ? 'disabled' : ''}`}
                  onClick={!isResendDisabled ? handleResendClick : undefined}
                  style={{ cursor: isResendDisabled ? 'not-allowed' : 'pointer', opacity: isResendDisabled ? 0.5 : 1 }}
                >
                  Resend Code
                </span>
              </div>

              {type === 'reset' && (
                <Form.Item
                  name="password"
                  label="New Password"
                  dependencies={['confirmationCode']}
                  rules={[{ required: true, message: 'Enter new password' }]}
                >
                  <Input.Password className="form-input" placeholder="Confirm new password" />
                </Form.Item>
              )}
            </>
          ) : (
            <Form.Item
              name="email"
              label="Email address"
              rules={[{ required: true, type: 'email', message: 'Please enter your email' }]}
            >
              <Input className="form-input" placeholder="Enter your email" />
            </Form.Item>
          )}

          <Button loading={forgotLoading || resetLoading} className="h-44 m-t-16">
            {type === 'forgot' ? 'Continue' : type === 'reset' ? 'Reset Password' : 'Verify Email'}
          </Button>
          {type == 'forgot' && (
            <div className="login-switch text-center">
              Remember your password?
              <span className="m-l-4" onClick={() => setModalType('login')}>
                Back to sign in
              </span>
            </div>
          )}
        </Form>
      </div>
    </Modal>
  );
}
