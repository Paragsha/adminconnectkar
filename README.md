# ConnectKar - Township Super App

ConnectKar is a closed digital ecosystem for township residents to buy & sell items, offer and access services, rent properties, and connect with neighbors.

## Features

- **Phone OTP Authentication** (Firebase Auth)
- **User Onboarding & Verification**
- **Marketplace** - Buy & sell electronics, furniture, books, etc.
- **Vehicles** - Buy & sell cars and bikes
- **Rentals** - Rent items, vehicles, and flats
- **Property** - Buy & sell flats
- **Community** - Events, announcements, and general posts
- **Carpool** - Offer or find rides
- **Daily Meals** - Home-cooked meal providers
- **Resident Services** - Classes, tutoring, personal help, skill sharing
- **Home Businesses** - Resident-run businesses
- **Admin Panel** - Verify residents

## Tech Stack

### Frontend
- React 19
- Tailwind CSS
- Firebase SDK (Auth, Firestore, Storage)
- React Router
- Framer Motion
- Shadcn UI Components

### Backend
- FastAPI
- Firebase (Auth, Firestore, Storage)

## Firebase Setup

The app uses Firebase for:
1. **Authentication** - Phone OTP login
2. **Firestore** - Database for users, listings, posts, etc.
3. **Storage** - File uploads (profile photos, listing images)

### Firebase Configuration

The Firebase config is already set in `/app/frontend/src/lib/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyA7LxPQzkqZoB-HDOSd7v40sXjnNwZ5Zpc",
  authDomain: "connectkar-emergent.firebaseapp.com",
  projectId: "connectkar-emergent",
  storageBucket: "connectkar-emergent.firebasestorage.app",
  messagingSenderId: "489396701837",
  appId: "1:489396701837:web:42ffbd08aaf01938bd70c4",
  measurementId: "G-874D91YPXL"
};
```

### Required Firebase Setup

1. **Enable Authentication**
   - Go to Firebase Console > Authentication
   - Enable "Phone" sign-in method
   - Add your domain to authorized domains

2. **Create Firestore Database**
   - Go to Firebase Console > Firestore Database
   - Create database in production mode
   - Set up security rules (see below)

3. **Enable Storage**
   - Go to Firebase Console > Storage
   - Create default bucket
   - Set up security rules (see below)

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
      allow update: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.is_admin == true;
    }
    
    // Listings
    match /listings/{listingId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.user_id;
    }
    
    // Community posts
    match /community_posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.user_id;
    }
    
    // Carpool requests
    match /carpool_requests/{requestId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.user_id;
    }
    
    // Meal providers
    match /meal_providers/{providerId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.user_id;
    }
    
    // Resident services
    match /resident_services/{serviceId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.user_id;
    }
    
    // Home businesses
    match /home_businesses/{businessId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.user_id;
    }
  }
}
```

### Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## Getting Started

1. Set up Firebase (see above)
2. The app is already deployed and running
3. Access the app at your deployment URL
4. First user should be manually set as admin in Firestore:
   - Go to Firestore Console
   - Find user document
   - Set `is_admin: true`

## Architecture

The app uses Firebase client SDK entirely on the frontend. All data operations (auth, Firestore queries, storage uploads) are handled client-side. This is a valid architecture for this type of community app as:

1. All users are verified residents (trusted community)
2. Firebase Security Rules enforce access control
3. Simpler architecture with no backend complexity
4. Real-time updates via Firestore

## Township Societies

- Aqualily Estate
- Nova Apartments
- Iris Court
- Happinest Apartments
- Lakewoods Apartments
- Sylvan County

## User Flow

1. **Authentication** - Phone OTP login
2. **Onboarding** - Submit residence details for verification
3. **Verification** - Admin verifies the user
4. **Access** - Full access to all features once verified

## Admin Features

- View pending verification requests
- Verify residents
- Access via Profile > Admin Panel

## Future Enhancements

- Firebase Admin SDK integration for backend validation
- Push notifications
- Image upload for listings
- Chat between users
- Advanced search and filters
- Analytics and insights

## Support

For issues or questions, please contact support.
