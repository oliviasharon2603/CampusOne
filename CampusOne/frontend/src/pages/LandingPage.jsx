import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';

const LandingPage = () => {
  return (
    <div className="min-h-screen font-sans antialiased text-gray-900 bg-white selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
      </main>
      {/* Footer will go here */}
    </div>
  );
};

export default LandingPage;
