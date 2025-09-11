import React from 'react';
import { FacebookIcon, InstagramIcon, TwitterIcon } from '../constants/icons';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black/20 border-t border-white/10 text-gray-400">
      <div className="container mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-white text-black font-bold text-xl flex items-center justify-center rounded-full mr-2">N</div>
              <span className="font-poppins font-bold text-2xl tracking-wider text-white">ZARIK</span>
            </div>
            <p className="text-sm">Your personal AI fashion stylist.</p>
          </div>
          <div>
            <h4 className="font-poppins font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Press</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-poppins font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">FAQ</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-poppins font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex space-x-4">
                <a href="#" aria-label="Facebook"><FacebookIcon className="w-6 h-6 hover:text-white" /></a>
                <a href="#" aria-label="Instagram"><InstagramIcon className="w-6 h-6 hover:text-white" /></a>
                <a href="#" aria-label="Twitter"><TwitterIcon className="w-6 h-6 hover:text-white" /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} ZARIK AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
