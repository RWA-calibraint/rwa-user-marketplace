import { message } from 'antd';
import { CheckCircle } from 'lucide-react';
import React, { useState } from 'react';

import { useAadhaarGenerateOtpMutation, useAadhaarVerifyOtpMutation } from '@/redux/apis/user.api';

import Button from '../button/button';

interface AadhaarOtpFormProps {
  onVerified?: () => void;
}

export default function AadhaarOtpForm({ onVerified }: AadhaarOtpFormProps) {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  const [generateOtp, { isLoading: isGenerating }] = useAadhaarGenerateOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useAadhaarVerifyOtpMutation();

  const handleGenerateOtp = async () => {
    setError('');

    if (!/^\d{12}$/.test(aadhaarNumber)) {
      setError('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    try {
      const result = await generateOtp({
        aadhaarNumber,
        reason: 'KYC verification for RareAgora marketplace',
      }).unwrap();

      setReferenceId(result.response.referenceId);
      setOtpSent(true);
      message.success('OTP sent to your Aadhaar-linked mobile number');
    } catch (err: any) {
      const errMsg = err?.data?.message || err?.message || 'Failed to generate OTP';
      setError(errMsg);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');

    if (!otp || otp.length < 4) {
      setError('Please enter a valid OTP');
      return;
    }

    try {
      await verifyOtp({
        referenceId,
        otp,
      }).unwrap();

      setVerified(true);
      message.success('Aadhaar verified successfully!');

      if (onVerified) {
        setTimeout(() => onVerified(), 1500);
      }
    } catch (err: any) {
      const errMsg = err?.data?.message || err?.message || 'Failed to verify OTP';
      setError(errMsg);
    }
  };

  if (verified) {
    return (
      <div className="d-flex flex-column align-center justify-center p-y-32">
        <CheckCircle size={48} color="#52c41a" />
        <h3 className="f-17-18-600-secondary m-t-16">Aadhaar Verified!</h3>
        <p className="f-13-20-400-secondary m-t-8">Your identity has been verified successfully.</p>
      </div>
    );
  }

  return (
    <div>
      {!otpSent ? (
        <div>
          <div className="m-b-16 kyc-input-field">
            <label className="f-14-16-500-primary">Aadhaar Number</label>
            <input
              type="text"
              className="m-y-8 p-y-8 p-x-12 kyc-date-input width-100"
              placeholder="Enter 12-digit Aadhaar number"
              value={aadhaarNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                setAadhaarNumber(val);
              }}
              maxLength={12}
              style={{
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
            <span className="f-13-20-400-secondary">
              Enter the Aadhaar number linked to your mobile for OTP verification
            </span>
          </div>
          {error && <p style={{ color: '#ff4d4f', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
          <Button htmlType="button" onClick={handleGenerateOtp} disabled={isGenerating || aadhaarNumber.length !== 12}>
            {isGenerating ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        </div>
      ) : (
        <div>
          <div className="m-b-16 kyc-input-field">
            <label className="f-14-16-500-primary">Enter OTP</label>
            <input
              type="text"
              className="m-y-8 p-y-8 p-x-12 kyc-date-input width-100"
              placeholder="Enter OTP sent to your mobile"
              value={otp}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtp(val);
              }}
              maxLength={6}
              style={{
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
            <span className="f-13-20-400-secondary">Enter the OTP sent to your Aadhaar-linked mobile</span>
          </div>
          {error && <p style={{ color: '#ff4d4f', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
          <div className="d-flex gap-12">
            <Button htmlType="button" onClick={handleVerifyOtp} disabled={isVerifying || otp.length < 4}>
              {isVerifying ? 'Verifying...' : 'Verify OTP'}
            </Button>
            <button
              type="button"
              onClick={handleGenerateOtp}
              disabled={isGenerating}
              style={{
                background: 'none',
                border: 'none',
                color: '#1677ff',
                cursor: 'pointer',
                fontSize: '14px',
                padding: '8px 12px',
              }}
            >
              Resend OTP
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
