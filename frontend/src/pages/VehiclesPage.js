import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Plus, Car } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const VehiclesPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

  useEffect(() => {
    fetchListings();
  }, [filter]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = { category: 'vehicles' };
      if (filter !== 'all') {
        params.sub_category = filter;
      }
      const response = await axios.get(`${API}/listings`, { params });
      setListings(response.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Manrope, sans-serif' }} data-testid="vehicles-heading">
          Vehicles
        </h1>
        <Link to="/create-listing?category=vehicles">
          <Button data-testid="create-vehicle-listing-button" className="bg-[#F97316] hover:bg-[#EA580C] text-white">
            <Plus className="w-4 h-4 mr-2" />
            List Vehicle
          </Button>
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          data-testid="filter-all-vehicles"
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all' ? 'bg-[#0F766E] text-white' : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          All
        </button>
        <button
          data-testid="filter-cars"
          onClick={() => setFilter('cars')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'cars' ? 'bg-[#0F766E] text-white' : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          Cars
        </button>
        <button
          data-testid="filter-bikes"
          onClick={() => setFilter('bikes')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'bikes' ? 'bg-[#0F766E] text-white' : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          Bikes
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="spinner"></div>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20" data-testid="no-vehicle-listings">
          <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No vehicles listed yet</p>
          <Link to="/create-listing?category=vehicles">
            <Button className="bg-[#F97316] hover:bg-[#EA580C] text-white">
              List Your Vehicle
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(listing => (
            <Link
              key={listing.id}
              to={`/listing/${listing.id}`}
              data-testid={`vehicle-listing-${listing.id}`}
              className="listing-card bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm"
            >
              <div className="aspect-video bg-gray-100 relative">
                {listing.images && listing.images.length > 0 ? (
                  <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Car className="w-12 h-12" />
                  </div>
                )}
                {listing.is_verified && (
                  <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-white">
                    ✓
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{listing.title}</h3>
                <p className="text-xl font-bold text-[#0F766E] mb-2">₹{listing.price?.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{listing.society_name}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehiclesPage;
