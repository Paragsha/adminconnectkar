import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Plus, Car, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';

const CarpoolPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    request_type: 'offer',
    from_location: '',
    to_location: '',
    departure_time: '',
    seats_available: 1,
    price_per_seat: '',
    contact_number: ''
  });

  const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== 'all') {
        params.request_type = filter;
      }
      const response = await axios.get(`${API}/carpool`, { params });
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching carpool requests:', error);
      toast.error('Failed to load carpool requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.post(`${API}/carpool`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Carpool request created!');
      setDialogOpen(false);
      setFormData({
        request_type: 'offer',
        from_location: '',
        to_location: '',
        departure_time: '',
        seats_available: 1,
        price_per_seat: '',
        contact_number: ''
      });
      fetchRequests();
    } catch (error) {
      console.error('Error creating carpool request:', error);
      toast.error('Failed to create request');
    }
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Manrope, sans-serif' }} data-testid="carpool-heading">
          Carpool
        </h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="create-carpool-button" className="bg-[#F97316] hover:bg-[#EA580C] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Carpool
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Carpool Request</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Type</Label>
                <Select
                  value={formData.request_type}
                  onValueChange={(value) => setFormData({ ...formData, request_type: value })}
                >
                  <SelectTrigger data-testid="carpool-type-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="offer">Offer Ride</SelectItem>
                    <SelectItem value="find">Find Ride</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="from_location">From</Label>
                <Input
                  id="from_location"
                  data-testid="from-location-input"
                  value={formData.from_location}
                  onChange={(e) => setFormData({ ...formData, from_location: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="to_location">To</Label>
                <Input
                  id="to_location"
                  data-testid="to-location-input"
                  value={formData.to_location}
                  onChange={(e) => setFormData({ ...formData, to_location: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="departure_time">Departure Time</Label>
                <Input
                  id="departure_time"
                  data-testid="departure-time-input"
                  type="datetime-local"
                  value={formData.departure_time}
                  onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
                  required
                />
              </div>
              {formData.request_type === 'offer' && (
                <div>
                  <Label htmlFor="seats_available">Seats Available</Label>
                  <Input
                    id="seats_available"
                    data-testid="seats-available-input"
                    type="number"
                    min="1"
                    value={formData.seats_available}
                    onChange={(e) => setFormData({ ...formData, seats_available: parseInt(e.target.value) })}
                    required
                  />
                </div>
              )}
              <div>
                <Label htmlFor="price_per_seat">Price per Seat (₹)</Label>
                <Input
                  id="price_per_seat"
                  data-testid="price-per-seat-input"
                  type="number"
                  value={formData.price_per_seat}
                  onChange={(e) => setFormData({ ...formData, price_per_seat: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="contact_number">Contact Number</Label>
                <Input
                  id="contact_number"
                  data-testid="contact-number-input"
                  type="tel"
                  value={formData.contact_number}
                  onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" data-testid="submit-carpool-button" className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white">
                Create Request
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          data-testid="filter-all-carpool"
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all' ? 'bg-[#0F766E] text-white' : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          All
        </button>
        <button
          data-testid="filter-offer"
          onClick={() => setFilter('offer')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'offer' ? 'bg-[#0F766E] text-white' : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          Offering Rides
        </button>
        <button
          data-testid="filter-find"
          onClick={() => setFilter('find')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'find' ? 'bg-[#0F766E] text-white' : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          Finding Rides
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="spinner"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20" data-testid="no-carpool-requests">
          <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No carpool requests yet</p>
          <Button onClick={() => setDialogOpen(true)} className="bg-[#F97316] hover:bg-[#EA580C] text-white">
            Create First Request
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map(request => (
            <div key={request.id} data-testid={`carpool-request-${request.id}`} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  request.request_type === 'offer'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {request.request_type === 'offer' ? 'Offering Ride' : 'Finding Ride'}
                </span>
                {request.price_per_seat && (
                  <span className="text-lg font-bold text-[#0F766E]">₹{request.price_per_seat}</span>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{request.from_location}</p>
                    <p className="text-xs text-gray-500">to {request.to_location}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">
                    Departure: {new Date(request.departure_time).toLocaleString('en-IN')}
                  </p>
                  {request.seats_available && (
                    <p className="text-sm text-gray-600">Seats: {request.seats_available}</p>
                  )}
                </div>
                
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-700">{request.user_name}</p>
                  <p className="text-xs text-gray-500">{request.society_name}</p>
                  <p className="text-sm text-gray-600 mt-1">{request.contact_number}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarpoolPage;
