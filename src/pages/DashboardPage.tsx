import React, { useState, useEffect } from "react";
import {
  MapPin,
  Play,
  Square,
  Coffee,
  Navigation,
  FileText,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/api";

const statusOptions = [
  {
    value: "starting working",
    label: "Start Work",
    icon: Play,
    color: "from-green-500 to-emerald-600",
  },
  {
    value: "breaking",
    label: "Taking a Break",
    icon: Coffee,
    color: "from-yellow-500 to-orange-600",
  },
  {
    value: "moving",
    label: "Traveling",
    icon: Navigation,
    color: "from-blue-500 to-cyan-600",
  },
  {
    value: "ending",
    label: "End Work",
    icon: Square,
    color: "from-red-500 to-rose-600",
  },
];

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [locationError, setLocationError] = useState("");
  const [workDescription, setWorkDescription] = useState("");
  const [isLoggingEvent, setIsLoggingEvent] = useState(false);
  const [isLoggingWork, setIsLoggingWork] = useState(false);
  const [eventSuccess, setEventSuccess] = useState("");
  const [workSuccess, setWorkSuccess] = useState("");
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError("");
        },
        (error) => {
          console.error(error);
          setLocationError(
            "Unable to get your location. Please enable location services."
          );
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  };

  const handleLogEvent = async () => {
    if (!selectedStatus || !location) {
      setError("Please select a status and ensure location is available.");
      return;
    }

    setIsLoggingEvent(true);
    setError("");
    setEventSuccess("");

    try {
      const locationString = `${location.lat}, ${location.lng}`;
      await apiService.logEvent({
        status: selectedStatus,
        location: locationString,
      });

      setEventSuccess("Event logged successfully!");
      setSelectedStatus("");
      setTimeout(() => setEventSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to log event. Please try again.");
    } finally {
      setIsLoggingEvent(false);
    }
  };

  const handleLogWork = async () => {
    if (!workDescription.trim()) {
      setError("Please enter a work description.");
      return;
    }

    setIsLoggingWork(true);
    setError("");
    setWorkSuccess("");

    try {
      await apiService.logWork({
        description: workDescription,
      });

      setWorkSuccess("Work logged successfully!");
      setWorkDescription("");
      setTimeout(() => setWorkSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to log work. Please try again.");
    } finally {
      setIsLoggingWork(false);
    }
  };

  
async function reverseGeocode(lat: number, lng: number) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&zoom=18`
    );
    
    const data = await response.json();

    if (data && data.address) {
      const addressParts = [
        data.address.road,
        data.address.suburb,
        data.address.city,
        data.address.state //,data.address.country
      ].filter(Boolean);

      const fullAddress = addressParts.join(", ") || "Unknown location";
      setAddress(fullAddress);
    } else {
      setAddress("Failed to fetch address");
    }
  } catch (error) {
    console.error(error);
    setAddress("Failed to fetch address");
  }
}

useEffect(() => {
  if (location && location.lat && location.lng) {
    reverseGeocode(location.lat, location.lng);
  }
}, [location]);

const selectedStatusOption = statusOptions.find(
  (option) => option.value === selectedStatus
);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-20 h-full -m-5 p-0">
              <img
                src="/CYin-logo.png"
                alt="CYin Logo"
                className="scale-50"
              />
            </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                CYin
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{user?.email}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 bg-white text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-xl p-2 rounded-xl"
              >
                <LogOut className="w-4 h-4 text-red-500 " />
                <span className="text-sm text-red-500">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Welcome back! 👋
          </h2>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {eventSuccess && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl mb-6">
            {eventSuccess}
          </div>
        )}

        {workSuccess && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 px-4 py-3 rounded-xl mb-6">
            {workSuccess}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Logging Card */}
          <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl shadow-2xl shadow-blue-500/10 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                CYin Event
              </h3>
            </div>

            {/* Location Status */}
            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Current Location
                </span>
              </div>
              {location ? (
                // Show the human-readable address instead of raw coordinates
                <p className="text-sm text-green-600 dark:text-green-400">
                  📍 {address || "Loading address..."}
                </p>
              ) : (
                <div>
                  <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                    {locationError || "Getting location..."}
                  </p>
                  <button
                    onClick={getCurrentLocation}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    Retry Location
                  </button>
                </div>
              )}
            </div>

            {/* Current Status Display */}
          {selectedStatusOption && (
            <div className="mt-8 bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl shadow-2xl p-6">
              <div className="flex items-center justify-center space-x-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${selectedStatusOption.color} rounded-2xl flex items-center justify-center`}
                >
                  <selectedStatusOption.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Selected Status
                  </p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedStatusOption.label}
                  </p>
                </div>
              </div>
            </div>
          )}

            {/* Status Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Select Status
              </label>
              <div className="grid grid-cols-1 gap-3">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedStatus(option.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedStatus === option.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 bg-slate-50 dark:bg-slate-700/50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${option.color} rounded-xl flex items-center justify-center`}
                      >
                        <option.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {option.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleLogEvent}
              disabled={isLoggingEvent || !selectedStatus || !location}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoggingEvent ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <MapPin className="w-5 h-5" />
                  <span>Add New Event</span>
                </>
              )}
            </button>
          </div>
          

          {/* Work Logging Card */}
          <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl shadow-2xl shadow-purple-500/10 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                CYin Work
              </h3>
            </div>

            <div className="mb-6">
              <label
                htmlFor="workDescription"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3"
              >
                Work Description
              </label>
              <textarea
                id="workDescription"
                value={workDescription}
                onChange={(e) => setWorkDescription(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 resize-none"
                placeholder="Describe what you're working on..."
              />
            </div>

            <button
              onClick={handleLogWork}
              disabled={isLoggingWork || !workDescription.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoggingWork ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  <span>Send</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
