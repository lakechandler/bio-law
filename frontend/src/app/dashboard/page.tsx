"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, laws, notifications } from "@/lib/api";
import { User } from "@/types/user";
import { Law } from "@/types/law";
import { Notification } from "@/types/notification";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [savedLaws, setSavedLaws] = useState<Law[]>([]);
  const [recommendedLaws, setRecommendedLaws] = useState<Law[]>([]);
  const [userNotifications, setUserNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'saved' | 'recommended' | 'notifications'>('saved');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Get authenticated user
        const userData = await auth.getUser();
        setUser(userData);
        
        // Load saved laws
        // First get the saved law IDs, then fetch each law's details
        const savedLawIds = await laws.getSaved();
        const savedLawsData: Law[] = [];
        for (const id of savedLawIds) {
          try {
            const law = await laws.getById(id);
            savedLawsData.push(law);
          } catch (err) {
            console.error(`Failed to load law ${id}:`, err);
          }
        }
        setSavedLaws(savedLawsData);
        
        // Load recommended laws based on user interests
        // This would normally call a recommendation API endpoint
        // For now, we'll get all laws and filter the first few
        const allLaws = await laws.getAll();
        const recommendations = allLaws.slice(0, 5); // Just take the first few as recommendations
        setRecommendedLaws(recommendations);
        
        // Load recent notifications
        const notificationsData = await notifications.getAll(10);
        setUserNotifications(notificationsData.notifications);
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError("Failed to load your dashboard. Please log in again.");
        setLoading(false);
        
        // Redirect to login after a delay
        setTimeout(() => {
          router.push("/auth");
        }, 2000);
      }
    };
    
    loadDashboardData();
  }, [router]);
  
  const handleMarkNotificationRead = async (notificationId: string) => {
    try {
      await notifications.markAsRead(notificationId);
      // Update the notification in the local state
      setUserNotifications(prevNotifications => 
        prevNotifications.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true } 
            : notif
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };
  
  const handleRemoveSavedLaw = async (lawId: string) => {
    try {
      await laws.unsaveLaw(lawId);
      // Remove from local state
      setSavedLaws(prevLaws => prevLaws.filter(law => law.id !== lawId));
    } catch (err) {
      console.error("Failed to remove saved law:", err);
    }
  };
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading your dashboard...</h2>
          <p className="text-gray-500">Please wait while we gather your personalized information</p>
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.name}
          </h1>
          <p className="mt-1 text-gray-500">
            Your personalized biology knowledge dashboard
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            href="/settings"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Edit Profile
          </Link>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('saved')}
            className={`${
              activeTab === 'saved'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium mr-8`}
          >
            Saved Laws ({savedLaws.length})
          </button>
          <button
            onClick={() => setActiveTab('recommended')}
            className={`${
              activeTab === 'recommended'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium mr-8`}
          >
            Recommendations ({recommendedLaws.length})
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`${
              activeTab === 'notifications'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium mr-8 flex items-center`}
          >
            Notifications ({userNotifications.length})
            {userNotifications.some(n => !n.isRead) && (
              <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                New
              </span>
            )}
          </button>
        </nav>
      </div>
      
      {/* Tab content */}
      <div className="mt-6">
        {/* Saved Laws */}
        {activeTab === 'saved' && (
          <div>
            {savedLaws.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">No saved laws yet</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Browse the laws and save items of interest to see them here.
                </p>
                <div className="mt-6">
                  <Link
                    href="/laws"
                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Browse Laws
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {savedLaws.map((law) => (
                  <li key={law.id} className="py-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          <Link href={`/laws/${law.id}`} className="hover:underline">
                            {law.title}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {law.description}
                        </p>
                        <div className="mt-2 flex items-center">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            {law.category}
                          </span>
                          <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            {Math.round(law.confidenceScore * 100)}% confidence
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveSavedLaw(law.id)}
                        className="rounded-md text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        
        {/* Recommended Laws */}
        {activeTab === 'recommended' && (
          <div>
            {recommendedLaws.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">No recommendations yet</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Update your interests in settings to get personalized recommendations.
                </p>
                <div className="mt-6">
                  <Link
                    href="/settings"
                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Update Interests
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {recommendedLaws.map((law) => (
                  <li key={law.id} className="py-4">
                    <div className="flex items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          <Link href={`/laws/${law.id}`} className="hover:underline">
                            {law.title}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {law.description}
                        </p>
                        <div className="mt-2 flex items-center">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            {law.category}
                          </span>
                          <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            {Math.round(law.confidenceScore * 100)}% confidence
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        
        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div>
            {userNotifications.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
                <p className="mt-2 text-sm text-gray-500">
                  You don't have any notifications at the moment.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {userNotifications.map((notification) => (
                  <li key={notification.id} className={`py-4 ${!notification.isRead ? 'bg-blue-50' : ''}`}>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {notification.type === 'new_law' && (
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </span>
                        )}
                        {notification.type === 'law_update' && (
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </span>
                        )}
                        {notification.type === 'contradiction_detected' && (
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-medium text-gray-900">
                          {notification.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {notification.message}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <div>
                            {notification.url && (
                              <Link 
                                href={notification.url} 
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                              >
                                View details
                              </Link>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkNotificationRead(notification.id)}
                          className="flex-shrink-0 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-800"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 