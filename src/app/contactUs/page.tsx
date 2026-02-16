'use client';
import { Button, Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Mail } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { useToast } from '@helpers/notifications/toast.notification';
import { getErrorMessage } from '@helpers/services/get-error-message';
import { useSendContactEmailMutation } from '@redux/apis/user.api';
import './styles.scss';

const ContactUs = () => {
  const [form] = Form.useForm();
  const { showErrorToast, showSuccessToast } = useToast();
  const [sendContactEmail, { isLoading }] = useSendContactEmailMutation({});

  const submitHandler = async () => {
    const { name, email, help, phoneNumber } = form.getFieldsValue();

    if (name && email && help) {
      try {
        await sendContactEmail({
          name,
          email,
          help,
          phoneNumber,
        }).unwrap();
        showSuccessToast('Thank you for contacting us. Our team will contact you soon.');
        form.resetFields();
      } catch (error) {
        showErrorToast(error, getErrorMessage(error));
      }
    } else {
      showErrorToast(undefined, 'All field required');
    }
  };

  return (
    <div className="d-flex p-x-100 p-y-80 gap-25 justify-center">
      <div className="d-flex w-550 flex-column gap-6">
        <p className="f-36-40-600-primary">We&apos;d love to hear from you!</p>
        <p className="f-16-26-400-tertiary">
          Reach out to us for inquiries, support, or partnership opportunities. We&apos;re here to assist you!
        </p>
        <div className="d-flex gap-3">
          <div className="d-flex align-center justify-center p-12 gap-4 radius-6 w-50 h-50 bg-brand">
            <Mail className="icon-2-brand" width={20} height={20} />
          </div>
          <div>
            <p className="f-13-20-400-tertiary">Email</p>
            <p className="f-16-20-500-secondary">support@rareagora.com</p>
          </div>
        </div>
      </div>

      <div className="w-550 d-flex flex-column gap-3">
        <Form form={form} layout="vertical" className="custom-form" onFinish={submitHandler}>
          <Form.Item
            name="name"
            label={
              <span>
                Name <span className="f-14-16-500-status-red">*</span>
              </span>
            }
            rules={[
              { required: true, message: 'Enter valid name' },
              { min: 3, message: 'Name must be at least 3 characters' },
              {
                pattern: /^[A-Za-z][A-Za-z\s]*$/,
                message: 'Last name should start with a letter and contain only letters and spaces',
              },
            ]}
          >
            <Input className="custom-input" placeholder="Your name" />
          </Form.Item>
          <Form.Item
            name="email"
            label={
              <span>
                Email address <span className="f-14-16-500-status-red">*</span>
              </span>
            }
            rules={[{ required: true, type: 'email', message: 'Enter vail email' }]}
          >
            <Input className="custom-input" placeholder="alex@example.com" />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone number (optional)"
            rules={[
              { required: false },
              {
                validator: async (_, value) => {
                  if (!value) return Promise.resolve();
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
            validateTrigger={['onSubmit', 'onChange']}
          >
            <div className="custom-phone-input">
              <PhoneInput
                country={'in'}
                countryCodeEditable={false}
                containerClass="phone-input-container"
                inputClass="phone-input"
                inputProps={{
                  maxLength: 15,
                }}
              />
            </div>
          </Form.Item>

          <Form.Item
            name="help"
            label={
              <span>
                How can we help? <span className="f-14-16-500-status-red">*</span>
              </span>
            }
            rules={[{ required: true, message: 'This field is required' }]}
          >
            <TextArea rows={4} placeholder="Type here" className="custom-textarea" />
          </Form.Item>
          <Button size="large" htmlType="submit" className="width-100" type="primary" loading={isLoading}>
            Send message
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ContactUs;
