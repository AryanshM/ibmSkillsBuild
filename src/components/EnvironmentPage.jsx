import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wind, Droplets, Gauge, Thermometer, Home, AlertCircle } from "lucide-react";
import { generateEnvironmentGuidelines } from "../llm/Environment";

function EnvironmentPage() {
  const navigate = useNavigate();
  const [envData, setEnvData] = useState(null);
  const [guidelines, setGuidelines] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnvironmentData = async () => {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature"
        );
        const data = await response.json();

        const mockAQI = Math.floor(Math.random() * (180 - 40) + 40);

        setEnvData({
          location: "New Delhi, India",
          aqi: mockAQI,
          temperature: data.current.temperature_2m,
          feelsLike: data.current.apparent_temperature,
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          lastUpdated: new Date().toLocaleString(),
        });
      } catch (err) {
        console.error(err);
        setError("Failed to fetch environmental data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnvironmentData();
  }, []);

  useEffect(() => {
    if (!envData) return;

    const fetchGuidelines = async () => {
      try {
        setAiLoading(true);
        const aiResponse = await generateEnvironmentGuidelines(envData);
        setGuidelines(aiResponse);
      } catch (err) {
        console.error(err);
        setGuidelines({
          error: true,
          message: "AI failed to generate recommendations.",
        });
      } finally {
        setAiLoading(false);
      }
    };

    fetchGuidelines();
  }, [envData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center animate-pulse">
          <Wind className="w-16 h-16 text-accent-primary mx-auto mb-4" />
          <h1 className="text-4xl font-accent font-bold text-text-primary mb-2">Environmental Harmony</h1>
          <p className="text-text-secondary">Analyzing your environment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="card max-w-2xl text-center">
          <AlertCircle className="w-16 h-16 text-danger mx-auto mb-4" />
          <h1 className="text-4xl font-accent font-bold text-text-primary mb-4">Unable to Load</h1>
          <p className="text-text-secondary mb-8">{error}</p>
          <button className="btn" onClick={() => navigate("/")}>
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const getAQIColor = (aqi) => {
    if (aqi < 50) return "text-success";
    if (aqi < 100) return "text-warning";
    if (aqi < 150) return "text-danger";
    return "text-danger";
  };

  const getAQILevel = (aqi) => {
    if (aqi < 50) return "Good";
    if (aqi < 100) return "Moderate";
    if (aqi < 150) return "Unhealthy";
    return "Very Unhealthy";
  };

  return (
    <div className="min-h-screen bg-primary text-text-primary font-sans">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-accent font-bold text-accent-primary mb-4">
            Environmental Harmony
          </h1>
          <p className="text-xl text-text-secondary">
            Understand your environment and optimize your wellness
          </p>
        </div>

        {/* Location Card */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="card-lg text-center border-2 border-accent-primary/20">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Home className="w-6 h-6 text-accent-primary" />
              <h2 className="text-3xl font-accent font-bold text-accent-primary">{envData.location}</h2>
            </div>
            <p className="text-sm text-text-secondary">
              Last updated: {envData.lastUpdated}
            </p>
          </div>
        </div>

        {/* Environmental Metrics Grid */}
        <div className="max-w-5xl mx-auto mb-16">
          <h3 className="text-2xl font-accent font-bold text-text-primary mb-8">Current Conditions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard
              icon={Gauge}
              label="Air Quality Index"
              value={envData.aqi}
              unit="AQI"
              level={getAQILevel(envData.aqi)}
              colorClass={getAQIColor(envData.aqi)}
            />
            <MetricCard
              icon={Thermometer}
              label="Temperature"
              value={envData.temperature.toFixed(1)}
              unit="°C"
              subtitle={`Feels like ${envData.feelsLike.toFixed(1)}°C`}
              colorClass="text-accent-tertiary"
            />
            <MetricCard
              icon={Droplets}
              label="Humidity"
              value={envData.humidity}
              unit="%"
              colorClass="text-accent-secondary"
            />
            <MetricCard
              icon={Wind}
              label="Wind Speed"
              value={envData.windSpeed.toFixed(1)}
              unit="km/h"
              colorClass="text-accent-primary"
            />
          </div>
        </div>

        {/* AI Guidelines Section */}
        {aiLoading && (
          <div className="max-w-4xl mx-auto mb-16">
            <div className="card-lg text-center">
              <div className="animate-pulse flex flex-col items-center">
                <Wind className="w-12 h-12 text-accent-secondary mb-4 animate-spin" />
                <p className="text-lg text-text-secondary">Generating personalized wellness guidance...</p>
              </div>
            </div>
          </div>
        )}

        {guidelines && !guidelines.error && !aiLoading && (
          <div className="max-w-4xl mx-auto mb-16 animate-fade-in">
            <div className="card-lg border-2 border-accent-primary/20">
              <h3 className="text-3xl font-accent font-bold text-accent-primary mb-6">
                Wellness Recommendations
              </h3>
              
              <div className="bg-secondary-alt/30 rounded-xl p-6 mb-8">
                <p className="text-lg text-text-secondary leading-relaxed">
                  {guidelines.environment_summary}
                </p>
              </div>

              <div className="mb-8">
                <h4 className="text-xl font-bold text-text-primary mb-6">Your Personalized Guidelines:</h4>
                <div className="space-y-4">
                  {guidelines.guidelines.map((guideline, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-accent-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-accent-primary font-bold text-sm">{i + 1}</span>
                      </div>
                      <p className="text-text-secondary pt-1">{guideline}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-soft rounded-xl p-6">
                <p className="text-sm text-text-secondary mb-2">Risk Assessment</p>
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${getRiskColorBg(guidelines.risk_level)}`}></div>
                  <span className="text-xl font-bold text-text-primary">{guidelines.risk_level}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {guidelines && guidelines.error && (
          <div className="max-w-4xl mx-auto mb-16 animate-fade-in">
            <div className="card-lg border-2 border-danger/30 bg-danger/5">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-danger flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-danger mb-2">Guidance Unavailable</h3>
                  <p className="text-text-secondary">{guidelines.message}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Health Tips Based on Environment */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-2xl font-accent font-bold text-text-primary mb-8">Wellness Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WellnessTip
              title="Air Quality"
              content={envData.aqi > 100 ? 
                "Consider limiting outdoor activities. Use air purifiers indoors." : 
                "Great day to spend time outdoors! Get some fresh air and exercise."
              }
              icon="Wind"
            />
            <WellnessTip
              title="Hydration"
              content={envData.temperature > 25 ? 
                "High temperature detected. Increase your water intake throughout the day." : 
                "Maintain consistent hydration. It's important year-round."
              }
              icon="Droplets"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="max-w-4xl mx-auto text-center">
          <button className="btn" onClick={() => navigate("/")}>
            Return Home
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="disclaimer mx-4 mt-16 mb-8">
        <strong>Disclaimer:</strong> Environmental data is based on general weather APIs and AI-generated recommendations. For health concerns, consult a healthcare professional.
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, unit, level, subtitle, colorClass }) {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-text-secondary font-semibold mb-1">{label}</p>
          {level && <p className="text-xs font-bold text-accent-primary">{level}</p>}
        </div>
        <Icon className={`w-6 h-6 ${colorClass || 'text-accent-primary'}`} />
      </div>
      <div className="mb-2">
        <span className={`text-4xl font-bold ${colorClass || 'text-text-primary'}`}>
          {value}
        </span>
        <span className="text-lg text-text-secondary ml-2">{unit}</span>
      </div>
      {subtitle && <p className="text-xs text-text-secondary">{subtitle}</p>}
    </div>
  );
}

function WellnessTip({ title, content, icon }) {
  return (
    <div className="card">
      <h4 className="text-lg font-bold text-accent-primary mb-3">{title}</h4>
      <p className="text-text-secondary">{content}</p>
    </div>
  );
}

function getRiskColorBg(level) {
  switch (level.toLowerCase()) {
    case 'low':
      return 'bg-success';
    case 'moderate':
      return 'bg-warning';
    case 'high':
    case 'severe':
      return 'bg-danger';
    default:
      return 'bg-accent-primary';
  }
}

export default EnvironmentPage;
