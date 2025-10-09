import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserCircle } from "lucide-react"; // 🔹 Lightweight icon from lucide-react

function HomePage() {
  const [userProfile, setUserProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false); // Modal toggle

  // 🧠 Load user profile from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("userProfile");
    if (stored) {
      try {
        setUserProfile(JSON.parse(stored));
      } catch (error) {
        console.error("Error parsing userProfile:", error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-primary text-text-primary font-sans relative">
      {/* Floating Tag */}
      <div className="fixed bottom-4 right-4 bg-secondary text-text-primary p-4 rounded-lg shadow-lg">
        ilk
      </div>

      {/* 👤 Profile Icon (Top Right Corner) */}
      <button
        onClick={() => setShowProfile(true)}
        className="fixed top-6 right-6 p-2 bg-secondary rounded-full hover:bg-accent/20 transition-colors duration-300 shadow-lg"
        aria-label="View Profile"
      >
        <UserCircle className="w-8 h-8 text-accent" />
      </button>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <header className="min-h-screen flex flex-col justify-center items-center text-center rounded-xl p-8 mb-20 animate-slide-in text-white shadow-xl">
          <h1 className="text-5xl font-bold text-accent mb-4">Well Sphere</h1>
          <p className="text-2xl text-text-secondary mb-8 max-w-2xl">
            Your unified AI platform for Health, Mental Wellness, Lifestyle, and Environmental Insights.
          </p>
          <a href="#modules" className="btn text-lg">
            Explore Core Modules
          </a>
        </header>

        {/* Core Modules Section */}
        <section id="modules" className="py-16">
          <h2 className="text-4xl font-bold text-center mb-12">Our Core Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ServiceCard
              title="Health"
              description="AI-powered disease detection, dermatology insights, and personalized diagnosis to monitor your physical health."
              link="/disease-detector"
              buttonText="Explore Health"
            />
            <ServiceCard
              title="Mental Health"
              description="Take self-assessments, get mood insights, and receive AI-driven support for better emotional well-being."
              link="/quiz"
              buttonText="Start Assessment"
            />
            <ServiceCard
              title="Lifestyle"
              description="Personalized AI planner to help you optimize diet, fitness, and sleep for a healthier daily life."
              link="/health-planner"
              buttonText="Plan Your Lifestyle"
            />
            <ServiceCard
              title="Environment"
              description="Analyze air quality, plant health, waste patterns, and green space data for sustainable living."
              link="/environment"
              buttonText="Discover Insights"
            />
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="text-center text-text-secondary py-8 border-t border-text-secondary/20">
        <p>&copy; 2025 WellSphere — Empowering Health Through Intelligence</p>
      </footer>

      {/* 🧩 Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-secondary rounded-3xl shadow-2xl p-10 w-full max-w-5xl max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-4 right-4 text-accent hover:text-red-400 text-xl font-bold transition"
            >
              ✕
            </button>

            <h2 className="text-4xl font-bold text-center text-accent mb-10">
              Your 360° Wellness Report
            </h2>

            {userProfile ? (
              <div className="flex flex-col md:flex-row gap-8">
                <ProfileCard
                  title="Health"
                  data={userProfile.healthProfile}
                  fallback="No health analysis yet. Try Disease Detector."
                />
                <ProfileCard
                  title="Mental Health"
                  data={userProfile.mentalHealthProfile}
                  fallback="No mental health data yet. Take the Self-Assessment Quiz."
                />
                <ProfileCard
                  title="Environment"
                  data={userProfile.environmentProfile}
                  fallback="No environmental analysis yet. Visit Environment Insights."
                />
              </div>
            ) : (
              <p className="text-center text-text-secondary italic">
                No profile data found. Try using the modules first.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ✅ Reusable Profile Card (No Scrollbar, Auto Height, Proper Wrapping) */
function ProfileCard({ title, data, fallback }) {
  const hasData = data && Object.keys(data).length > 0;

  return (
    <div className="bg-primary/40 flex-1 rounded-3xl p-6 shadow-inner hover:shadow-card-hover transition-all duration-300 break-words overflow-hidden">
      <h3 className="text-2xl font-bold mb-4 text-accent">{title}</h3>
      {hasData ? (
        <div className="space-y-3">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="text-text-secondary text-sm leading-relaxed">
              <span className="font-semibold text-text-primary capitalize">
                {key.replace(/([A-Z])/g, " $1")}:
              </span>
              <div className="mt-1 ml-2 text-text-secondary break-words whitespace-pre-wrap">
                {Array.isArray(value)
                  ? value.join(", ")
                  : typeof value === "object"
                  ? JSON.stringify(value, null, 2)
                  : String(value)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-text-secondary italic">{fallback}</p>
      )}
    </div>
  );
}

/* 🔹 Reusable Service Card for Modules */
function ServiceCard({ title, description, link, buttonText }) {
  return (
    <div className="bg-secondary rounded-3xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col items-start animate-fade-in hover:-translate-y-1">
      <h3 className="text-2xl font-bold mb-4 text-accent">{title}</h3>
      <p className="text-text-secondary mb-6 flex-grow leading-relaxed">{description}</p>
      <Link
        to={link}
        className="btn mt-auto text-center px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors duration-300"
      >
        {buttonText}
      </Link>
    </div>
  );
}

export default HomePage;
