import { message } from 'antd';
import { ExternalLink } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

import { KYC_STATUS } from '@/helpers/constants/user-status';
import {
  useDiditCreateSessionMutation,
  useLazyDiditGetDecisionQuery,
  useLazyGetUserDetailsQuery,
} from '@/redux/apis/user.api';

import Button from '../button/button';

interface DiditKycFormProps {
  onVerified?: () => void;
}

export default function DiditKycForm({ onVerified }: DiditKycFormProps) {
  const [sessionId, setSessionId] = useState('');
  const [verificationUrl, setVerificationUrl] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const [createSession, { isLoading: isCreating }] = useDiditCreateSessionMutation();
  const [getDecision] = useLazyDiditGetDecisionQuery();
  const [fetchUserDetails] = useLazyGetUserDetailsQuery();

  const handleStartVerification = async () => {
    setError('');
    // Open a blank window immediately to bypass popup blockers (must be synchronous with user click)
    const newWindow = window.open('about:blank', '_blank');

    try {
      const result = await createSession().unwrap();
      const url = result.response?.url;
      const sid = result.response?.sessionId;

      if (!url || !newWindow) {
        if (newWindow) newWindow.close();
        throw new Error('Could not prepare verification window. Please allow popups.');
      }

      setSessionId(sid);
      setVerificationUrl(url);

      // Redirect the blank window to the actual Didit URL
      newWindow.location.href = url;

      setIsVerifying(true);
      message.info('Verification window opened. Please complete the process there.');
    } catch (err: unknown) {
      if (newWindow) newWindow.close();

      const errorObj = err as { data?: { message?: string }; message?: string };
      const errMsg = errorObj?.data?.message || errorObj?.message || 'Failed to start verification';

      setError(errMsg);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isVerifying && sessionId) {
      // Start polling every 5 seconds
      interval = setInterval(() => {
        handleCheckStatus();
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVerifying, sessionId]);

  const handleCheckStatus = useCallback(
    async (showMessages = false) => {
      if (!sessionId) return;

      try {
        const result = await getDecision({ sessionId }).unwrap();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decision = (result as any).response;

        if (decision?.status === 'Approved') {
          if (showMessages) message.success('Verification successful!');

          if (onVerified) onVerified();
        } else if (decision?.status === 'Declined') {
          setError('Verification declined. Please try again or contact support.');
          setIsVerifying(false);
        } else {
          // Still pending
          const userResult = await fetchUserDetails({}).unwrap();

          if (userResult.kycVerificationStatus === KYC_STATUS.VERIFIED) {
            if (showMessages) message.success('Verification successful!');

            if (onVerified) onVerified();
          } else if (showMessages) {
            message.warning('Verification is still in progress. Please complete it in the opened window.');
          }
        }
      } catch (error: unknown) {
        // eslint-disable-next-line no-console
        console.log(error);
        // If decision API fails or 404, just check user detail as fallback
        const userResult = await fetchUserDetails({}).unwrap();

        if (userResult.kycVerificationStatus === KYC_STATUS.VERIFIED) {
          if (showMessages) message.success('Verification successful!');

          if (onVerified) onVerified();
        } else if (showMessages) {
          message.error('Could not verify status. Please make sure you completed the process.');
        }
      }
    },
    [sessionId, getDecision, onVerified, fetchUserDetails],
  );

  return (
    <div className="p-y-16">
      {!isVerifying ? (
        <div className="text-center">
          <p className="f-14-20-400-secondary m-b-24">
            We use Didit for secure identity verification. Click the button below to start.
          </p>
          {error && (
            <p className="m-b-16" style={{ color: '#ff4d4f' }}>
              {error}
            </p>
          )}
          <Button
            htmlType="button"
            onClick={handleStartVerification}
            disabled={isCreating}
            className="d-flex align-center justify-center gap-8 width-100"
          >
            {isCreating ? (
              'Preparing...'
            ) : (
              <>
                Verify with Didit <ExternalLink size={16} />
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <div className="m-b-24">
            <div className="spinner m-b-16" />
            <h3 className="f-16-18-600-secondary">Verification in progress</h3>
            <p className="f-13-20-400-secondary m-t-8">
              Please complete the verification in the new window. This page will automatically update once you&apos;re
              done.
            </p>
          </div>

          {error && (
            <p className="m-b-16" style={{ color: '#ff4d4f' }}>
              {error}
            </p>
          )}

          <div className="d-flex flex-column gap-12">
            <button
              type="button"
              onClick={() => window.open(verificationUrl, '_blank')}
              style={{
                background: 'none',
                border: 'none',
                color: '#1677ff',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Re-open verification link
            </button>
            <p className="f-12-16-400-secondary m-t-8" style={{ opacity: 0.7 }}>
              Polling for status update...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
