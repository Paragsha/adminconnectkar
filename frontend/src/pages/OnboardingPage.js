import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { createUserProfile, getUserProfile } from '../lib/firestore';

const societies = [
  'Aqualily Estate',
  'Nova Apartments',
  'Iris Court',
  'Happinest Apartments',
  'Lakewoods Apartments',
  'Sylvan County'
];

const OnboardingPage = () => {
  const { user, setUserProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: user?.phoneNumber || '',
    society_name: '',
    block_tower: '',
    flat_number: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createUserProfile(user.uid, {
        ...formData
      });
      
      // Fetch updated profile
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
      
      toast.success('Profile submitted for verification!');
      navigate('/');
    } catch (error) {
      console.error('Error submitting onboarding:', error);
      toast.error('Failed to submit profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#CCFBF1] to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>Verify Your Residence</h1>
          <p className="text-gray-600">Complete your profile to access ConnectKar</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                data-testid="full-name-input"
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone_number">Phone Number *</Label>
              <Input
                id="phone_number"
                data-testid="phone-number-input"
                type="tel"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="society_name">Society Name *</Label>
              <Select
                value={formData.society_name}
                onValueChange={(value) => setFormData({ ...formData, society_name: value })}
                required
              >
                <SelectTrigger data-testid="society-select">
                  <SelectValue placeholder="Select your society" />
                </SelectTrigger>
                <SelectContent>
                  {societies.map(society => (
                    <SelectItem key={society} value={society} data-testid={`society-option-${society}`}>
                      {society}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="block_tower">Block / Tower *</Label>
                <Input
                  id="block_tower"
                  data-testid="block-tower-input"
                  type="text"
                  value={formData.block_tower}
                  onChange={(e) => setFormData({ ...formData, block_tower: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="flat_number">Flat Number *</Label>
                <Input
                  id="flat_number"
                  data-testid="flat-number-input"
                  type="text"
                  value={formData.flat_number}
                  onChange={(e) => setFormData({ ...formData, flat_number: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              data-testid="submit-verification-button"
              disabled={loading}
              className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white h-12 rounded-lg font-medium"
            >
              {loading ? 'Submitting...' : 'Submit for Verification'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Your profile will be reviewed by our admin team. You'll receive verification within 24-48 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
