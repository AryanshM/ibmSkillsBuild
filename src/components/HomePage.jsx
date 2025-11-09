import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserCircle, Heart, Brain, Leaf, Wind, BarChart3, Dumbbell } from "lucide-react";
import DailyRitual from "./DailyRitual";
import WellnessAssistant from "./WellnessAssistant";

function HomePage() {
  const [userProfile, setUserProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

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
      {/* Wellness Assistant */}
      <WellnessAssistant />

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-accent-primary/10 shadow-soft">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-accent-primary" />
            <h1 className="text-2xl font-accent font-bold text-accent-primary">WellSphere</h1>
          </div>
          <button
            onClick={() => setShowProfile(true)}
            className="p-2 rounded-full bg-secondary-alt/30 hover:bg-secondary-alt transition-colors"
            aria-label="View Profile"
          >
            <UserCircle className="w-8 h-8 text-accent-primary" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-wellness opacity-40 -z-10"></div>
        <section className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-accent font-bold text-accent-primary mb-6 leading-tight">
              Your Wellness Journey Begins Here
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
              Nurture your mind, body, and soul with personalized AI insights. A holistic approach to health that creates lasting wellness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#modules" className="btn text-lg">
                Explore Your Path
              </a>
              <a href="#modules" className="btn-outline text-lg">
                Learn More
              </a>
            </div>
          </div>

          {/* Daily Ritual Widget */}
          <div className="mt-16 max-w-2xl mx-auto">
            <p className="text-sm font-semibold text-accent-secondary uppercase tracking-wide mb-4 text-center">Today's Ritual</p>
            <DailyRitual />
          </div>
        </section>
      </div>

      {/* Three Pillars of Wellness */}
      <section className="py-20 bg-secondary-alt/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-16">Three Pillars of Wellness</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <PillarCard
                icon={Brain}
                title="Mind"
                description="Mental clarity, emotional balance, and mindfulness practices for a peaceful mind."
                color="text-accent-secondary"
              />
              <PillarCard
                icon={Heart}
                title="Body"
                description="Physical vitality, nutrition guidance, and wellness practices for a healthy body."
                color="text-accent-tertiary"
              />
              <PillarCard
                icon={Leaf}
                title="Soul"
                description="Inner peace, self-reflection, and spiritual growth for a nurtured soul."
                color="text-accent-primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Modules Section */}
      <section id="modules" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center mb-16">Our Core Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <ServiceCard
              icon={Heart}
              title="Health"
              description="AI-powered disease detection and personalized health insights."
              link="/disease-detector"
              buttonText="Explore"
              color="bg-accent-tertiary"
            />
            <ServiceCard
              icon={Brain}
              title="Mental Health"
              description="Self-assessments and mood insights for emotional well-being."
              link="/quiz"
              buttonText="Explore"
              color="bg-accent-secondary"
            />
            <ServiceCard
              icon={BarChart3}
              title="Lifestyle"
              description="Personalized plans for diet, fitness, and sleep optimization."
              link="/health-planner"
              buttonText="Explore"
              color="bg-accent-primary"
            />
            <ServiceCard
              icon={Wind}
              title="Environment"
              description="Air quality insights for sustainable and healthy living."
              link="/environment"
              buttonText="Explore"
              color="bg-accent-secondary"
            />
            <ServiceCard
              icon={Dumbbell}
              title="Exercises"
              description="Curated workout routines for beginner, intermediate, and advanced levels."
              link="/exercises"
              buttonText="Explore"
              color="bg-accent-primary"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary-alt/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="section-title text-center mb-16">Why Choose WellSphere?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureItem
              title="AI-Powered Insights"
              description="Advanced AI analyzes your unique wellness profile to provide personalized recommendations tailored to your needs."
            />
            <FeatureItem
              title="Holistic Approach"
              description="Address mind, body, and soul together for comprehensive wellness that truly transforms your life."
            />
            <FeatureItem
              title="Continuous Support"
              description="Your wellness assistant is always available to guide you through every step of your journey."
            />
            <FeatureItem
              title="Data-Driven Progress"
              description="Track your wellness metrics and see tangible progress as you work toward your health goals."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-sage text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-4xl font-accent font-bold mb-6">Ready to Transform Your Wellness?</h2>
          <p className="text-lg mb-8 opacity-90">
            Start your wellness journey today with personalized insights and guidance every step of the way.
          </p>
          <a href="#modules" className="inline-block bg-white text-accent-primary font-bold py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-300">
            Begin Your Journey
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-text-primary text-white py-12 border-t border-accent-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Leaf className="w-6 h-6" />
              <p className="text-xl font-accent font-bold">WellSphere</p>
            </div>
            <p className="text-white/80 mb-6">
              Empowering your health through intelligent, holistic wellness guidance.
            </p>
            <p className="text-white/60 text-sm">
              &copy; 2025 WellSphere — Nurturing Mind, Body, and Soul
            </p>
          </div>
        </div>
      </footer>

      {/* Profile Modal */}
      {showProfile && (
        <div className="modal-overlay flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="modal-content w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-6 right-6 text-text-secondary hover:text-text-primary text-2xl font-bold transition"
              aria-label="Close"
            >
              ✕
            </button>

            <h2 className="text-4xl font-accent font-bold text-accent-primary mb-12 text-center">
              Your 360° Wellness Report
            </h2>

            {userProfile ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ProfileCard
                  title="Physical Health"
                  icon={Heart}
                  data={userProfile.healthProfile}
                  fallback="No health analysis yet. Try the Health module."
                  color="text-accent-tertiary"
                />
                <ProfileCard
                  title="Mental Wellness"
                  icon={Brain}
                  data={userProfile.mentalHealthProfile}
                  fallback="No mental health data yet. Take the Self-Assessment."
                  color="text-accent-secondary"
                />
                <ProfileCard
                  title="Environment"
                  icon={Leaf}
                  data={userProfile.environmentProfile}
                  fallback="No environmental data yet. Explore Environment Insights."
                  color="text-accent-primary"
                />
              </div>
            ) : (
              <p className="text-center text-text-secondary italic py-12">
                No profile data yet. Start exploring modules to build your wellness profile!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PillarCard({ icon: Icon, title, description, color }) {
  return (
    <div className="card text-center">
      <Icon className={`wellness-icon mx-auto mb-4 ${color}`} />
      <h3 className="text-2xl font-bold text-text-primary mb-3">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
}

function ServiceCard({ icon: Icon, title, description, link, buttonText, color }) {
  return (
    <div className="card hover:-translate-y-1">
      <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
      <p className="text-text-secondary text-sm mb-6 flex-grow">{description}</p>
      <Link
        to={link}
        className="inline-block btn text-center w-full text-sm"
      >
        {buttonText}
      </Link>
    </div>
  );
}

function FeatureItem({ title, description }) {
  return (
    <div className="card">
      <h3 className="text-xl font-bold text-accent-primary mb-3">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
}

function ProfileCard({ title, icon: Icon, data, fallback, color }) {
  const hasData = data && Object.keys(data).length > 0;

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <Icon className={`wellness-icon ${color}`} />
        <h3 className="text-xl font-bold text-text-primary">{title}</h3>
      </div>
      {hasData ? (
        <div className="space-y-3">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="text-sm">
              <p className="font-semibold text-text-primary capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </p>
              <p className="text-text-secondary text-xs mt-1">
                {Array.isArray(value)
                  ? value.join(", ")
                  : typeof value === "object"
                  ? JSON.stringify(value, null, 2)
                  : String(value)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-text-secondary italic text-sm">{fallback}</p>
      )}
    </div>
  );
}

export default HomePage;
