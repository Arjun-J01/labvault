import React, { useState } from 'react';
import { Search, Download, FileText, Calendar, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { getReportByCode } from '../utils/storage';
import { downloadFile, getFileType } from '../utils/fileUtils';
import { Report } from '../types';

const Access: React.FC = () => {
  const [accessCode, setAccessCode] = useState('');
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessCode.trim()) {
      setError('Please enter an access code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const foundReport = getReportByCode(accessCode.toUpperCase());
      
      if (foundReport) {
        setReport(foundReport);
      } else {
        setError('Invalid access code or report has expired');
        setReport(null);
      }
    } catch (err) {
      setError('An error occurred while accessing the report');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (report) {
      downloadFile(report.fileData, report.fileName);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderFilePreview = () => {
    if (!report || !showPreview) return null;

    const fileType = getFileType(report.fileName);
    
    if (fileType === 'pdf') {
      return (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <iframe
            src={report.fileData}
            className="w-full h-96"
            title="PDF Preview"
          />
        </div>
      );
    } else if (['jpg', 'jpeg', 'png'].includes(fileType)) {
      return (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <img
            src={report.fileData}
            alt="Report Preview"
            className="w-full h-auto max-h-96 object-contain"
          />
        </div>
      );
    } else {
      return (
        <div className="border border-gray-300 rounded-lg p-8 text-center bg-gray-50">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Preview not available for this file type</p>
          <p className="text-sm text-gray-500 mt-2">Click download to view the file</p>
        </div>
      );
    }
  };

  const resetSearch = () => {
    setAccessCode('');
    setReport(null);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {!report ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Lab Report</h1>
              <p className="text-gray-600">Enter the 6-digit access code to view the report</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Access Code
                </label>
                <input
                  type="text"
                  id="accessCode"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-center text-2xl font-mono tracking-wider"
                  placeholder="XXXXXX"
                  maxLength={6}
                  required
                />
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Enter the 6-character code provided with the report
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || accessCode.length !== 6}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Searching...</span>
                  </span>
                ) : (
                  'Access Report'
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Report Header */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Lab Report</h1>
                <p className="text-gray-600">Access Code: {report.accessCode}</p>
              </div>
              <button
                onClick={resetSearch}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Search Another
              </button>
            </div>

            {/* Report Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Patient Name</p>
                  <p className="font-semibold text-gray-900">{report.patientName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Report Type</p>
                  <p className="font-semibold text-gray-900">{report.reportType}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Report Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(report.reportDate)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Upload Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(report.uploadDate)}</p>
                </div>
              </div>
            </div>

            {report.remarks && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-500 mb-1">Remarks</p>
                <p className="text-gray-900">{report.remarks}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span>Print</span>
              </button>

              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
              </button>
            </div>
          </div>

          {/* File Preview */}
          {showPreview && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Report Preview</h2>
              {renderFilePreview()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Access;