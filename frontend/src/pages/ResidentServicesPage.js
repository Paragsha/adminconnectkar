import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Plus, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';

const ResidentServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    service_category: 'learning',
    service_type: '',
    title: '',
    description: '',
    price: '',
    contact_number: ''
  });

  const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

  useEffect(() => {
    fetchServices();
  }, [filter]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== 'all') {
        params.service_category = filter;
      }
      const response = await axios.get(`${API}/services`, { params });
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.post(
        `${API}/services`,
        {
          ...formData,
          price: formData.price ? parseFloat(formData.price) : null,
          images: []
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success('Service added!');
      setDialogOpen(false);
      setFormData({
        service_category: 'learning',
        service_type: '',
        title: '',
        description: '',
        price: '',
        contact_number: ''
      });
      fetchServices();
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error('Failed to add service');
    }
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Manrope, sans-serif' }} data-testid="services-heading">
          Resident Services
        </h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="add-service-button" className="bg-[#F97316] hover:bg-[#EA580C] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Your Service</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Category</Label>
                <Select
                  value={formData.service_category}
                  onValueChange={(value) => setFormData({ ...formData, service_category: value })}
                >
                  <SelectTrigger data-testid="service-category-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="learning">Learning & Classes</SelectItem>
                    <SelectItem value="personal_help">Personal Help</SelectItem>
                    <SelectItem value="skill_sharing">Skill Sharing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="service_type">Service Type</Label>
                <Input
                  id="service_type"
                  data-testid="service-type-input"
                  placeholder="e.g., Home Tuition, Yoga Classes"
                  value={formData.service_type}
                  onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  data-testid="service-title-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  data-testid="service-description-textarea"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Price (Optional)</Label>
                <Input
                  id="price"
                  data-testid="service-price-input"
                  type="number"
                  placeholder="Leave empty if free"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="contact_number">Contact Number</Label>
                <Input
                  id="contact_number"
                  data-testid="service-contact-input"
                  type="tel"
                  value={formData.contact_number}
                  onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" data-testid="submit-service-button" className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white">
                Add Service
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button
          data-testid="filter-all-services"
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
            filter === 'all' ? 'bg-[#0F766E] text-white' : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          All
        </button>
        <button
          data-testid="filter-learning"
          onClick={() => setFilter('learning')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
            filter === 'learning' ? 'bg-[#0F766E] text-white' : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          Learning & Classes
        </button>
        <button
          data-testid="filter-personal-help"
          onClick={() => setFilter('personal_help')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
            filter === 'personal_help' ? 'bg-[#0F766E] text-white' : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          Personal Help
        </button>
        <button
          data-testid="filter-skill-sharing"
          onClick={() => setFilter('skill_sharing')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
            filter === 'skill_sharing' ? 'bg-[#0F766E] text-white' : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          Skill Sharing
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="spinner"></div>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-20" data-testid="no-services">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No services listed yet</p>
          <Button onClick={() => setDialogOpen(true)} className="bg-[#F97316] hover:bg-[#EA580C] text-white">
            List Your Service
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <div key={service.id} data-testid={`service-${service.id}`} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
                  {service.service_type}
                </span>
                {service.price && (
                  <p className="text-xl font-bold text-[#0F766E]">₹{service.price}</p>
                )}
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{service.description}</p>
              
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-900">{service.user_name}</p>
                <p className="text-xs text-gray-500">{service.society_name}</p>
                <p className="text-sm text-gray-600 mt-2">{service.contact_number}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResidentServicesPage;
