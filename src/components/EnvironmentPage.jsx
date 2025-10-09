import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateEnvironmentGuidelines } from "../llm/Environment";

function EnvironmentPage() {
  const navigate = useNavigate();
  const [envData, setEnvData] = useState(null);
  const [guidelines, setGuidelines] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🛰️ Fetch raw environmental data
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

  // 🧠 Trigger Gemini AI once envData is available
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

  // 🌀 Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-primary text-text-primary flex items-center justify-center">
        <div className="text-center animate-pulse">
          <h1 className="text-4xl font-bold text-accent mb-4">Fetching Environment...</h1>
          <p className="text-text-secondary">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center text-center">
        <div>
          <h1 className="text-4xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-text-secondary mb-6">{error}</p>
          <button className="btn" onClick={() => navigate("/")}>Go Back</button>
        </div>
      </div>
    );
  }

  // 🌍 Main UI
  return (
    <div className="min-h-screen bg-primary text-text-primary font-sans flex flex-col items-center justify-center">
      <div className="container mx-auto px-4 py-16 text-center animate-fade-in">
        <h1 className="text-5xl font-bold text-accent mb-12">Environmental Insights</h1>

        {/* Environment Data */}
        <div className="bg-secondary p-12 rounded-4xl shadow-card max-w-4xl mx-auto space-y-8">
          <h2 className="text-3xl font-semibold mb-6 text-accent">{envData.location}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <InfoCard label="Air Quality Index (AQI)" value={envData.aqi} />
            <InfoCard label="Temperature" value={`${envData.temperature} °C`} />
            <InfoCard label="Feels Like" value={`${envData.feelsLike} °C`} />
            <InfoCard label="Humidity" value={`${envData.humidity} %`} />
            <InfoCard label="Wind Speed" value={`${envData.windSpeed} km/h`} />
          </div>

          <p className="text-text-secondary mt-8 text-sm">Last updated: {envData.lastUpdated}</p>
        </div>

        {/* AI Output */}
        {aiLoading && (
          <div className="mt-12 text-accent animate-pulse text-xl">Analyzing environmental conditions...</div>
        )}

        {guidelines && !guidelines.error && !aiLoading && (
          <div className="bg-secondary p-10 mt-16 rounded-4xl shadow-card max-w-4xl mx-auto text-left">
            <h3 className="text-3xl font-bold text-accent mb-6">AI Environmental Advisory</h3>
            <p className="text-text-secondary mb-6">{guidelines.environment_summary}</p>
            <ul className="list-disc ml-6 space-y-3 text-text-primary">
              {guidelines.guidelines.map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
            <p className="mt-6 font-semibold text-lg">
              Risk Level: <span className="text-accent">{guidelines.risk_level}</span>
            </p>
          </div>
        )}

        {guidelines && guidelines.error && (
          <div className="bg-red-800/30 border border-red-500 text-red-300 p-8 mt-12 rounded-3xl max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold mb-2">AI Advisory Failed</h3>
            <p>{guidelines.message}</p>
          </div>
        )}

        <button className="btn mt-12" onClick={() => navigate("/")}>Back to Home</button>
      </div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-primary/40 p-6 rounded-2xl shadow-inner hover:shadow-card-hover transition-shadow duration-300">
      <p className="text-lg text-text-secondary mb-2">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

export default EnvironmentPage;
