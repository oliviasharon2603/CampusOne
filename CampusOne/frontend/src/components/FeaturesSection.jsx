import { GraduationCap, BookOpen, Calendar, MessageSquare, Briefcase, Bell } from 'lucide-react';

const features = [
  {
    icon: <BookOpen className="w-6 h-6 text-blue-500" />,
    title: "Smart Library",
    description: "Search, borrow, and receive AI-recommended reading paths."
  },
  {
    icon: <GraduationCap className="w-6 h-6 text-indigo-500" />,
    title: "Department Hub",
    description: "Connect with faculty and explore departmental achievements."
  },
  {
    icon: <Calendar className="w-6 h-6 text-purple-500" />,
    title: "College Events",
    description: "Never miss a hackathon, workshop, or cultural fest."
  },
  {
    icon: <Briefcase className="w-6 h-6 text-rose-500" />,
    title: "Career Roadmap",
    description: "AI-generated personalized paths for your career goals."
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-emerald-500" />,
    title: "Complaint Portal",
    description: "Report issues easily and track resolution in real-time."
  },
  {
    icon: <Bell className="w-6 h-6 text-amber-500" />,
    title: "Smart Notifications",
    description: "Stay updated on attendance, deadlines, and opportunities."
  }
];

const FeaturesSection = () => {
  return (
    <section id="explore" className="py-24 bg-white transition-colors duration-300 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold text-indigo-600 tracking-widest uppercase mb-3">Everything You Need</h2>
          <p className="text-3xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
            A comprehensive digital ecosystem
          </p>
          <p className="mt-6 text-xl text-gray-500 leading-relaxed">
            CampusOne integrates every essential campus service into beautifully designed modules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group">
              <div className="bg-gray-50 group-hover:bg-indigo-50 inline-block p-4 rounded-2xl mb-6 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
