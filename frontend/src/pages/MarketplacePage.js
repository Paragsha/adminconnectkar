import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const MarketplacePage = () => {
  const { category } = useParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');

  const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'furniture', name: 'Furniture' },
    { id: 'household', name: 'Household' },
    { id: 'books', name: 'Books' },
    { id: 'gadgets', name: 'Gadgets' },
    { id: 'sports', name: 'Sports' },
    { id: 'fashion', name: 'Fashion' }
  ];

  useEffect(() => {
    fetchListings();
  }, [selectedCategory]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = { category: 'marketplace' };
      if (selectedCategory !== 'all') {
        params.sub_category = selectedCategory;
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
        <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Manrope, sans-serif' }} data-testid="marketplace-heading">
          Marketplace
        </h1>
        <Link to="/create-listing?category=marketplace">
          <Button data-testid="create-marketplace-listing-button" className="bg-[#F97316] hover:bg-[#EA580C] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Sell Item
          </Button>
        </Link>
      </div>

      {/* Category Filter */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              data-testid={`category-filter-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#0F766E] text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#0F766E]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="spinner"></div>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20" data-testid="no-marketplace-listings">
          <p className="text-gray-500 mb-4">No items listed yet</p>
          <Link to="/create-listing?category=marketplace">
            <Button className="bg-[#F97316] hover:bg-[#EA580C] text-white">
              Be the first to list an item
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {listings.map(listing => (
            <Link
              key={listing.id}
              to={`/listing/${listing.id}`}
              data-testid={`marketplace-listing-${listing.id}`}
              className="listing-card bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm"
            >
              <div className="aspect-square bg-gray-100 relative">
                {listing.images && listing.images.length > 0 ? (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                {listing.is_verified && (
                  <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-white">
                    ✓
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{listing.title}</h3>
                {listing.price && (
                  <p className="text-lg font-bold text-[#0F766E] mb-1">₹{listing.price.toLocaleString()}</p>
                )}
                <p className="text-xs text-gray-500">{listing.society_name}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
