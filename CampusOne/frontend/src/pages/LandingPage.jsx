import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import DepartmentsPreview from '../components/DepartmentsPreview';
import AIFeatureSection from '../components/AIFeatureSection';
import AboutSection from '../components/AboutSection';

const LandingPage = () => {
  return (
    <div className="min-h-screen font-sans antialiased text-gray-900 bg-white selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <DepartmentsPreview />
        <AIFeatureSection />
        <AboutSection />
      </main>
      
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800 text-center">
        <p>&copy; {new Date().getFullYear()} CampusOne, Trichy, Tamil Nadu. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
