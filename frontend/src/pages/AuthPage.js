import { useState } from 'react';
import { auth, setupRecaptcha } from '../lib/firebase';
import { signInWithPhoneNumber } from 'firebase/auth';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Phone } from 'lucide-react';

const AuthPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;
      const recaptchaVerifier = setupRecaptcha('recaptcha-container');
      
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
      setVerificationId(confirmationResult);
      toast.success('OTP sent to your phone!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await verificationId.confirm(otp);
      toast.success('Phone number verified!');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#CCFBF1] to-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0F766E] rounded-2xl mb-4">
            <span className="text-white font-bold text-3xl">C</span>
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>ConnectKar</h1>
          <p className="text-gray-600">Your Township, Connected.</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {!verificationId ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="tel"
                    data-testid="phone-input"
                    placeholder="Enter your 10-digit mobile number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div id="recaptcha-container"></div>

              <Button
                type="submit"
                data-testid="send-otp-button"
                disabled={loading || phoneNumber.length < 10}
                className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white h-12 rounded-lg font-medium"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                <Input
                  type="text"
                  data-testid="otp-input"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>

              <Button
                type="submit"
                data-testid="verify-otp-button"
                disabled={loading || otp.length !== 6}
                className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white h-12 rounded-lg font-medium"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>

              <button
                type="button"
                data-testid="resend-otp-button"
                onClick={() => setVerificationId(null)}
                className="w-full text-sm text-[#0F766E] hover:underline"
              >
                Change Number
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Only verified township residents can access ConnectKar
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
