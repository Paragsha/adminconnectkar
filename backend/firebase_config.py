import firebase_admin
from firebase_admin import credentials, firestore, storage, auth
import os
import json
from pathlib import Path

# Initialize Firebase Admin SDK
# Using Application Default Credentials for now
# In production, you would use a service account key file

try:
    # Try to get existing app
    firebase_app = firebase_admin.get_app()
except ValueError:
    # Initialize with minimal configuration
    # Since we don't have a service account key, we'll use the web SDK on frontend
    # and skip admin SDK initialization for now
    cred = credentials.Certificate({
        "type": "service_account",
        "project_id": "connectkar-emergent",
        "private_key_id": "dummy",
        "private_key": "-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7VJTUt9Us8cKj\\nMzEfYyjiWA4R4/M2bS1+fWIcPm15j9FprboKGJ0/I9s6nPqxQcNjP4tLjvKD2VmI\\njgN7GbqNQ7+VkZIBVtqmPZqYhSsE0bZpkNsxU0FbTlO0dL6vVWGZgn7kQzjZh0LC\\n-----END PRIVATE KEY-----\\n",
        "client_email": "firebase-adminsdk@connectkar-emergent.iam.gserviceaccount.com",
        "client_id": "dummy",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token"
    })
    
    try:
        firebase_app = firebase_admin.initialize_app(cred, {
            'storageBucket': 'connectkar-emergent.firebasestorage.app'
        })
    except Exception as e:
        print(f"Warning: Firebase Admin SDK initialization failed: {e}")
        print("Firebase operations will not work. Please provide a valid service account key.")
        firebase_app = None

# Only initialize Firestore and Storage if Firebase app is initialized
db = None
bucket = None

if firebase_app:
    try:
        db = firestore.client()
        bucket = storage.bucket()
    except Exception as e:
        print(f"Warning: Could not initialize Firestore/Storage: {e}")
