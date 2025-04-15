"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, preferences, laws } from "@/lib/api";
import { User } from "@/types/user";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailUpdates: true,
    lawUpdates: true,
    newLawsInInterest: true,
    contradictions: true,
    weeklyDigest: true
  });
  
  // User interests/categories
  const [availableCategories, setAvailableCategories] = useState<{id: string, name: string}[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Profile update
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get authenticated user
        const userData = await auth.getUser();
        setUser(userData);
        setName(userData.name || "");
        setBio(userData.bio || "");
        
        // Get notification preferences
        const prefsData = await preferences.getNotificationPreferences();
        setNotificationPrefs(prefsData);
        
        // Get categories
        const categoriesData = await laws.getCategories();
        setAvailableCategories(categoriesData);
        
        // Get user interests
        const interests = await preferences.getInterests();
        setSelectedCategories(interests);
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to load user data:", err);
        setError("Failed to load user data. Please log in again.");
        setLoading(false);
        
        // Redirect to login after a delay
        setTimeout(() => {
          router.push("/auth");
        }, 2000);
      }
    };
    
    loadUserData();
  }, [router]);
  
  const handleNotificationChange = (field: keyof typeof notificationPrefs) => {
    setNotificationPrefs(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const handleSaveSettings = async () => {
    setSaving(true);
    setSuccess(false);
    
    try {
      // Update notification preferences
      await preferences.updateNotificationPreferences(notificationPrefs);
      
      // Update interests/categories
      await preferences.updateInterests(selectedCategories);
      
      // Update profile
      await auth.updateProfile({
        name,
        bio
      });
      
      setSuccess(true);
    } catch (err) {
      console.error("Failed to save settings:", err);
      setError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
      
      // Hide success message after 3 seconds
      if (success) {
        setTimeout(() => setSuccess(false), 3000);
      }
    }
  };
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading...</h2>
          <p className="text-gray-500">Please wait while we load your settings</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-red-50 p-8 text-center">
          <h2 className="text-xl font-semibold text-red-800">Error</h2>
          <p className="text-red-700">{error}</p>
          <p className="mt-2 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-500">
          Manage your account preferences and notification settings
        </p>
      </header>
      
      {success && (
        <div className="mb-6 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Settings saved successfully!
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-10">
        {/* Profile Settings */}
        <section className="bg-white p-6 shadow sm:rounded-lg">
          <h2 className="text-xl font-medium text-gray-900">Profile Information</h2>
          <p className="mt-1 text-sm text-gray-500">
            Update your basic profile information
          </p>
          
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div className="sm:col-span-6">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <div className="mt-1">
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Brief description for your profile.
              </p>
            </div>
          </div>
        </section>
        
        {/* Notification Preferences */}
        <section className="bg-white p-6 shadow sm:rounded-lg">
          <h2 className="text-xl font-medium text-gray-900">Notification Settings</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage how you receive notifications and updates
          </p>
          
          <div className="mt-6 space-y-4">
            <div className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="email-updates"
                  name="email-updates"
                  type="checkbox"
                  checked={notificationPrefs.emailUpdates}
                  onChange={() => handleNotificationChange('emailUpdates')}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="email-updates" className="font-medium text-gray-700">
                  Email updates
                </label>
                <p className="text-gray-500">Receive email notifications</p>
              </div>
            </div>
            
            <div className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="law-updates"
                  name="law-updates"
                  type="checkbox"
                  checked={notificationPrefs.lawUpdates}
                  onChange={() => handleNotificationChange('lawUpdates')}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="law-updates" className="font-medium text-gray-700">
                  Law updates
                </label>
                <p className="text-gray-500">Get notified when laws are updated</p>
              </div>
            </div>
            
            <div className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="new-laws"
                  name="new-laws"
                  type="checkbox"
                  checked={notificationPrefs.newLawsInInterest}
                  onChange={() => handleNotificationChange('newLawsInInterest')}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="new-laws" className="font-medium text-gray-700">
                  New laws in your interests
                </label>
                <p className="text-gray-500">Get notified when new laws are added in your areas of interest</p>
              </div>
            </div>
            
            <div className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="contradictions"
                  name="contradictions"
                  type="checkbox"
                  checked={notificationPrefs.contradictions}
                  onChange={() => handleNotificationChange('contradictions')}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="contradictions" className="font-medium text-gray-700">
                  Contradictions
                </label>
                <p className="text-gray-500">Get notified about contradicting laws and findings</p>
              </div>
            </div>
            
            <div className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="weekly-digest"
                  name="weekly-digest"
                  type="checkbox"
                  checked={notificationPrefs.weeklyDigest}
                  onChange={() => handleNotificationChange('weeklyDigest')}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="weekly-digest" className="font-medium text-gray-700">
                  Weekly digest
                </label>
                <p className="text-gray-500">Receive a weekly summary of updates and new content</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Categories of Interest */}
        <section className="bg-white p-6 shadow sm:rounded-lg">
          <h2 className="text-xl font-medium text-gray-900">Categories of Interest</h2>
          <p className="mt-1 text-sm text-gray-500">
            Select the categories of biological laws you're interested in
          </p>
          
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {availableCategories.map((category) => (
              <div key={category.id} className="relative flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id={`category-${category.id}`}
                    name={`category-${category.id}`}
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor={`category-${category.id}`} className="font-medium text-gray-700">
                    {category.name}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={saving}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
} 