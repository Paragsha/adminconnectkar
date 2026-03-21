import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { auth } from '../lib/firebase';

const CreateListingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'marketplace';
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: categoryParam,
    sub_category: '',
    price: '',
    contact_number: ''
  });
  const [loading, setLoading] = useState(false);

  const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

  const subCategories = {
    marketplace: ['electronics', 'furniture', 'household', 'books', 'gadgets', 'sports', 'fashion'],
    vehicles: ['cars', 'bikes'],
    rentals: ['home_items', 'vehicles', 'flats'],
    property: ['buy', 'sell']
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await auth.currentUser.getIdToken();
      await axios.post(
        `${API}/listings`,
        {
          ...formData,
          price: formData.price ? parseFloat(formData.price) : null,
          images: []
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success('Listing created successfully!');
      navigate(-1);
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in max-w-2xl mx-auto">
      <Button
        data-testid="back-button-create-listing"
        onClick={() => navigate(-1)}
        variant="ghost"
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Manrope, sans-serif' }} data-testid="create-listing-heading">
          Create Listing
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value, sub_category: '' })}
            >
              <SelectTrigger data-testid="listing-category-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marketplace">Marketplace</SelectItem>
                <SelectItem value="vehicles">Vehicles</SelectItem>
                <SelectItem value="rentals">Rentals</SelectItem>
                <SelectItem value="property">Property</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {subCategories[formData.category] && (
            <div>
              <Label htmlFor="sub_category">Sub Category *</Label>
              <Select
                value={formData.sub_category}
                onValueChange={(value) => setFormData({ ...formData, sub_category: value })}
              >
                <SelectTrigger data-testid="listing-subcategory-select">
                  <SelectValue placeholder="Select sub category" />
                </SelectTrigger>
                <SelectContent>
                  {subCategories[formData.category].map(sub => (
                    <SelectItem key={sub} value={sub}>
                      {sub.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              data-testid="listing-title-input"
              placeholder="e.g., iPhone 14 Pro Max"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              data-testid="listing-description-textarea"
              rows={5}
              placeholder="Describe your item in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="price">Price (₹) *</Label>
            <Input
              id="price"
              data-testid="listing-price-input"
              type="number"
              placeholder="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="contact_number">Contact Number *</Label>
            <Input
              id="contact_number"
              data-testid="listing-contact-input"
              type="tel"
              placeholder="Your contact number"
              value={formData.contact_number}
              onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              data-testid="submit-listing-button"
              disabled={loading}
              className="flex-1 bg-[#F97316] hover:bg-[#EA580C] text-white h-12"
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </Button>
            <Button
              type="button"
              data-testid="cancel-listing-button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="px-8"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListingPage;
