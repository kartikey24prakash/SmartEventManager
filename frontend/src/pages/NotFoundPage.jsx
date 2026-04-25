import React from 'react';
import { useNavigate } from 'react-router';
import { HiExclamationTriangle, HiArrowLeft, HiHome, HiShieldCheck } from 'react-icons/hi2';

const NotFoundPage = () => {
  const navigate = useNavigate();

  // ERP Logic: Retrieve role directly from storage if Context is unavailable
  const getSessionDashboard = () => {
    const userString = localStorage.getItem('user'); // Assuming user object is stored on login
    if (!userString) return "/login";

    try {
      const user = JSON.parse(userString);
      // Logic mapped to System Architecture: Three-tier RBAC
      switch (user.role) {
        case 'admin': return "/admin";
        case 'coordinator': return "/coordinator";
        case 'participant': return "/participant";
        default: return "/";
      }
    } catch {
      return "/login";
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] flex items-center justify-center p-4 font-sans text-[#334155]">
      <div className="max-w-2xl w-full bg-white shadow-2xl rounded-xl overflow-hidden border border-slate-200">
        
        <div className="flex flex-col md:flex-row">
          {/* Left Sidebar - Visual Warning */}
          <div className="bg-slate-900 md:w-1/3 p-8 flex flex-col items-center justify-center text-white">
            <HiExclamationTriangle className="text-6xl text-yellow-500 mb-4" />
            <div className="text-center">
              <span className="block text-5xl font-black tracking-tighter">404</span>
              <span className="text-xs uppercase tracking-widest text-slate-400">Entry Denied</span>
            </div>
          </div>

          {/* Right Content - Functional Area */}
          <div className="md:w-2/3 p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-800">Resource Path Error</h1>
              <p className="text-slate-500 text-sm mt-2">
                The SMART Event Manager system could not resolve the current request. The endpoint may be restricted or decommissioned.
              </p>
            </div>

            {/* Diagnostic Table */}
            <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-100">
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-400">System ID:</span>
                <span className="text-slate-700 font-bold uppercase">SMS-VARANASI-SEM</span>
              </div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-400">Event Context:</span>
                <span className="text-slate-700 font-bold">Tech Marathon 12</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Trace:</span>
                <span className="text-red-500 uppercase">Route_Not_Found</span>
              </div>
            </div>

            {/* Action Group */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => navigate(-1)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all active:scale-95"
              >
                <HiArrowLeft className="text-lg" /> Return Back
              </button>
              <button 
                onClick={() => navigate(getSessionDashboard())}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
              >
                <HiHome className="text-lg" /> Dashboard
              </button>
            </div>

            {/* Verification Tag */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-1">
                <HiShieldCheck className="text-green-500 text-sm" />
                <span>SECURED BY JWT AUTH</span>
              </div>
              <span>v1.0-STABLE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
