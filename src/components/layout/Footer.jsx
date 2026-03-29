import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0F172A] border-t border-white/5 py-10 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-4">
          <Link to="/" className="text-xl font-bold tracking-tighter text-white">
            ARTIST<span className="text-violet-500">360</span>
          </Link>
        </div>

        <div className="flex justify-center gap-6 mb-6 text-sm text-slate-400">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/login" className="hover:text-white transition-colors">Login</Link>
          <Link to="/register" className="hover:text-white transition-colors">Join</Link>
        </div>
        <p className="text-slate-500 text-xs tracking-wide">
          &copy; 2026 Artist360Gallery. All Rights Reserved.
        </p>
        <p className="text-slate-600 text-[10px] mt-2 uppercase tracking-[0.2em]">
          Built with Spring Boot & React
        </p>
      </div>
    </footer>
  );
};

export default Footer;