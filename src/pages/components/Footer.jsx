import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-600 to-green-900 text-md shadow-md p-10 text-white">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center space-y-2 md:space-y-0">
        <div>
          <h2 className="text-lg font-semibold">Annamalai University</h2>
          <p className="text-sm">
            Annamalai Nagar, Chidambaram, Tamil Nadu 608002, India
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">&copy; {new Date().getFullYear()} Digital Owner - Team 14</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
