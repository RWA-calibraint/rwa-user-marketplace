'use client';

import { Divider, Form, Input, Modal } from 'antd';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Button from '@/components/button/button';
import { useToast } from '@/helpers/notifications/toast.notification';
import { getErrorMessage } from '@/helpers/services/get-error-message';
import { useUrlSearchParams } from '@/hooks/useUrlSearchParams';
import { useLazyGetUserDetailsQuery } from '@/redux/apis/user.api';
import { AuthModalProps } from '@components/AuthModal/AuthModal.interface';
import { useLazySocialSigninQuery, useSigninMutation, useSignupMutation } from '@redux/apis/auth.api';
import './styles.scss';

export default function AuthModal({ isOpen, type, setEmail, setModalType, setOpen }: Readonly<AuthModalProps>) {
  const { deleteSearchParams } = useUrlSearchParams();
  const router = useRouter();

  const [triggerSocialSignin] = useLazySocialSigninQuery();

  const [getUserDetail] = useLazyGetUserDetailsQuery();

  const [form] = Form.useForm();

  const [signup, { isLoading: signUpLoading }] = useSignupMutation();
  const [signin, { isLoading: signinLoading }] = useSigninMutation();

  const { showSuccessToast, showErrorToast } = useToast();

  const onClose = () => {
    deleteSearchParams(['login-required']);
    setModalType(null);
  };

  const handleSubmit = async (values: unknown) => {
    try {
      if (type === 'register') {
        await signup(values).unwrap();
        setEmail((values as { email: string }).email);
        setModalType('confirmSignup');
        showSuccessToast('Verification code sent to your email');
      } else {
        setOpen(false);
        onClose();
        await signin(values).unwrap();
        const userDetail = await getUserDetail({}).unwrap();

        Cookies.set('user', JSON.stringify(userDetail?.response ?? {}));
        setModalType(null);
        router.push('/');
        window.dispatchEvent(new Event('cookieChange'));
        window.dispatchEvent(new Event('userAdded'));
        showSuccessToast('Logged in successfully');
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

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} centered className="custom-close">
      <div className="d-flex justify-center">
        <p className="modal-header">Sign in or create an account</p>
      </div>
      <Divider className="m-0" />
      <div className="signup-modal">
        <div>
          <h2>Welcome to RareAgora</h2>
          <p>Continue with</p>
        </div>
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
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.reject(new Error('Enter first name'));

                        if (value.length < 3) {
                          return Promise.reject(new Error('Requires minimum 3 characters'));
                        }
                        const pattern = /^[A-Za-z][A-Za-z0-9\s]*$/;

                        if (!pattern.test(value)) {
                          return Promise.reject(new Error('Invalid name'));
                        }

                        return Promise.resolve();
                      },
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

            <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Enter your password' }]}>
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
    </Modal>
  );
}
