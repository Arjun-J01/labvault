import React, { useState } from 'react';
import { Upload as UploadIcon, FileText, Copy, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { fileToBase64, isValidFileType } from '../utils/fileUtils';
import { saveReport, generateAccessCode } from '../utils/storage';
import { Report } from '../types';

const Upload: React.FC = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    reportType: '',
    reportDate: '',
    remarks: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');

  const reportTypes = [
    'Blood Test',
    'Urine Analysis',
    'X-Ray',
    'MRI Scan',
    'CT Scan',
    'Ultrasound',
    'ECG',
    'Biopsy',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (isValidFileType(selectedFile)) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please select a valid file type (PDF, JPG, PNG)');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    if (!formData.patientName || !formData.reportType || !formData.reportDate) {
      setError('Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const fileData = await fileToBase64(file);
      const code = generateAccessCode();
      const now = new Date();
      const expirationDate = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48 hours

      const report: Report = {
        id: Date.now().toString(),
        accessCode: code,
        patientName: formData.patientName,
        reportType: formData.reportType,
        reportDate: formData.reportDate,
        remarks: formData.remarks,
        fileName: file.name,
        fileData,
        uploadDate: now.toISOString(),
        expiresAt: expirationDate.toISOString(),
      };

      saveReport(report);
      setAccessCode(code);
      setUploadSuccess(true);
    } catch (err) {
      setError('Failed to upload report. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(accessCode);
  };

  const downloadAccessCode = () => {
    const content = `LabVault Access Code\n\nPatient: ${formData.patientName}\nReport Type: ${formData.reportType}\nAccess Code: ${accessCode}\n\nThis code expires in 48 hours.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LabVault_Access_Code_${accessCode}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setFormData({
      patientName: '',
      reportType: '',
      reportDate: '',
      remarks: '',
    });
    setFile(null);
    setUploadSuccess(false);
    setAccessCode('');
    setError('');
  };

  if (uploadSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="text-center space-y-6">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Successful!</h2>
              <p className="text-gray-600">Your lab report has been securely uploaded.</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Access Code</h3>
              <div className="bg-white border-2 border-blue-300 rounded-lg p-4 mb-4">
                <div className="text-3xl font-mono font-bold text-blue-600 tracking-wider text-center">
                  {accessCode}
                </div>
              </div>
              <p className="text-sm text-blue-700 mb-4">
                Share this code with authorized medical personnel. It expires in 48 hours.
              </p>
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy Code</span>
                </button>
                
                <button
                  onClick={downloadAccessCode}
                  className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <button
              onClick={resetForm}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Upload Another Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
            <UploadIcon className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Lab Report</h1>
          <p className="text-gray-600">Securely upload and generate access code for medical reports</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report File *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <FileText className="h-10 w-10 text-gray-400" />
                <span className="text-gray-600">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </span>
                <span className="text-sm text-gray-500">PDF, JPG, PNG (max 10MB)</span>
              </label>
            </div>
          </div>

          {/* Patient Name */}
          <div>
            <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-2">
              Patient Name *
            </label>
            <input
              type="text"
              id="patientName"
              name="patientName"
              value={formData.patientName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter patient's full name"
              required
            />
          </div>

          {/* Report Type */}
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-2">
              Report Type *
            </label>
            <select
              id="reportType"
              name="reportType"
              value={formData.reportType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            >
              <option value="">Select report type</option>
              {reportTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Report Date */}
          <div>
            <label htmlFor="reportDate" className="block text-sm font-medium text-gray-700 mb-2">
              Report Date *
            </label>
            <input
              type="date"
              id="reportDate"
              name="reportDate"
              value={formData.reportDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          {/* Remarks */}
          <div>
            <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-2">
              Remarks (Optional)
            </label>
            <textarea
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Additional notes or remarks about the report"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <span className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Uploading...</span>
              </span>
            ) : (
              'Upload Report'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;