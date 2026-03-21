import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Shield, Check, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

  useEffect(() => {
    if (!userProfile?.is_admin) {
      toast.error('Admin access required');
      navigate('/');
      return;
    }
    fetchPendingUsers();
  }, [userProfile, navigate]);

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await axios.get(`${API}/admin/pending-verifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingUsers(response.data);
    } catch (error) {
      console.error('Error fetching pending users:', error);
      toast.error('Failed to load pending verifications');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (uid) => {
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.post(
        `${API}/admin/verify-user/${uid}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success('User verified successfully');
      fetchPendingUsers();
    } catch (error) {
      console.error('Error verifying user:', error);
      toast.error('Failed to verify user');
    }
  };

  if (!userProfile?.is_admin) {
    return null;
  }

  return (
    <div className="fade-in">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-purple-600" />
        <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Manrope, sans-serif' }} data-testid="admin-heading">
          Admin Panel
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Pending Verifications</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="spinner"></div>
          </div>
        ) : pendingUsers.length === 0 ? (
          <div className="text-center py-10" data-testid="no-pending-verifications">
            <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-500">No pending verifications</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingUsers.map(user => (
              <div
                key={user.uid}
                data-testid={`pending-user-${user.uid}`}
                className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-lg" data-testid={`pending-user-name-${user.uid}`}>{user.full_name}</h3>
                  <div className="text-sm text-gray-600 mt-1">
                    <p data-testid={`pending-user-society-${user.uid}`}>{user.society_name}</p>
                    <p>{user.block_tower}, Flat {user.flat_number}</p>
                    <p>{user.phone_number}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Requested: {new Date(user.created_at).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    data-testid={`verify-user-button-${user.uid}`}
                    onClick={() => handleVerify(user.uid)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Verify
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Verify users only after confirming their residence details. Verification gives them full access to the platform.
        </p>
      </div>
    </div>
  );
};

export default AdminPage;
