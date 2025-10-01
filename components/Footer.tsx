import React from 'react';
import FacebookIcon from './icons/FacebookIcon';
import InstagramIcon from './icons/InstagramIcon';
import TwitterIcon from './icons/TwitterIcon';

interface FooterProps {
  onLinkClick: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onLinkClick }) => {
  const handleSocialLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    alert('Navigating to social media is not implemented in this demo.');
  };

  return (
    <footer className="bg-black py-8 px-4 md:px-12 mt-12 border-t border-gray-800">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-gray-400">
          <div>
            <h4 className="font-bold text-white mb-3">Company</h4>
            <ul>
              <li className="mb-2"><a href="#" onClick={(e) => { e.preventDefault(); onLinkClick('About Us'); }} className="hover:text-white">About Us</a></li>
              <li className="mb-2"><a href="#" onClick={(e) => { e.preventDefault(); onLinkClick('Careers'); }} className="hover:text-white">Careers</a></li>
              <li className="mb-2"><a href="#" onClick={(e) => { e.preventDefault(); onLinkClick('Press'); }} className="hover:text-white">Press</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Support</h4>
            <ul>
              <li className="mb-2"><a href="#" onClick={(e) => { e.preventDefault(); onLinkClick('Contact Us'); }} className="hover:text-white">Contact Us</a></li>
              <li className="mb-2"><a href="#" onClick={(e) => { e.preventDefault(); onLinkClick('Help Center'); }} className="hover:text-white">Help Center</a></li>
              <li className="mb-2"><a href="#" onClick={(e) => { e.preventDefault(); onLinkClick('FAQ'); }} className="hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Legal</h4>
            <ul>
              <li className="mb-2"><a href="#" onClick={(e) => { e.preventDefault(); onLinkClick('Terms of Use'); }} className="hover:text-white">Terms of Use</a></li>
              <li className="mb-2"><a href="#" onClick={(e) => { e.preventDefault(); onLinkClick('Privacy Policy'); }} className="hover:text-white">Privacy Policy</a></li>
              <li className="mb-2"><a href="#" onClick={(e) => { e.preventDefault(); onLinkClick('Cookie Policy'); }} className="hover:text-white">Cookie Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" onClick={handleSocialLinkClick} className="hover:text-white" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="#" onClick={handleSocialLinkClick} className="hover:text-white" aria-label="Twitter">
                <TwitterIcon />
              </a>
              <a href="#" onClick={handleSocialLinkClick} className="hover:text-white" aria-label="Instagram">
                <InstagramIcon />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Streamflix. All Rights Reserved. This is a clone project for educational purposes.
        </div>
      </div>
    </footer>
  );
};

export default Footer;