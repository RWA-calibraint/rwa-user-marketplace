'use client';

import { Button, Col, Form, Input, InputRef, Row } from 'antd';
import { Pencil } from 'lucide-react';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import PhoneInput from 'react-phone-input-2';

import ChangeEmailModal from '@/components/ProfileModal/changeEmailModal';
import ChangePasswordModal from '@/components/ProfileModal/changePasswordModal';
import ChangePhoneNumberModal from '@/components/ProfileModal/changePhoneNumberModal';
import { ERROR_MESSAGE } from '@/helpers/constants/error-message';
import { useToast } from '@/helpers/notifications/toast.notification';

import { ProfileProps } from './interface';
import 'react-phone-input-2/lib/style.css';

const ProfileDetails = ({ isLoading, handleSave, userDetails, setImageFile, imageFile }: ProfileProps) => {
  const { showErrorToast } = useToast();
  const emailRef = useRef<InputRef>(null);
  const passwordRef = useRef<InputRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeModal, setActiveModal] = useState<'email' | 'password' | 'phone' | null>(null);
  const [hovering, setHovering] = useState<boolean>(false);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (file) {
      if (allowedTypes.includes(file.type)) {
        setImageFile(file);
      } else {
        showErrorToast(ERROR_MESSAGE.PROFILE_TYPE, 'Failed to upload file');
      }
    }
  };

  const handleOpenModal = (type: 'email' | 'password' | 'phone') => {
    setActiveModal(type);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="d-flex flex-column gap-10">
      <div className="d-flex w-606 h-80 gap-4">
        <div
          className="position-relative cursor-pointer"
          style={{ width: 80, height: 80 }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onClick={handleImageClick}
        >
          <Image
            src={
              imageFile
                ? URL.createObjectURL(imageFile)
                : userDetails?.profilePic
                  ? userDetails?.profilePic
                  : '/profile.svg'
            }
            alt="Profile"
            width={80}
            height={80}
            className="radius-100 border-primary-1 object-cover"
            style={{ width: '100%', height: '100%' }}
          />

          {hovering && (
            <div
              className="position-absolute d-flex justify-center align-center top-0 left-0 width-100 height-100 radius-100"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
              <Pencil size={20} className="icon-20-white" />
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept="image/*"
          />
        </div>
        <div className="d-flex flex-column justify-center gap-2 w-184 h-55">
          <p className="f-24-26-600-primary">
            {userDetails?.firstName} {userDetails?.lastName}
          </p>
          <p className="f-14-20-400-tertiary">{userDetails?.email}</p>
        </div>
      </div>
      <div className="d-flex flex-column gap-2">
        <div className="name-fields">
          <Row style={{ gap: '16px' }}>
            <Col span={12} style={{ flex: 1 }}>
              <Form.Item
                name="firstName"
                label={
                  <span>
                    First name <span className="f-14-16-500-status-red">*</span>
                  </span>
                }
                rules={[
                  { required: true, message: 'Enter first name' },
                  {
                    pattern: /^[A-Za-z][A-Za-z0-9\s]*$/,
                    message: 'First name should contains only alphanumeric characters',
                  },
                  {
                    pattern: /^(?!\s+$).*/,
                    message: 'First name cannot be empty or only spaces',
                  },
                ]}
              >
                <Input className="form-input" placeholder="John" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                label={
                  <span>
                    Last name <span className="f-14-16-500-status-red">*</span>
                  </span>
                }
                rules={[
                  { required: true, message: 'Enter last name' },
                  {
                    pattern: /^[A-Za-z][A-Za-z0-9\s]*$/,
                    message: 'Last name should contains only alphanumeric characters',
                  },
                  {
                    pattern: /^(?!\s+$).*/,
                    message: 'Last name cannot be empty or only spaces',
                  },
                ]}
              >
                <Input className="form-input" placeholder="Doe" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <Form.Item
          name="email"
          label={
            <span>
              Email address <span className="f-14-16-500-status-red">*</span>
            </span>
          }
          rules={[{ required: true, type: 'email', message: 'Enter valid email' }]}
        >
          <Input ref={emailRef} className="form-input" placeholder="john.doe@example.com" disabled />
        </Form.Item>
        <div className="login-switch text-left">
          <span onClick={() => handleOpenModal('email')}>Change</span>
        </div>

        <Form.Item
          name="password"
          label={
            <span>
              Password <span className="f-14-16-500-status-red">*</span>
            </span>
          }
          rules={[{ required: true, message: 'Enter your password' }]}
        >
          <Input.Password ref={passwordRef} className="form-input" placeholder="••••••••" disabled />
        </Form.Item>
        <div className="login-switch text-left">
          <span onClick={() => handleOpenModal('password')}>Change</span>
        </div>

        <Form.Item
          name="phoneNumber"
          label={
            <span>
              Phone number <span className="f-14-16-500-status-red">*</span>
            </span>
          }
          rules={[{ required: true, message: 'Enter your phone number' }]}
        >
          <div className="custom-phone-input">
            <PhoneInput
              country={'in'}
              inputProps={{
                required: true,
                autoFocus: false,
                disabled: true,
                name: 'phoneNumber',
              }}
              value={userDetails?.phoneNumber}
              containerClass="phone-input-container"
              inputClass="phone-input"
              buttonClass="phone-input-button"
              dropdownClass="phone-input-dropdown"
            />
          </div>
        </Form.Item>
        <div className="login-switch text-left">
          <span onClick={() => handleOpenModal('phone')}>Change</span>
        </div>
      </div>
      <div className="save-btn h-44">
        <Button
          type="primary"
          loading={isLoading}
          className="h-44 radius-6 p-x-16 p-y-8 gap-2 custom-btn m-b-0"
          onClick={handleSave}
          style={{ width: '100px' }}
        >
          Save
        </Button>
      </div>

      {activeModal === 'email' && <ChangeEmailModal handleCancel={handleCloseModal} userDetails={userDetails} />}
      {activeModal === 'phone' && <ChangePhoneNumberModal handleCancel={handleCloseModal} />}
      {activeModal === 'password' && <ChangePasswordModal handleCancel={handleCloseModal} />}
    </div>
  );
};

export default ProfileDetails;
