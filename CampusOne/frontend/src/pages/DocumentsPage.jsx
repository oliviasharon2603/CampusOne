import { useState } from 'react';
import { FileText, Printer, Download, ChevronLeft, Calendar as CalendarIcon, Briefcase, GraduationCap, Award } from 'lucide-react';
import Button from '../components/ui/Button';
import { auth } from '../firebase';
import { useUserActivity } from '../context/UserActivityContext';

const DOC_TEMPLATES = [
  {
    id: 'leave',
    title: 'Leave of Absence Application',
    description: 'Request formal leave for medical, personal, or academic reasons.',
    icon: CalendarIcon,
    theme: 'bg-primary-50 text-primary-600',
    fields: [
      { id: 'startDate', label: 'Start Date', type: 'date' },
      { id: 'endDate', label: 'End Date', type: 'date' },
      { id: 'reason', label: 'Reason for Leave', type: 'textarea' }
    ]
  },
  {
    id: 'bonafide',
    title: 'Bonafide Certificate',
    description: 'Official proof of enrollment for scholarships, loans, or bus passes.',
    icon: GraduationCap,
    theme: 'bg-secondary-50 text-secondary-600',
    fields: [
      { id: 'purpose', label: 'Purpose of Certificate', type: 'text', placeholder: 'e.g., Bank Loan Application' }
    ]
  },
  {
    id: 'noc',
    title: 'No Objection Certificate (NOC)',
    description: 'Permission to attend external internships, workshops, or events.',
    icon: Briefcase,
    theme: 'bg-warning-50 text-warning-600',
    fields: [
      { id: 'companyName', label: 'Company / Organization Name', type: 'text' },
      { id: 'duration', label: 'Duration (in weeks)', type: 'number' }
    ]
  },
  {
    id: 'character',
    title: 'Character Certificate Request',
    description: 'Request conduct verification for higher education or jobs.',
    icon: Award,
    theme: 'bg-success-50 text-success-600',
    fields: [
      { id: 'programApplied', label: 'Program/Job Applied For', type: 'text' }
    ]
  }
];
const DocumentsPage = () => {
  const [activeDoc, setActiveDoc] = useState(null);
  const [formData, setFormData] = useState({});
  const [previewMode, setPreviewMode] = useState(false);
  const [toast, setToast] = useState(null);
  const { dbUserId } = useUserActivity();

  const userName = auth.currentUser?.displayName || 'Student Name';
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleOpenForm = (doc) => {
    setActiveDoc(doc);
    setFormData({});
    setPreviewMode(false);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setPreviewMode(true);
    if (dbUserId) {
      try {
        await fetch('http://localhost:5000/api/v1/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: dbUserId, title: activeDoc.title, type: activeDoc.id })
        });
      } catch (err) {
        console.error('Error saving document:', err);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = document.getElementById('printable-document').innerText;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CampusOne_${activeDoc.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setToast('Document downloaded successfully!');
    setTimeout(() => setToast(null), 3000);
  };

  // Generate Letter Content dynamically based on the selected document
  const getLetterContent = () => {
    switch (activeDoc.id) {
      case 'leave':
        return (
          <>
            <p><strong>Subject:</strong> Application for Leave of Absence</p>
            <p className="mt-4">Respected Sir/Madam,</p>
            <p className="mt-2 text-justify">
              I am {userName}, a bonafide student of this institution. I am writing to formally request a leave of absence from classes starting from <strong>{formData.startDate}</strong> to <strong>{formData.endDate}</strong>. 
            </p>
            <p className="mt-2 text-justify">
              The reason for my absence is: <strong>{formData.reason}</strong>.
            </p>
            <p className="mt-2 text-justify">
              I assure you that I will cover up for the missed classes and assignments promptly upon my return. I kindly request you to grant me permission for the aforementioned dates.
            </p>
            <p className="mt-6">Thanking you.</p>
          </>
        );
      case 'bonafide':
        return (
          <>
            <p className="text-center font-bold text-lg underline mb-6 uppercase">Bonafide Certificate</p>
            <p className="mt-4 text-justify leading-loose">
              This is to certify that Mr./Ms. <strong>{userName}</strong> is a bonafide student of CampusOne University, currently pursuing their undergraduate degree for the academic year 2026-2027.
            </p>
            <p className="mt-4 text-justify leading-loose">
              During their tenure at the institution, they have maintained a good academic and disciplinary record.
            </p>
            <p className="mt-4 text-justify leading-loose">
              This certificate is being issued upon the student's request for the purpose of: <strong>{formData.purpose}</strong>.
            </p>
          </>
        );
      case 'noc':
        return (
          <>
            <p className="text-center font-bold text-lg underline mb-6 uppercase">No Objection Certificate</p>
            <p className="mt-4 text-justify leading-loose">
              To Whom It May Concern,
            </p>
            <p className="mt-4 text-justify leading-loose">
              This is to certify that <strong>{userName}</strong> is a full-time student at CampusOne University. The institution has <strong>No Objection</strong> to the student undertaking an internship/training program at <strong>{formData.companyName}</strong>.
            </p>
            <p className="mt-4 text-justify leading-loose">
              The student is permitted to participate in this external program for a duration of <strong>{formData.duration} weeks</strong>, provided it does not interfere with mandatory academic assessments.
            </p>
            <p className="mt-4 text-justify leading-loose">
              We wish them the best in their professional endeavors.
            </p>
          </>
        );
      case 'character':
        return (
          <>
            <p className="text-center font-bold text-lg underline mb-6 uppercase">Character and Conduct Certificate</p>
            <p className="mt-4 text-justify leading-loose">
              This is to certify that <strong>{userName}</strong> has been a student of this institution. 
            </p>
            <p className="mt-4 text-justify leading-loose">
              To the best of our knowledge and records, the student bears a <strong>good moral character</strong> and conduct. They have not been involved in any disciplinary actions or unlawful activities during their period of study at CampusOne University.
            </p>
            <p className="mt-4 text-justify leading-loose">
              This certificate is issued for the purpose of their application to: <strong>{formData.programApplied}</strong>.
            </p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300 pb-10">
      
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-8 z-50 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg">
          {toast}
        </div>
      )}

      {/* Header Section (Hidden during print) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 relative print:hidden">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center">
          <div className="bg-primary-50 text-primary-600 p-2.5 rounded-xl mr-3 shadow-sm border border-primary-100">
            <FileText className="w-7 h-7" />
          </div>
          Official Documents
        </h1>
        <p className="text-gray-600 mt-3 text-lg font-medium">Instantly generate, print, and download formally formatted college letters and certificates.</p>
      </div>

      {!activeDoc ? (
        /* Document Catalog Grid (Hidden during print) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
          {DOC_TEMPLATES.map(doc => {
            const Icon = doc.icon;
            return (
              <div key={doc.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
                <div className="flex items-start mb-4">
                  <div className={`p-3 rounded-xl mr-4 ${doc.theme}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{doc.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{doc.description}</p>
                  </div>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-50">
                  <Button variant="outline" className="w-full justify-center" onClick={() => handleOpenForm(doc)}>
                    Fill & Generate
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      ) : !previewMode ? (
        /* Form View (Hidden during print) */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-2xl mx-auto print:hidden">
          <button onClick={() => setActiveDoc(null)} className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Catalog
          </button>
          
          <div className="flex items-center mb-6 pb-6 border-b border-gray-100">
            <div className={`p-2 rounded-lg mr-3 ${activeDoc.theme}`}>
              <activeDoc.icon className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{activeDoc.title}</h2>
          </div>
          
          <form onSubmit={handleGenerate} className="space-y-5">
            {activeDoc.fields.map(field => (
              <div key={field.id}>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea 
                    required
                    rows="4"
                    placeholder={field.placeholder}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow"
                    value={formData[field.id] || ''}
                    onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                  ></textarea>
                ) : (
                  <input 
                    type={field.type}
                    required
                    placeholder={field.placeholder}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow"
                    value={formData[field.id] || ''}
                    onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                  />
                )}
              </div>
            ))}
            
            <div className="pt-4">
              <Button type="submit" variant="primary" className="w-full justify-center py-3 text-lg">Generate Document</Button>
            </div>
          </form>
        </div>
      ) : (
        /* Document Preview & Print View */
        <div className="max-w-3xl mx-auto">
          
          {/* Action Bar (Hidden during print) */}
          <div className="flex justify-between items-center mb-6 print:hidden">
            <button onClick={() => setPreviewMode(false)} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              <ChevronLeft className="w-4 h-4 mr-1" /> Edit Details
            </button>
            <div className="flex gap-3">
              <Button variant="outline" icon={Download} onClick={handleDownload}>Download File</Button>
              <Button variant="primary" icon={Printer} onClick={handlePrint}>Print Document</Button>
            </div>
          </div>
          
          {/* The Printable Document */}
          <div 
            id="printable-document" 
            className="bg-white p-10 sm:p-16 shadow-xl border border-gray-200 text-gray-900 print:shadow-none print:border-none print:p-0 min-h-[800px] text-[15px]"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            {/* Letterhead */}
            <div className="border-b-2 border-gray-900 pb-6 mb-8 text-center">
              <h1 className="text-3xl font-bold uppercase tracking-widest text-primary-900">CampusOne University</h1>
              <p className="text-gray-600 mt-1">National Institute of Technology Campus, Tiruchirappalli, Tamil Nadu 620015</p>
              <p className="text-gray-500 text-sm mt-0.5">Contact: +91 431 2503000 | Email: administration@campusone.edu.in</p>
            </div>
            
            {/* Date */}
            <div className="text-right mb-8">
              <p><strong>Date:</strong> {currentDate}</p>
            </div>
            
            {/* To Address (For application letters) */}
            {(activeDoc.id === 'leave') && (
              <div className="mb-8">
                <p>To,</p>
                <p>The Head of Department,</p>
                <p>CampusOne University,</p>
                <p>Tiruchirappalli.</p>
              </div>
            )}
            
            {/* Dynamic Content */}
            <div className="mb-16">
              {getLetterContent()}
            </div>
            
            {/* Sign-off */}
            <div className="flex justify-between mt-20">
              {(activeDoc.id === 'leave') ? (
                <div className="text-left w-full">
                  <p>Yours faithfully,</p>
                  <p className="mt-8 font-bold">{userName}</p>
                  <p>Student, CampusOne University</p>
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <p className="mb-8">_____________________</p>
                    <p className="font-bold">Student Signature</p>
                  </div>
                  <div className="text-center">
                    <p className="mb-8">_____________________</p>
                    <p className="font-bold">Authorized Signatory</p>
                    <p>Office of the Registrar</p>
                  </div>
                </>
              )}
            </div>
            
          </div>
          
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
