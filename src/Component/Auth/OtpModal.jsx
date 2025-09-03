import React, { useState } from 'react';
import { verifyOtp as apiVerify } from '../../Api';
import './OtpModal.css';

const OtpModal = ({ email, onClose, onVerified }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!otp || otp.length < 4) return setError('Enter valid OTP');
    setLoading(true);
    setError('');
    try {
      const { data } = await apiVerify({ email, otp });
      if (data?.success) {
        onVerified();
        onClose();
      } else {
        setError(data?.message || 'Verification failed');
      }
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="OTP verification">
      <div className="otp-modal" onClick={(e) => e.stopPropagation()}>
        <h4>Enter OTP</h4>
        <p>We've sent a 6-digit OTP to <strong>{email}</strong></p>
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="Enter OTP"
          inputMode="numeric"
          maxLength={6}
          aria-label="One time password"
        />
        {error && <p className="otp-error" role="alert">{error}</p>}
        <div className="actions">
          <button className="btn-cancel" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn-verify" onClick={submit} disabled={loading}>{loading ? 'Verifying...' : 'Verify'}</button>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
