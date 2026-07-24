import { Link } from 'react-router-dom';
import { Building2, ArrowRight } from 'lucide-react';
import { DEPARTMENTS_DATA } from '../data/departmentsData';

const DepartmentsIndex = () => {
  const departments = Object.values(DEPARTMENTS_DATA);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Building2 className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
          Academic Departments
        </h1>
        <p className="text-gray-500 dark:text-slate-300 mt-1">Explore faculty, notices, and resources across all 9 branches.</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <Link 
            key={dept.id} 
            to={`/departments/${dept.id}`}
            className="group block bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm hover:shadow-lg transition-all overflow-hidden"
          >
            {/* Header Image */}
            <div 
              className="h-32 relative overflow-hidden"
              style={{ 
                backgroundImage: `url(${dept.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-gray-900/40 group-hover:bg-gray-900/20 transition-colors"></div>
              <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur shadow-sm px-3 py-1 rounded-lg text-xs font-bold text-primary-700 dark:text-primary-300">
                {dept.code}
              </div>
            </div>
            
            {/* Content */}
            <div className="p-5">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-1 group-hover:text-primary-600 dark:text-primary-400 transition-colors mb-2">
                {dept.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-slate-300 line-clamp-2 mb-4">
                {dept.description}
              </p>
              
              <div className="grid grid-cols-3 gap-2 border-t border-gray-100 dark:border-slate-700/50 pt-4 mb-4">
                {dept.stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="font-bold text-gray-900 dark:text-white text-sm">{stat.value}</div>
                    <div className="text-[10px] text-gray-500 dark:text-slate-300 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400">
                Enter Hub <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DepartmentsIndex;
