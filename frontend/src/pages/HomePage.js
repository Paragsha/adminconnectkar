import { Link } from 'react-router-dom';
import { Car, Home, Users, Utensils, Briefcase, UserCheck, ShoppingBag, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { userProfile } = useAuth();

  const categories = [
    {
      title: 'Marketplace',
      description: 'Buy & sell items within the township',
      icon: ShoppingBag,
      path: '/marketplace',
      color: 'from-blue-500 to-cyan-500',
      image: 'https://images.unsplash.com/photo-1623679072629-3aaa0192a391?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NjV8MHwxfHNlYXJjaHwyfHxsYXB0b3AlMjBvbiUyMGRlc2slMjBtb2Rlcm4lMjB3b3Jrc3BhY2V8ZW58MHx8fHwxNzc0MTAzMjU3fDA&ixlib=rb-4.1.0&q=85'
    },
    {
      title: 'Vehicles',
      description: 'Buy & sell cars and bikes',
      icon: Car,
      path: '/vehicles',
      color: 'from-purple-500 to-pink-500',
      image: 'https://images.unsplash.com/photo-1710079230507-f07eadefabb5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBjYXIlMjBzaWRlJTIwdmlldyUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE3NzQxMDMyNTV8MA&ixlib=rb-4.1.0&q=85'
    },
    {
      title: 'Property',
      description: 'Buy & sell flats',
      icon: Building2,
      path: '/property',
      color: 'from-orange-500 to-red-500',
      image: 'https://images.unsplash.com/photo-1758548157747-285c7012db5b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvciUyMGxpdmluZyUyMHJvb20lMjBicmlnaHR8ZW58MHx8fHwxNzc0MTAzMjU2fDA&ixlib=rb-4.1.0&q=85'
    },
    {
      title: 'Rentals',
      description: 'Rent items, vehicles & flats',
      icon: Home,
      path: '/rentals',
      color: 'from-green-500 to-teal-500',
      image: 'https://images.unsplash.com/photo-1771287490603-fbf9b6211cc3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvciUyMGxpdmluZyUyMHJvb20lMjBicmlnaHR8ZW58MHx8fHwxNzc0MTAzMjU2fDA&ixlib=rb-4.1.0&q=85'
    },
    {
      title: 'Carpool',
      description: 'Offer or find rides',
      icon: Car,
      path: '/carpool',
      color: 'from-yellow-500 to-amber-500',
      image: 'https://images.unsplash.com/photo-1710079230507-f07eadefabb5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBjYXIlMjBzaWRlJTIwdmlldyUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE3NzQxMDMyNTV8MA&ixlib=rb-4.1.0&q=85'
    },
    {
      title: 'Daily Meals',
      description: 'Home-cooked meal providers',
      icon: Utensils,
      path: '/meals',
      color: 'from-red-500 to-pink-500',
      image: 'https://images.unsplash.com/photo-1672477179695-7276b0602fa9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTZ8MHwxfHNlYXJjaHwxfHxob21lJTIwY29va2VkJTIwaW5kaWFuJTIwdGhhbGklMjBmb29kJTIwdGlmZmlufGVufDB8fHx8MTc3NDEwMzI2MXww&ixlib=rb-4.1.0&q=85'
    },
    {
      title: 'Home Businesses',
      description: 'Resident-run businesses',
      icon: Briefcase,
      path: '/businesses',
      color: 'from-indigo-500 to-purple-500',
      image: 'https://images.unsplash.com/photo-1682418460482-4554cced7be9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBzb2ZhJTIwZnVybml0dXJlJTIwd2hpdGUlMjBiYWNrZ3JvdW5kfGVufDB8fHx8MTc3NDEwMzI1Nnww&ixlib=rb-4.1.0&q=85'
    },
    {
      title: 'Resident Services',
      description: 'Classes, tutoring & more',
      icon: UserCheck,
      path: '/services',
      color: 'from-teal-500 to-green-500',
      image: 'https://images.unsplash.com/photo-1758274526087-9cd4077e0cf6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHw0fHx5b2dhJTIwY2xhc3MlMjBncm91cCUyMG91dGRvb3IlMjBwYXJrfGVufDB8fHx8MTc3NDEwMzI1OXww&ixlib=rb-4.1.0&q=85'
    },
    {
      title: 'Community',
      description: 'Events, announcements & posts',
      icon: Users,
      path: '/community',
      color: 'from-blue-500 to-indigo-500',
      image: 'https://images.unsplash.com/photo-1758275557784-39516582a05d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwzfHxjb21tdW5pdHklMjBwYXJrJTIwZ2F0aGVyaW5nJTIwZGl2ZXJzZSUyMHBlb3BsZSUyMGhhcHB5fGVufDB8fHx8MTc3NDEwMzI1OHww&ixlib=rb-4.1.0&q=85'
    }
  ];

  return (
    <div className="fade-in">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: 'Manrope, sans-serif' }} data-testid="home-welcome-heading">
          Welcome back, {userProfile?.full_name?.split(' ')[0]}!
        </h1>
        <p className="text-lg text-gray-600">Explore your township community</p>
      </div>

      {/* Verification Status Banner */}
      {!userProfile?.is_verified && (
        <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-xl" data-testid="pending-verification-banner">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-900 mb-1">Verification Pending</h3>
              <p className="text-amber-800">Your profile is under review. You'll be notified once verified. In the meantime, you can browse the platform.</p>
            </div>
          </div>
        </div>
      )}

      {/* Categories Grid - Bento Style */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-fr">
        {categories.map((category, index) => (
          <Link
            key={category.path}
            to={category.path}
            data-testid={`category-card-${category.title.toLowerCase().replace(/\s+/g, '-')}`}
            className={`category-card bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md ${
              index === 0 ? 'md:col-span-2 md:row-span-2' : ''
            } ${
              index === 8 ? 'md:col-span-2' : ''
            }`}
          >
            <div className="relative h-full">
              <img
                src={category.image}
                alt={category.title}
                className="absolute inset-0 w-full h-full object-cover opacity-20"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10`}></div>
              <div className="relative p-6 h-full flex flex-col justify-between">
                <div>
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${category.color} mb-4`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>{category.title}</h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-3xl font-bold text-[#0F766E]" style={{ fontFamily: 'Manrope, sans-serif' }}>6</div>
          <div className="text-gray-600 mt-1">Societies Connected</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-3xl font-bold text-[#0F766E]" style={{ fontFamily: 'Manrope, sans-serif' }}>100%</div>
          <div className="text-gray-600 mt-1">Verified Residents</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-3xl font-bold text-[#0F766E]" style={{ fontFamily: 'Manrope, sans-serif' }}>Safe</div>
          <div className="text-gray-600 mt-1">Trusted Community</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
