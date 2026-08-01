import { useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import Seo from '@/components/Seo';


export default function PageNotFound({}) {
    const location = useLocation();
    const pageName = location.pathname.substring(1);
    const { user, isAuthenticated } = useAuth();

    return (
        <main id="main" className="min-h-screen flex items-center justify-center p-6 bg-[#F9F9F7] font-body">
            <Seo noindex title="Page Not Found — DDouble" canonicalPath={null} />
            <div className="max-w-md w-full">
                <div className="text-center space-y-6">
                    {/* 404 Error Code */}
                    <div className="space-y-2">
                        <h1 className="text-7xl font-light text-[#E5E5E1]">404</h1>
                        <div className="h-0.5 w-16 bg-[#E5E5E1] mx-auto"></div>
                    </div>
                    
                    {/* Main Message */}
                    <div className="space-y-3">
                        <h2 className="text-2xl font-medium text-[#1A1A1A]">
                            Page Not Found
                        </h2>
                        <p className="text-[#6B6B67] leading-relaxed">
                            The page <span className="font-medium text-[#1A1A1A]">"{pageName}"</span> could not be found in this application.
                        </p>
                    </div>
                    
                    {/* Admin Note */}
                    {isAuthenticated && user?.role === 'admin' && (
                        <div className="mt-8 p-4 bg-[#F1F0EC] rounded-none border border-[#E5E5E1]">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                                </div>
                                <div className="text-left space-y-1">
                                    <p className="text-sm font-medium text-[#1A1A1A]">Admin Note</p>
                                    <p className="text-sm text-[#5A5A56] leading-relaxed">
                                        This could mean that the AI hasn't implemented this page yet. Ask it to implement it in the chat.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Action Button */}
                    <div className="pt-6">
                        <button 
                            onClick={() => window.location.href = '/'} 
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#1A1A1A] rounded-none hover:bg-[#2A2A2A] transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}
