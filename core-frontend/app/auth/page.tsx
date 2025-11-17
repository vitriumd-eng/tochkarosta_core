/**
 * Auth Pages (Port 7001) - Registration and Login
 */
'use client'

import { useState } from 'react'

export default function AuthPage() {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'phone' | 'verify'>('phone')

  const handleSendCode = async () => {
    // TODO: Implement API call to /api/auth/send-code
    setStep('verify')
  }

  const handleVerifyCode = async () => {
    // TODO: Implement API call to /api/auth/verify
    // Store tokens and redirect to dashboard
  }

  return (
    <div>
      <h1>Authentication</h1>
      {step === 'phone' ? (
        <div>
          <input
            type="tel"
            placeholder="+1234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button onClick={handleSendCode}>Send Code</button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button onClick={handleVerifyCode}>Verify</button>
        </div>
      )}
    </div>
  )
}



