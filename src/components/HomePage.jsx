// src/components/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="home-page">
      <header>
        <h1>SereneMind</h1>
        <p>Welcome to SereneMind. Explore our mental wellness tools.</p>
        <div className="cta">
          <a href="#services" className="start-button">
            Explore Services
          </a>
        </div>
      </header>
      <div className='home-page-landing'></div>

      <section id="services" className="services">
        <h2>Our Services</h2>
        <div className="service-container">
          <div className="service-card">
            <h3>Mental Health Screening</h3>
            <p>Take a quick self-assessment quiz to understand your mental well-being.</p>
            <Link to="/quiz" className="start-button">
              Begin Self-Assessment
            </Link>
          </div>

          <div className="service-card">
            <h3>Disease Detector</h3>
            <p>Identify potential health risks based on your symptoms and history.</p>
            <Link to="/disease-detector" className="start-button">
              Explore Disease Detector
            </Link>
          </div>

          <div className="service-card">
            <h3>Personalized Health Plan</h3>
            <p>Get a customized health plan tailored to your specific needs and goals.</p>
            <Link to="/health-planner" className="start-button">
              Discover Your Health Plan
            </Link>
          </div>
        </div>
      </section>

      <footer>
        <p>&copy; 2025 SereneMind</p>
      </footer>
    </div>
  );
}

export default HomePage;