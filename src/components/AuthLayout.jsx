import React from "react";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <main id="main" className="min-h-screen flex items-center justify-center bg-[#F9F9F7] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-none bg-[#1A1A1A] mb-4">
            <Icon className="w-7 h-7 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-2xl md:text-3xl font-light text-[#1A1A1A]">{title}</h1>
          {subtitle && <p className="text-sm text-[#6B6B67] mt-2">{subtitle}</p>}
        </div>
        <div className="bg-[#F9F9F7] rounded-none border border-[#E5E5E1] p-8">
          {children}
        </div>
        {footer && (
          <p className="text-center text-sm text-[#6B6B67] mt-6">{footer}</p>
        )}
      </div>
    </main>
  );
}
