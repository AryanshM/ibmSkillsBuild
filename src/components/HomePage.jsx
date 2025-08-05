import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="min-h-screen bg-primary text-text-primary font-sans">
      <div className="fixed bottom-4 right-4 bg-secondary text-text-primary p-4 rounded-lg shadow-lg">
        ilk
      </div>
      <div className="container mx-auto px-4 py-16">
        <header className="min-h-screen flex flex-col justify-center items-center text-center rounded-xl p-8 mb-20 animate -slide-in text-white shadow-xl">
          <h1 className="text-5xl font-bold text-accent mb-4">SereneMind</h1>
          <p className="text-2xl text-text-secondary mb-8">
            Your journey to mental wellness starts here.
          </p>
          <a href="#services" className="btn text-lg">
            Explore Services
          </a>
        </header>

        <section id="services" className="py-16">
          <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard
              title="Mental Health Screening"
              description="Take a quick self-assessment quiz to understand your mental well-being."
              link="/quiz"
              buttonText="Begin Self-Assessment"
            />
            <ServiceCard
              title="Disease Detector"
              description="Identify potential health risks based on your symptoms and history."
              link="/disease-detector"
              buttonText="Explore Disease Detector"
            />
            <ServiceCard
              title="Personalized Health Plan"
              description="Get a customized health plan tailored to your specific needs and goals."
              link="/health-planner"
              buttonText="Discover Your Health Plan"
            />
          </div>
        </section>
      </div>
      <footer className="text-center text-text-secondary py-8">
        <p>&copy; 2025 SereneMind</p>
      </footer>
    </div>
  );
}

function ServiceCard({ title, description, link, buttonText }) {
  return (
    <div className="bg-secondary rounded-4xl p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300 flex flex-col animate-fade-in">
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-text-secondary mb-6 flex-grow">{description}</p>
      <Link to={link} className="btn mt-auto text-center">
        {buttonText}
      </Link>
    </div>
  );
}

export default HomePage;