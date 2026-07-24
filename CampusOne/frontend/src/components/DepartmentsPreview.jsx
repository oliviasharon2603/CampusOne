import React from 'react';
import { ArrowRight, Cpu, Code, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import campusLab from '../assets/campus_lab.png';

const departments = [
  {
    name: 'Computer Science',
    icon: <Code className="w-8 h-8 text-indigo-500" />,
    description: 'Master the art of software engineering and algorithms in our state-of-the-art programming hubs.',
    color: 'bg-indigo-50 dark:bg-indigo-900/30'
  },
  {
    name: 'Artificial Intelligence',
    icon: <Cpu className="w-8 h-8 text-purple-500" />,
    description: 'Dive deep into machine learning, neural networks, and the future of automated systems.',
    color: 'bg-purple-50'
  },
  {
    name: 'Data Science',
    icon: <Database className="w-8 h-8 text-emerald-500" />,
    description: 'Transform raw data into actionable intelligence with advanced analytics and big data tools.',
    color: 'bg-emerald-50'
  }
];

const DepartmentsPreview = () => {
  return (
    <section id="departments" className="py-24 bg-white dark:bg-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 tracking-widest uppercase mb-3">Academic Excellence</h2>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-5xl tracking-tight">
            Explore Top Departments
          </p>
          <p className="mt-6 text-xl text-gray-500 dark:text-slate-300 leading-relaxed">
            Discover our world-class facilities and specialized programs designed to launch your career.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Cards */}
          <div className="lg:w-1/2 space-y-6 w-full">
            {departments.map((dept, index) => (
              <div key={index} className="flex gap-6 p-6 rounded-3xl border border-gray-100 dark:border-slate-700/50 hover:border-indigo-100 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:bg-slate-900 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <div className={`${dept.color} p-4 rounded-2xl shrink-0 h-16 w-16 flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                  {dept.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:text-indigo-400 transition-colors">{dept.name}</h3>
                  <p className="text-gray-600 dark:text-slate-300 leading-relaxed">{dept.description}</p>
                </div>
              </div>
            ))}
            
            <div className="pt-4">
              <Link to="/login" className="inline-flex items-center text-lg font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:text-indigo-300">
                View all departments
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
          
          {/* Image */}
          <div className="lg:w-1/2 relative w-full mt-10 lg:mt-0">
            <div className="absolute inset-0 bg-indigo-600/10 rounded-[2rem] transform translate-x-4 translate-y-4"></div>
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
              <img 
                src={campusLab} 
                alt="Modern Computer Science Laboratory" 
                className="w-full h-[600px] object-cover transform hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-8">
                <h4 className="text-2xl font-bold text-white mb-2">Advanced Labs</h4>
                <p className="text-gray-300">Equipped with the latest technology for hands-on learning.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default DepartmentsPreview;
