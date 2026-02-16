'use client';

import { Drawer, Input, Form } from 'antd';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import './styles.scss';

import { useToast } from '@/helpers/notifications/toast.notification';
import { getErrorMessage } from '@/helpers/services/get-error-message';
import {
  useConfirmSignupMutation,
  useForgetPasswordMutation,
  useLazySocialSigninQuery,
  useResetPasswordMutation,
  useSigninMutation,
  useSignupMutation,
} from '@/redux/apis/auth.api';
import { useLazyGetUserDetailsQuery } from '@/redux/apis/user.api';

import Button from '../button/button';

import { AuthModalFormProps } from './AuthModal.interface';

export const AuthDrawer = ({
  open,
  type,
  setEmail,
  setModalType,
  email,
  showDrawer,
  onClose,
}: Readonly<AuthModalFormProps>) => {
  const timerValue = 60;
  const [forgotPassword, { isLoading: forgotLoading }] = useForgetPasswordMutation();
  const [resetPassword, { isLoading: resetLoading }] = useResetPasswordMutation();
  const [confirmSignup] = useConfirmSignupMutation();
  const [timer, setTimer] = useState(timerValue);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const [triggerSocialSignin] = useLazySocialSigninQuery();

  const [getUserDetail] = useLazyGetUserDetailsQuery();

  const [form] = Form.useForm();

  const [signup, { isLoading: signUpLoading }] = useSignupMutation();
  const [signin, { isLoading: signinLoading }] = useSigninMutation();

  const { showSuccessToast, showErrorToast } = useToast();

  const handleSubmit = async (values: unknown) => {
    try {
      if (type === 'register') {
        await signup(values).unwrap();
        setEmail((values as { email: string }).email);
        setModalType('confirmSignup');
        showSuccessToast('Verification code sent to your email');
      } else {
        onClose?.();
        await signin(values).unwrap();
        const userDetail = await getUserDetail({}).unwrap();

        Cookies.set('user', JSON.stringify(userDetail?.response ?? {}));
        setModalType(null);
        window.dispatchEvent(new Event('cookieChange'));
        showSuccessToast('Logged in successfully');
      }
      form.resetFields();
    } catch (error) {
      showErrorToast(error, getErrorMessage(error));
    }
  };

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePasswordSubmit = async (values: any) => {
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

  const onSocialSignin = async () => {
    const result = await triggerSocialSignin({}).unwrap();

    window.location.href = result?.response?.url;
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
    <>
      <Button onClick={showDrawer}>Sign in</Button>
      <Drawer
        title="Sign in or create an account"
        placement="bottom"
        closable
        onClose={onClose}
        open={open}
        className="drawer"
        height="auto"
      >
        {type === 'register' || type === 'login' ? (
          <div className="signup-modal">
            <h2>Welcome to RareAgora</h2>
            <p>Continue with</p>
            <div className="social-login">
              <div>
                <div className="social-btn" onClick={onSocialSignin}>
                  <Image src="/google.svg" alt="Google" width={24} height={24} />
                  <span className="m-l-12">Continue with Google</span>
                </div>
              </div>

              <p className="or-divider">or</p>

              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                {type === 'register' && (
                  <div className="name-fields">
                    <Form.Item
                      name="firstName"
                      label="First name"
                      style={{ flex: 1 }}
                      rules={[
                        { required: true, message: 'Enter first name' },
                        { min: 3, message: 'Invalid name' },
                        {
                          pattern: /^[A-Za-z][A-Za-z0-9\s]*$/,
                          message: 'Invalid name',
                        },
                      ]}
                    >
                      <Input className="form-input" placeholder="Enter First name" />
                    </Form.Item>

                    <Form.Item
                      name="lastName"
                      label="Last name"
                      style={{ flex: 1 }}
                      rules={[
                        { required: true, message: 'Enter last name' },
                        {
                          pattern: /^[A-Za-z][A-Za-z0-9\s]*$/,
                          message: 'Invalid name',
                        },
                      ]}
                    >
                      <Input className="form-input" placeholder="Enter Last name" />
                    </Form.Item>
                  </div>
                )}

                <Form.Item
                  name="email"
                  label="Email address"
                  rules={[{ required: true, type: 'email', message: 'Enter valid email' }]}
                >
                  <Input className="form-input custom-input" placeholder="Enter email address" />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, message: 'Enter your password' }]}
                >
                  <Input.Password className="form-input custom-input" placeholder="Enter password" />
                </Form.Item>

                {type === 'login' && (
                  <div className="login-switch text-right">
                    <span onClick={() => setModalType('forgot')}>{'Forgot password?'}</span>
                  </div>
                )}

                <Button loading={signUpLoading || signinLoading} className="h-44 m-t-24 m-b-0">
                  {type === 'register' ? 'Create account' : 'Sign in'}
                </Button>
              </Form>
            </div>

            {type === 'register' ? (
              <>
                <div className="login-switch text-center">
                  Already have an account?
                  <span className="m-l-4" onClick={() => setModalType('login')}>
                    Sign in
                  </span>
                </div>

                <p className="terms">
                  By proceeding, you agree to the <a href="/terms?target=buyer">Terms of Service</a> and
                  <a href="/policy?target=privacy">Privacy Policy</a>.
                </p>
              </>
            ) : (
              <>
                <div className="login-switch terms">
                  {"Don't have an account?"}
                  <span onClick={() => setModalType('register')} className="m-l-4">
                    Create an account
                  </span>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="password-modal">
            <h2>
              {type === 'forgot'
                ? 'Forgot Password?'
                : type === 'reset'
                  ? 'Reset Password'
                  : 'Verify Your Email Address'}
            </h2>
            <p>
              {type === 'forgot'
                ? 'Don’t worry, you can regain access in just a few steps.'
                : 'We have just sent a verification code to your email.Please enter the verification code and set your new password'}
            </p>
            <Form form={form} layout="vertical" onFinish={handlePasswordSubmit}>
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
                      style={{
                        cursor: isResendDisabled ? 'not-allowed' : 'pointer',
                        opacity: isResendDisabled ? 0.5 : 1,
                      }}
                    >
                      Resend Code
                    </span>
                  </div>

                  {type === 'reset' && (
                    <Form.Item
                      name="password"
                      label="New Password"
                      dependencies={['confirmationCode']}
                      rules={[{ required: true, message: 'Confirm your password' }]}
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
        )}
      </Drawer>
    </>
  );
};
