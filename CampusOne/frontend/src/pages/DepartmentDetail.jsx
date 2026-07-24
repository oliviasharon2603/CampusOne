import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, Bell, Users, BookOpen, Microscope, Download, ExternalLink, Mail, Phone, ChevronRight, ArrowLeft, X, FileText } from 'lucide-react';
import Button from '../components/ui/Button';
import { DEPARTMENTS_DATA } from '../data/departmentsData';

const DepartmentDetail = () => {
  const { deptId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notices');
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [selectedLab, setSelectedLab] = useState(null);

  // Local fallback data for images, notices, stats, resources
  const localData = DEPARTMENTS_DATA[deptId];

  const [deptData, setDeptData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!localData) {
      navigate('/departments');
      return;
    }
    const fetchData = async () => {
      try {
        const deptCode = deptId.toUpperCase();
        // 1. Fetch departments to find the ID
        const deptRes = await fetch('http://localhost:5000/api/v1/departments');
        const deptJson = await deptRes.json();
        const dbDept = deptJson.data.find(d => d.code === deptCode);
        
        if (!dbDept) throw new Error('Department not found in DB');

        // 2. Fetch faculty and labs
        const facRes = await fetch(`http://localhost:5000/api/v1/departments/${dbDept.id}/faculty`);
        const facJson = await facRes.json();
        
        const labRes = await fetch(`http://localhost:5000/api/v1/departments/${dbDept.id}/labs`);
        const labJson = await labRes.json();

        // Map faculty fields
        const mappedFaculty = facJson.data.map(f => ({
          id: f.id,
          name: f.name,
          role: f.designation || 'Professor',
          specialization: f.subject || f.designation || 'General',
          email: `${f.name.toLowerCase().replace(/[^a-z]/g, '')}@campusone.edu`,
          phone: '+91 98765 43210',
          image: f.photo_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200'
        }));

        // Map labs fields
        const mappedLabs = labJson.data.map(l => ({
          id: l.id,
          name: l.name,
          description: l.description,
          image: l.image_url,
          schedule: l.schedule || "Mon-Fri: 9:00 AM - 4:00 PM"
        }));

        setDeptData({
          ...localData,
          name: dbDept.name,
          code: dbDept.code,
          description: dbDept.description,
          faculty: mappedFaculty,
          labs: mappedLabs
        });
      } catch (err) {
        console.error('Error fetching department data:', err);
        // Fallback to local data completely if DB fails
        setDeptData(localData);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [deptId, localData, navigate]);

  if (isLoading || !deptData) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  );

  const handleDownload = (resource) => {
    // Generate text content on the fly
    const fileContent = `CampusOne Official Document\n\nTitle: ${resource.title}\nDepartment: ${deptData.name}\nSize: ${resource.size}\n\nDetails:\n${resource.content || 'Confidential academic material.'}\n\n---\nDownloaded securely via CampusOne Platform.`;
    
    // Create Blob
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create invisible link and trigger native download
    const link = document.createElement('a');
    link.href = url;
    
    // Ensure filename is safe and has a .txt extension
    const safeTitle = resource.title.replace(/[^a-zA-Z0-9_-]/g, '_');
    link.download = `${safeTitle}.txt`;
    
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-10">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/departments')}
        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Departments
      </button>

      {/* Department Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
        <div 
          className="h-48 bg-gray-200 relative"
          style={{ 
            backgroundImage: `url(${deptData.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-gray-900/10"></div>
        </div>
        
        <div className="px-6 sm:px-8 pb-8 relative z-10">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 bg-white rounded-xl shadow-md border-4 border-white flex items-center justify-center text-primary-600">
              <Building2 className="w-10 h-10" />
            </div>
            <div className="flex gap-4">
              {deptData.stats.map((stat, idx) => (
                <div key={idx} className="text-center px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100 hidden sm:block">
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{deptData.name}</h1>
              <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-bold border border-primary-100">{deptData.code}</span>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl">{deptData.description}</p>
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
            {deptData.notices.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No notices posted yet.</div>
            ) : (
              <div className="space-y-4">
                {deptData.notices.map(notice => (
                  <div 
                    key={notice.id} 
                    onClick={() => setSelectedNotice(notice)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors group cursor-pointer"
                  >
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
            )}
            <div className="mt-6 text-center border-t border-gray-100 pt-6">
              <Button variant="outline" onClick={() => alert("Archive history loaded.")}>View All Archives</Button>
            </div>
          </div>
        )}

        {/* Faculty Directory Tab */}
        {activeTab === 'faculty' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
            {deptData.faculty.map(faculty => (
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
              {deptData.resources.map(resource => (
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
                  <Button variant="outline" icon={Download} className="flex-shrink-0" onClick={() => handleDownload(resource)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Labs & Infrastructure Tab */}
        {activeTab === 'labs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
            {deptData.labs.map(lab => (
              <div key={lab.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div 
                  className="h-48 relative"
                  style={{ 
                    backgroundImage: `url(${lab.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                ></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{lab.name}</h3>
                  <p className="text-gray-600 mt-2 text-sm leading-relaxed">{lab.description}</p>
                  <div 
                    onClick={() => setSelectedLab(lab)}
                    className="mt-4 flex items-center text-sm font-medium text-primary-600 cursor-pointer hover:text-primary-700"
                  >
                    View Schedule <ExternalLink className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary-900/10 backdrop-blur-[2px] transition-opacity" onClick={() => setSelectedNotice(null)}></div>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full relative z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                selectedNotice.type === 'important' ? 'bg-danger-100 text-danger-700' :
                selectedNotice.type === 'event' ? 'bg-secondary-100 text-secondary-700' : 'bg-primary-100 text-primary-700'
              }`}>
                {selectedNotice.type} Notice
              </span>
              <button onClick={() => setSelectedNotice(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedNotice.title}</h3>
              <p className="text-xs text-gray-500 mb-6 font-medium">Published on {selectedNotice.date}</p>
              
              <div className="prose prose-sm text-gray-600 leading-relaxed">
                <p>{selectedNotice.content}</p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
              <Button variant="outline" onClick={() => setSelectedNotice(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Lab Schedule Modal */}
      {selectedLab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setSelectedLab(null)}></div>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full relative z-10 animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
              <h2 className="text-lg font-bold text-gray-900">{selectedLab.name} - Weekly Schedule</h2>
              <button onClick={() => setSelectedLab(null)} className="p-2 hover:bg-gray-200 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6">
              <div className="bg-primary-50 text-primary-700 p-6 rounded-xl border border-primary-100 flex items-center justify-center text-center">
                <div>
                  <h3 className="font-bold text-lg mb-2">Active Schedule</h3>
                  <p className="text-gray-700">{selectedLab.schedule}</p>
                </div>
              </div>
              <div className="mt-6 text-sm text-gray-500 text-center">
                * Note: Schedule is subject to change during exam periods and maintenance days.
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DepartmentDetail;
