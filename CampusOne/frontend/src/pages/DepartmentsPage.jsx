import { useState } from 'react';
import { Building2, Bell, Users, BookOpen, Microscope, Download, ExternalLink, Mail, Phone, ChevronRight, FileText } from 'lucide-react';
import Button from '../components/ui/Button';

// Mock Data
const DEPARTMENT = {
  name: "Artificial Intelligence & Data Science",
  code: "AI&DS",
  description: "Pioneering the future through intelligent systems and data-driven insights.",
  stats: [
    { label: "Students", value: "240" },
    { label: "Faculty", value: "18" },
    { label: "Labs", value: "4" }
  ]
};

const NOTICES = [
  { id: 1, title: 'Revised Schedule for Mid-Term Lab Exams', date: 'Aug 18, 2026', type: 'important' },
  { id: 2, title: 'Call for Papers: AI Student Symposium', date: 'Aug 15, 2026', type: 'general' },
  { id: 3, title: 'Guest Lecture by Google Brain Scientist', date: 'Aug 12, 2026', type: 'event' }
];

const FACULTY = [
  { id: 1, name: 'Dr. Sarah Chen', role: 'Head of Department', specialization: 'Machine Learning', email: 'hod.aids@campusone.edu', phone: 'Ext: 401', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200' },
  { id: 2, name: 'Prof. James Wilson', role: 'Associate Professor', specialization: 'Data Mining', email: 'j.wilson@campusone.edu', phone: 'Ext: 405', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200' },
  { id: 3, name: 'Dr. Emily Patel', role: 'Assistant Professor', specialization: 'Computer Vision', email: 'e.patel@campusone.edu', phone: 'Ext: 412', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200' }
];

const RESOURCES = [
  { id: 1, title: 'B.Tech AI&DS Syllabus (2024-28)', type: 'PDF', size: '2.4 MB' },
  { id: 2, title: 'Third Year Time Table - Even Semester', type: 'PDF', size: '1.1 MB' },
  { id: 3, title: 'Previous Year Question Papers (2025)', type: 'ZIP', size: '15.6 MB' }
];

const DepartmentsPage = () => {
  const [activeTab, setActiveTab] = useState('notices');

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-10">
      
      {/* Department Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-700 to-secondary-700"></div>
        <div className="px-6 sm:px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 bg-white rounded-xl shadow-md border border-gray-100 flex items-center justify-center text-primary-600">
              <Building2 className="w-12 h-12" />
            </div>
            <div className="flex gap-4">
              {DEPARTMENT.stats.map((stat, idx) => (
                <div key={idx} className="text-center px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 hidden sm:block">
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{DEPARTMENT.name}</h1>
              <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-bold border border-primary-100">{DEPARTMENT.code}</span>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl">{DEPARTMENT.description}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-hide">
          {[
            { id: 'notices', label: 'Notice Board', icon: Bell },
            { id: 'faculty', label: 'Faculty Directory', icon: Users },
            { id: 'resources', label: 'Academic Resources', icon: BookOpen },
            { id: 'labs', label: 'Labs & Infrastructure', icon: Microscope },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${isActive 
                    ? 'border-primary-500 text-primary-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className={`w-5 h-5 mr-2 ${isActive ? 'text-primary-500' : 'text-gray-400'}`} />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        
        {/* Notice Board Tab */}
        {activeTab === 'notices' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-2 sm:p-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
            <div className="space-y-4">
              {NOTICES.map(notice => (
                <div key={notice.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg mt-1 ${
                      notice.type === 'important' ? 'bg-danger-50 text-danger-600' :
                      notice.type === 'event' ? 'bg-secondary-50 text-secondary-600' : 'bg-primary-50 text-primary-600'
                    }`}>
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-semibold group-hover:text-primary-600 transition-colors">{notice.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">Posted on {notice.date}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors hidden sm:block" />
                </div>
              ))}
            </div>
            <div className="mt-6 text-center border-t border-gray-100 pt-6">
              <Button variant="outline">View All Archives</Button>
            </div>
          </div>
        )}

        {/* Faculty Directory Tab */}
        {activeTab === 'faculty' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
            {FACULTY.map(faculty => (
              <div key={faculty.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-24 bg-gray-50"></div>
                <div className="px-6 pb-6 text-center -mt-12">
                  <img src={faculty.image} alt={faculty.name} className="w-24 h-24 rounded-full border-4 border-white shadow-sm mx-auto object-cover" />
                  <h3 className="text-lg font-bold text-gray-900 mt-3">{faculty.name}</h3>
                  <p className="text-primary-600 font-medium text-sm">{faculty.role}</p>
                  <p className="text-gray-500 text-sm mt-1">{faculty.specialization}</p>
                  
                  <div className="mt-6 flex flex-col gap-2">
                    <a href={`mailto:${faculty.email}`} className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors bg-gray-50 py-2 rounded-lg">
                      <Mail className="w-4 h-4" /> {faculty.email}
                    </a>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-gray-50 py-2 rounded-lg">
                      <Phone className="w-4 h-4" /> {faculty.phone}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Academic Resources Tab */}
        {activeTab === 'resources' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Downloads & Documents</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {RESOURCES.map(resource => (
                <div key={resource.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 font-mono">{resource.type} • {resource.size}</p>
                    </div>
                  </div>
                  <Button variant="outline" icon={Download} className="flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Labs & Infrastructure Tab */}
        {activeTab === 'labs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-48 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">Advanced AI Lab</h3>
                <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                  Equipped with 60 high-performance workstations featuring NVIDIA RTX 4090 GPUs for deep learning and parallel computing research.
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-primary-600 cursor-pointer hover:text-primary-700">
                  View Schedule <ExternalLink className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-48 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">Data Analytics Center</h3>
                <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                  A specialized facility for big data processing, featuring local Hadoop clusters and enterprise data visualization software suites.
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-primary-600 cursor-pointer hover:text-primary-700">
                  View Schedule <ExternalLink className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DepartmentsPage;
