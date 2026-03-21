import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Plus, Store } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';

const HomeBusinessesPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    business_name: '',
    description: '',
    category: '',
    contact_number: ''
  });

  const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/businesses`);
      setBusinesses(response.data);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      toast.error('Failed to load businesses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.post(
        `${API}/businesses`,
        {
          ...formData,
          images: []
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success('Business added!');
      setDialogOpen(false);
      setFormData({
        business_name: '',
        description: '',
        category: '',
        contact_number: ''
      });
      fetchBusinesses();
    } catch (error) {
      console.error('Error creating business:', error);
      toast.error('Failed to add business');
    }
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Manrope, sans-serif' }} data-testid="businesses-heading">
          Home Businesses
        </h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="add-business-button" className="bg-[#F97316] hover:bg-[#EA580C] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Business
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Your Home Business</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="business_name">Business Name</Label>
                <Input
                  id="business_name"
                  data-testid="business-name-input"
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  data-testid="business-category-input"
                  placeholder="e.g., Bakery, Handicrafts, Consulting"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  data-testid="business-description-textarea"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact_number">Contact Number</Label>
                <Input
                  id="contact_number"
                  data-testid="business-contact-input"
                  type="tel"
                  value={formData.contact_number}
                  onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" data-testid="submit-business-button" className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white">
                Add Business
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="spinner"></div>
        </div>
      ) : businesses.length === 0 ? (
        <div className="text-center py-20" data-testid="no-businesses">
          <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No home businesses yet</p>
          <Button onClick={() => setDialogOpen(true)} className="bg-[#F97316] hover:bg-[#EA580C] text-white">
            Start Your Business
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map(business => (
            <div key={business.id} data-testid={`business-${business.id}`} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-32 bg-gradient-to-br from-purple-500 to-indigo-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {business.business_name}
                </h3>
                <span className="inline-block px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 mb-3">
                  {business.category}
                </span>
                <p className="text-sm text-gray-600 mb-4">{business.description}</p>
                
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-gray-900">{business.user_name}</p>
                  <p className="text-xs text-gray-500">{business.society_name}</p>
                  <p className="text-sm text-gray-600 mt-2">{business.contact_number}</p>
                  {business.follower_count > 0 && (
                    <p className="text-xs text-gray-500 mt-1">{business.follower_count} followers</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeBusinessesPage;
