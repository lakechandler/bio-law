"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, laws, notifications } from "@/lib/api";
import { User } from "@/types/user";
import { Law } from "@/types/law";
import { Notification } from "@/types/notification";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [savedLaws, setSavedLaws] = useState<Law[]>([]);
  const [userNotifications, setUserNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get authenticated user
        const userData = await auth.getUser();
        setUser(userData);
        
        // Get saved laws
        const savedLawIds = await laws.getSaved();
        
        // Fetch each law by ID
        const lawsData: Law[] = [];
        for (const id of savedLawIds) {
          try {
            const law = await laws.getById(id);
            lawsData.push(law);
          } catch (error) {
            // Continue if a single law fails to load
            console.error(`Failed to load law ${id}:`, error);
          }
        }
        setSavedLaws(lawsData);
        
        // Get notifications
        const notificationsData = await notifications.getAll();
        setUserNotifications(notificationsData.notifications);
        
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

  const handleMarkRead = async (notificationId: string) => {
    try {
      await notifications.markAsRead(notificationId);
      
      // Update UI
      setUserNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notifications.markAllAsRead();
      
      // Update UI
      setUserNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleUnsaveLaw = async (lawId: string) => {
    try {
      await laws.unsaveLaw(lawId);
      
      // Update UI
      setSavedLaws(prev => prev.filter(law => law.id !== lawId));
    } catch (error) {
      console.error("Failed to unsave law:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading...</h2>
          <p className="text-gray-500">Please wait while we load your dashboard</p>
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        {user && (
          <p className="mt-1 text-gray-500">
            Welcome back, {user.name}
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Saved Laws */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Saved Laws</h2>
            <a 
              href="/laws" 
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Browse all laws
            </a>
          </div>
          
          {savedLaws.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
              <p className="text-gray-500">You haven't saved any laws yet.</p>
              <a 
                href="/laws" 
                className="mt-2 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Browse laws to save
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {savedLaws.map((law) => (
                <div 
                  key={law.id} 
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        <a href={`/laws/${law.id}`}>{law.title}</a>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {law.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                          {law.category}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                          {Math.round(law.confidenceScore * 100)}% confidence
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnsaveLaw(law.id)}
                      className="ml-4 inline-flex items-center rounded-full bg-white p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
            {userNotifications.length > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          {userNotifications.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
              <p className="text-gray-500">You don't have any notifications.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`rounded-lg border ${notification.isRead ? 'border-gray-200 bg-white' : 'border-indigo-200 bg-indigo-50'} p-4 shadow-sm`}
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{notification.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <time dateTime={notification.createdAt.toString()}>
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </time>
                          <span className="mx-2">·</span>
                          <span className={`${notification.isRead ? 'text-gray-500' : 'font-medium text-indigo-700'}`}>
                            {notification.isRead ? 'Read' : 'Unread'}
                          </span>
                        </div>
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkRead(notification.id)}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 