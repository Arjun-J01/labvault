import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Search, Shield, Clock, FileText, Users } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
            Welcome to <span className="text-blue-600">LabVault</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Secure, smart, and simple lab report management for patients, doctors, and laboratories
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/upload"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold flex items-center space-x-3 hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <Upload className="h-5 w-5" />
            <span>Upload Report</span>
          </Link>
          
          <Link
            to="/access"
            className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg font-semibold flex items-center space-x-3 hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
          >
            <Search className="h-5 w-5" />
            <span>Access Report</span>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure Access</h3>
          <p className="text-gray-600">
            Every report is protected by a unique 6-digit access code, ensuring only authorized personnel can view sensitive medical data.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
            <Clock className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Upload</h3>
          <p className="text-gray-600">
            Upload lab reports in seconds with our streamlined interface. Supports PDF, JPG, and PNG formats for maximum compatibility.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
            <FileText className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy Management</h3>
          <p className="text-gray-600">
            Comprehensive dashboard for labs to track all uploaded reports, with filtering and analytics capabilities.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 lg:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600">Simple steps to secure lab report management</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              1
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Upload Report</h3>
            <p className="text-gray-600">
              Labs or patients upload medical reports with patient details and receive a unique access code
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              2
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Share Code</h3>
            <p className="text-gray-600">
              The 6-digit access code is shared securely with doctors or authorized medical personnel
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              3
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Access Report</h3>
            <p className="text-gray-600">
              Doctors enter the code to view, download, or print the lab report instantly and securely
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl text-white p-8 lg:p-12">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">99.9%</div>
            <div className="text-blue-100">Uptime Reliability</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">48hr</div>
            <div className="text-blue-100">Secure Access Window</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">256-bit</div>
            <div className="text-blue-100">Encryption Security</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;