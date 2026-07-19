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
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">Everything You Need</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            A comprehensive digital ecosystem
          </p>
          <p className="mt-4 text-xl text-gray-500">
            CampusOne integrates every essential campus service into beautifully designed modules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
              <div className="bg-gray-50 inline-block p-3 rounded-xl mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
