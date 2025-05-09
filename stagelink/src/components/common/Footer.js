// src/components/common/Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 text-sm py-6 mt-10 border-t">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-2 md:mb-0">
          © 2025 STAGELINK. All rights reserved.
        </div>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-purple-600">회사 소개</a>
          <a href="#" className="hover:text-purple-600">이용약관</a>
          <a href="#" className="hover:text-purple-600">개인정보처리방침</a>
          <a href="#" className="hover:text-purple-600">SNS</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
