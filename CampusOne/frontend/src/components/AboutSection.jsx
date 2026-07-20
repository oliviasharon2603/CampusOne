import React from 'react';
import { MapPin, Target, Lightbulb, Users } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 relative">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
              <div className="absolute inset-0 bg-indigo-600/10 mix-blend-multiply"></div>
              <img 
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1000" 
                alt="Students walking on campus" 
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            {/* Location Badge */}
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl flex items-start gap-4 max-w-sm">
              <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Premium Location</h4>
                <p className="text-gray-500 text-sm mt-1">Located in the vibrant educational hub of Trichy, Tamil Nadu.</p>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 lg:pl-8 mt-12 lg:mt-0">
            <h2 className="text-sm font-bold text-indigo-600 tracking-widest uppercase mb-3">About Our Campus</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Shaping the Innovators of Tomorrow.
            </h3>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Nestled in the heart of Trichy, Tamil Nadu, our campus stands as a beacon of academic excellence and modern infrastructure. We blend traditional values with cutting-edge technology to create a holistic learning environment.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="shrink-0 bg-purple-100 p-3 rounded-xl text-purple-600 h-12 w-12 flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">Our Mission</h4>
                  <p className="text-gray-600">To empower students with a centralized digital campus experience.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="shrink-0 bg-blue-100 p-3 rounded-xl text-blue-600 h-12 w-12 flex items-center justify-center">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">Innovation First</h4>
                  <p className="text-gray-600">Fostering a culture of tech-driven problem solving and creativity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
