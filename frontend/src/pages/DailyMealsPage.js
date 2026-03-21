import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Plus, Utensils } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';

const DailyMealsPage = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    meal_type: 'lunch',
    cuisine: '',
    price_per_meal: '',
    description: '',
    contact_number: '',
    subscription_available: false
  });

  const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/meals`);
      setProviders(response.data);
    } catch (error) {
      console.error('Error fetching meal providers:', error);
      toast.error('Failed to load meal providers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.post(
        `${API}/meals`,
        {
          ...formData,
          price_per_meal: parseFloat(formData.price_per_meal),
          images: []
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success('Meal service added!');
      setDialogOpen(false);
      setFormData({
        meal_type: 'lunch',
        cuisine: '',
        price_per_meal: '',
        description: '',
        contact_number: '',
        subscription_available: false
      });
      fetchProviders();
    } catch (error) {
      console.error('Error creating meal provider:', error);
      toast.error('Failed to add meal service');
    }
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Manrope, sans-serif' }} data-testid="meals-heading">
          Daily Meals
        </h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="add-meal-provider-button" className="bg-[#F97316] hover:bg-[#EA580C] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Meal Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Meal Provider</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Meal Type</Label>
                <Select
                  value={formData.meal_type}
                  onValueChange={(value) => setFormData({ ...formData, meal_type: value })}
                >
                  <SelectTrigger data-testid="meal-type-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="all">All Meals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cuisine">Cuisine</Label>
                <Input
                  id="cuisine"
                  data-testid="cuisine-input"
                  placeholder="e.g., North Indian, South Indian"
                  value={formData.cuisine}
                  onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price_per_meal">Price per Meal (₹)</Label>
                <Input
                  id="price_per_meal"
                  data-testid="price-per-meal-input"
                  type="number"
                  value={formData.price_per_meal}
                  onChange={(e) => setFormData({ ...formData, price_per_meal: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  data-testid="description-textarea"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact_number">Contact Number</Label>
                <Input
                  id="contact_number"
                  data-testid="meal-contact-input"
                  type="tel"
                  value={formData.contact_number}
                  onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="subscription"
                  data-testid="subscription-checkbox"
                  checked={formData.subscription_available}
                  onCheckedChange={(checked) => setFormData({ ...formData, subscription_available: checked })}
                />
                <Label htmlFor="subscription">Subscription available</Label>
              </div>
              <Button type="submit" data-testid="submit-meal-button" className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white">
                Add Provider
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="spinner"></div>
        </div>
      ) : providers.length === 0 ? (
        <div className="text-center py-20" data-testid="no-meal-providers">
          <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No meal providers yet</p>
          <Button onClick={() => setDialogOpen(true)} className="bg-[#F97316] hover:bg-[#EA580C] text-white">
            Be the First Provider
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map(provider => (
            <div key={provider.id} data-testid={`meal-provider-${provider.id}`} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                    {provider.meal_type}
                  </span>
                  {provider.subscription_available && (
                    <span className="ml-2 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      Subscription
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#0F766E]">₹{provider.price_per_meal}</p>
                  <p className="text-xs text-gray-500">per meal</p>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{provider.cuisine}</h3>
              <p className="text-sm text-gray-600 mb-4">{provider.description}</p>
              
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-900">{provider.user_name}</p>
                <p className="text-xs text-gray-500">{provider.society_name}</p>
                <p className="text-sm text-gray-600 mt-2">{provider.contact_number}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyMealsPage;
