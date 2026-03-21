import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft, Phone, MapPin } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/listings/${id}`);
      setListing(response.data);
    } catch (error) {
      console.error('Error fetching listing:', error);
      toast.error('Failed to load listing');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Listing not found</p>
        <Button onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="fade-in max-w-4xl mx-auto">
      <Button
        data-testid="back-button"
        onClick={() => navigate(-1)}
        variant="ghost"
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {listing.images && listing.images.length > 0 && (
          <div className="aspect-video bg-gray-100 relative">
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            {listing.is_verified && (
              <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-emerald-500 text-white shadow-lg">
                ✓ Verified
              </span>
            )}
          </div>
        )}

        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Manrope, sans-serif' }} data-testid="listing-title">
                {listing.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span data-testid="listing-society">{listing.society_name}</span>
              </div>
            </div>
            {listing.price && (
              <div className="text-right">
                <p className="text-3xl font-bold text-[#0F766E]" data-testid="listing-price">
                  ₹{listing.price.toLocaleString()}
                </p>
                {listing.category === 'rentals' && (
                  <p className="text-sm text-gray-500">/month</p>
                )}
              </div>
            )}
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              {listing.category}
            </span>
            {listing.sub_category && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                {listing.sub_category}
              </span>
            )}
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              listing.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {listing.status}
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed" data-testid="listing-description">{listing.description}</p>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Seller Information</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-lg" data-testid="listing-seller-name">{listing.user_name}</p>
                <p className="text-sm text-gray-500">{listing.society_name}</p>
                {listing.is_verified && (
                  <span className="inline-flex items-center gap-1 mt-2 text-xs text-emerald-600">
                    ✓ Verified Resident
                  </span>
                )}
              </div>
              {listing.contact_number && (
                <Button className="bg-[#0F766E] hover:bg-[#115E59] text-white" data-testid="contact-seller-button">
                  <Phone className="w-4 h-4 mr-2" />
                  {listing.contact_number}
                </Button>
              )}
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-400">
            Posted on {new Date(listing.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;
