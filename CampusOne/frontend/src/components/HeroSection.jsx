import { Link } from 'react-router-dom';
import { ArrowRight, Bot } from 'lucide-react';

const HeroSection = () => {
  return (
    <div style={{ paddingTop: '150px', paddingBottom: '100px', backgroundColor: '#f9fafb', minHeight: '60vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
        
        {/* Simple Pill */}
        <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#e0e7ff', padding: '8px 16px', borderRadius: '999px', marginBottom: '30px' }}>
          <Bot style={{ width: '20px', height: '20px', color: '#4338ca', marginRight: '8px' }} />
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#312e81' }}>Powered by Google Gemini AI</span>
        </div>
        
        {/* Main Heading */}
        <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#111827', marginBottom: '20px', lineHeight: '1.2' }}>
          One Campus. One Platform. <br />
          <span style={{ color: '#4f46e5' }}>Infinite Possibilities.</span>
        </h1>
        
        {/* Paragraph */}
        <p style={{ fontSize: '1.25rem', color: '#4b5563', maxWidth: '800px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
          CampusOne is your AI-powered Digital Campus Companion. We centralize every campus service into one intelligent platform to simplify your student journey.
        </p>
        
        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', padding: '16px 32px', fontSize: '1.125rem', fontWeight: '500', borderRadius: '999px', color: '#fff', backgroundColor: '#4f46e5', textDecoration: 'none' }}>
            Get Started
            <ArrowRight style={{ marginLeft: '8px', width: '20px', height: '20px' }} />
          </Link>
          <a href="#features" style={{ display: 'inline-flex', alignItems: 'center', padding: '16px 32px', fontSize: '1.125rem', fontWeight: '500', borderRadius: '999px', color: '#4338ca', backgroundColor: '#e0e7ff', textDecoration: 'none' }}>
            Explore Features
          </a>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;
