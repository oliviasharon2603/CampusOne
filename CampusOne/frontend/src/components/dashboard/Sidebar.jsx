import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Library, 
  Building2, 
  CalendarDays, 
  Users, 
  BusFront, 
  Search, 
  FileText, 
  GraduationCap, 
  AlertCircle, 
  LogOut,
  Sparkles,
  Coffee
} from 'lucide-react';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Library', icon: Library, path: '/library' },
    { name: 'Departments', icon: Building2, path: '/departments' },
    { name: 'Events', icon: CalendarDays, path: '/events' },
    { name: 'Clubs', icon: Users, path: '/clubs' },
    { name: 'Transport', icon: BusFront, path: '/transport' },
    { name: 'Canteen', icon: Coffee, path: '/canteen' },
    { name: 'Lost & Found', icon: Search, path: '/lost-found' },
    { name: 'Documents', icon: FileText, path: '/documents' },
    { name: 'Career Roadmap', icon: GraduationCap, path: '/roadmap' },
    { name: 'Complaints', icon: AlertCircle, path: '/complaints' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-800  border-r border-gray-200 dark:border-slate-700  h-screen hidden md:flex flex-col sticky top-0 z-40 transition-colors duration-300">
      <div className="p-6 border-b border-gray-100 dark:border-slate-700/50  flex items-center space-x-2">
        <div className="bg-primary-600  p-1.5 rounded-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white ">CampusOne</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group
              ${isActive 
                ? 'bg-primary-50 dark:bg-primary-900/30  text-primary-700 dark:text-primary-300 ' 
                : 'text-gray-600 dark:text-slate-300  hover:bg-gray-50 dark:bg-slate-900  hover:text-gray-900 dark:text-white '}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-slate-300 group-hover:text-gray-500 dark:text-slate-300'}`} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-slate-700/50  space-y-2">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-danger-600 dark:text-danger-400  rounded-lg hover:bg-danger-50 dark:bg-danger-900/30  transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
