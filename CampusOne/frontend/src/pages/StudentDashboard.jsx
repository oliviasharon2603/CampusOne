import { Calendar, BookOpen, Clock, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
    <div className={`p-3 rounded-lg ${colorClass}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const StudentDashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Dashboard Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Good Morning, Olivia 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Thursday, August 15, 2026</p>
        
        {/* Quick AI Tip Banner */}
        <div className="mt-4 bg-primary-50 border border-primary-100 rounded-xl p-4 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-3 text-primary-800">
            <div className="w-2 h-2 rounded-full bg-primary-500"></div>
            <p className="text-sm font-medium">CampusOne AI Tip: You have a Software Engineering assignment due tomorrow.</p>
          </div>
          <Button variant="secondary" size="small">View Details</Button>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Attendance" value="86%" icon={Clock} colorClass="bg-accent-50 text-accent-600" />
        <StatCard title="Upcoming Events" value="3" icon={Calendar} colorClass="bg-primary-50 text-primary-600" />
        <StatCard title="Library Requests" value="1" icon={BookOpen} colorClass="bg-secondary-50 text-secondary-600" />
        <StatCard title="Notifications" value="2" icon={AlertCircle} colorClass="bg-warning-50 text-warning-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Today's Schedule</h2>
            <button className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center">
              View Timetable <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { time: '09:00 AM', course: 'Machine Learning', room: 'Lab 301', faculty: 'Dr. Smith' },
              { time: '11:00 AM', course: 'Data Structures', room: 'Room 204', faculty: 'Prof. Johnson' },
              { time: '02:00 PM', course: 'Software Engineering', room: 'Room 105', faculty: 'Dr. Lee' },
            ].map((cls, idx) => (
              <div key={idx} className="p-6 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded font-medium text-sm w-24 text-center">
                    {cls.time}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{cls.course}</h3>
                    <p className="text-sm text-gray-500">{cls.faculty}</p>
                  </div>
                </div>
                <div className="flex items-center text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                  {cls.room}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <Sparkles className="w-5 h-5 text-secondary-500 mr-2" /> 
            Recommended for You
          </h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-gray-100 hover:border-secondary-200 hover:shadow-md transition-all cursor-pointer group">
              <h3 className="font-semibold text-gray-900 group-hover:text-secondary-600 transition-colors">Google AI Workshop</h3>
              <p className="text-sm text-gray-500 mt-1">Based on your interest in Machine Learning. Happening this Friday.</p>
            </div>
            <div className="p-4 rounded-xl border border-gray-100 hover:border-secondary-200 hover:shadow-md transition-all cursor-pointer group">
              <h3 className="font-semibold text-gray-900 group-hover:text-secondary-600 transition-colors">Python Crash Course</h3>
              <p className="text-sm text-gray-500 mt-1">Library book recommendation to complement your current semester.</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default StudentDashboard;
