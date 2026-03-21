import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  addDoc,
  updateDoc,
  Timestamp 
} from 'firebase/firestore';

// User Operations
export const createUserProfile = async (uid, userData) => {
  try {
    await setDoc(doc(db, 'users', uid), {
      ...userData,
      uid,
      is_verified: false,
      is_admin: false,
      created_at: new Date().toISOString()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Listings Operations
export const createListing = async (listingData, userProfile) => {
  try {
    const listingsRef = collection(db, 'listings');
    const newListing = {
      ...listingData,
      user_id: userProfile.uid,
      user_name: userProfile.full_name,
      society_name: userProfile.society_name,
      is_verified: userProfile.is_verified || false,
      created_at: new Date().toISOString(),
      status: 'active'
    };
    const docRef = await addDoc(listingsRef, newListing);
    return { id: docRef.id, ...newListing };
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
};

export const getListings = async (category, subCategory = null, societyName = null) => {
  try {
    let q = query(
      collection(db, 'listings'),
      where('category', '==', category),
      where('status', '==', 'active'),
      orderBy('created_at', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const listings = [];
    querySnapshot.forEach((doc) => {
      listings.push({ id: doc.id, ...doc.data() });
    });
    
    // Filter client-side for sub_category and society if needed
    let filtered = listings;
    if (subCategory) {
      filtered = filtered.filter(l => l.sub_category === subCategory);
    }
    if (societyName) {
      filtered = filtered.filter(l => l.society_name === societyName);
    }
    
    return filtered;
  } catch (error) {
    console.error('Error getting listings:', error);
    throw error;
  }
};

export const getListing = async (listingId) => {
  try {
    const listingDoc = await getDoc(doc(db, 'listings', listingId));
    if (listingDoc.exists()) {
      return { id: listingDoc.id, ...listingDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting listing:', error);
    throw error;
  }
};

// Community Posts Operations
export const createCommunityPost = async (postData, userProfile) => {
  try {
    const postsRef = collection(db, 'community_posts');
    const newPost = {
      ...postData,
      user_id: userProfile.uid,
      user_name: userProfile.full_name,
      society_name: userProfile.society_name,
      created_at: new Date().toISOString()
    };
    const docRef = await addDoc(postsRef, newPost);
    return { id: docRef.id, ...newPost };
  } catch (error) {
    console.error('Error creating community post:', error);
    throw error;
  }
};

export const getCommunityPosts = async (postType = null) => {
  try {
    let q;
    if (postType) {
      q = query(
        collection(db, 'community_posts'),
        where('post_type', '==', postType),
        orderBy('created_at', 'desc')
      );
    } else {
      q = query(
        collection(db, 'community_posts'),
        orderBy('created_at', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    return posts;
  } catch (error) {
    console.error('Error getting community posts:', error);
    throw error;
  }
};

// Carpool Operations
export const createCarpoolRequest = async (requestData, userProfile) => {
  try {
    const carpoolRef = collection(db, 'carpool_requests');
    const newRequest = {
      ...requestData,
      user_id: userProfile.uid,
      user_name: userProfile.full_name,
      society_name: userProfile.society_name,
      created_at: new Date().toISOString()
    };
    const docRef = await addDoc(carpoolRef, newRequest);
    return { id: docRef.id, ...newRequest };
  } catch (error) {
    console.error('Error creating carpool request:', error);
    throw error;
  }
};

export const getCarpoolRequests = async (requestType = null) => {
  try {
    let q;
    if (requestType) {
      q = query(
        collection(db, 'carpool_requests'),
        where('request_type', '==', requestType),
        orderBy('created_at', 'desc')
      );
    } else {
      q = query(
        collection(db, 'carpool_requests'),
        orderBy('created_at', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);
    const requests = [];
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    return requests;
  } catch (error) {
    console.error('Error getting carpool requests:', error);
    throw error;
  }
};

// Meal Providers Operations
export const createMealProvider = async (providerData, userProfile) => {
  try {
    const mealsRef = collection(db, 'meal_providers');
    const newProvider = {
      ...providerData,
      user_id: userProfile.uid,
      user_name: userProfile.full_name,
      society_name: userProfile.society_name,
      created_at: new Date().toISOString()
    };
    const docRef = await addDoc(mealsRef, newProvider);
    return { id: docRef.id, ...newProvider };
  } catch (error) {
    console.error('Error creating meal provider:', error);
    throw error;
  }
};

export const getMealProviders = async () => {
  try {
    const q = query(
      collection(db, 'meal_providers'),
      orderBy('created_at', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const providers = [];
    querySnapshot.forEach((doc) => {
      providers.push({ id: doc.id, ...doc.data() });
    });
    return providers;
  } catch (error) {
    console.error('Error getting meal providers:', error);
    throw error;
  }
};

// Resident Services Operations
export const createResidentService = async (serviceData, userProfile) => {
  try {
    const servicesRef = collection(db, 'resident_services');
    const newService = {
      ...serviceData,
      user_id: userProfile.uid,
      user_name: userProfile.full_name,
      society_name: userProfile.society_name,
      created_at: new Date().toISOString()
    };
    const docRef = await addDoc(servicesRef, newService);
    return { id: docRef.id, ...newService };
  } catch (error) {
    console.error('Error creating resident service:', error);
    throw error;
  }
};

export const getResidentServices = async (serviceCategory = null) => {
  try {
    let q;
    if (serviceCategory) {
      q = query(
        collection(db, 'resident_services'),
        where('service_category', '==', serviceCategory),
        orderBy('created_at', 'desc')
      );
    } else {
      q = query(
        collection(db, 'resident_services'),
        orderBy('created_at', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);
    const services = [];
    querySnapshot.forEach((doc) => {
      services.push({ id: doc.id, ...doc.data() });
    });
    return services;
  } catch (error) {
    console.error('Error getting resident services:', error);
    throw error;
  }
};

// Home Businesses Operations
export const createHomeBusiness = async (businessData, userProfile) => {
  try {
    const businessesRef = collection(db, 'home_businesses');
    const newBusiness = {
      ...businessData,
      user_id: userProfile.uid,
      user_name: userProfile.full_name,
      society_name: userProfile.society_name,
      follower_count: 0,
      created_at: new Date().toISOString()
    };
    const docRef = await addDoc(businessesRef, newBusiness);
    return { id: docRef.id, ...newBusiness };
  } catch (error) {
    console.error('Error creating home business:', error);
    throw error;
  }
};

export const getHomeBusinesses = async () => {
  try {
    const q = query(
      collection(db, 'home_businesses'),
      orderBy('created_at', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const businesses = [];
    querySnapshot.forEach((doc) => {
      businesses.push({ id: doc.id, ...doc.data() });
    });
    return businesses;
  } catch (error) {
    console.error('Error getting home businesses:', error);
    throw error;
  }
};

// Admin Operations
export const getPendingVerifications = async () => {
  try {
    const q = query(
      collection(db, 'users'),
      where('is_verified', '==', false)
    );

    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    console.error('Error getting pending verifications:', error);
    throw error;
  }
};

export const verifyUser = async (uid) => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      is_verified: true
    });
    return { success: true };
  } catch (error) {
    console.error('Error verifying user:', error);
    throw error;
  }
};
