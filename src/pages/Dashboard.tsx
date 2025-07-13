import React, { useState, useMemo } from 'react';
import { BarChart3, FileText, Calendar, Trash2, Eye, Filter } from 'lucide-react';
import { getReports, deleteReport } from '../utils/storage';
import { Report } from '../types';

const Dashboard: React.FC = () => {
  const [reports, setReports] = useState<Report[]>(getReports());
  const [filterType, setFilterType] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [sortBy, setSortBy] = useState('uploadDate');

  const filteredReports = useMemo(() => {
    let filtered = reports;

    if (filterType) {
      filtered = filtered.filter(report => report.reportType === filterType);
    }

    if (filterDate) {
      filtered = filtered.filter(report => 
        report.reportDate.startsWith(filterDate)
      );
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'uploadDate') {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      } else if (sortBy === 'patientName') {
        return a.patientName.localeCompare(b.patientName);
      } else if (sortBy === 'reportType') {
        return a.reportType.localeCompare(b.reportType);
      }
      return 0;
    });
  }, [reports, filterType, filterDate, sortBy]);

  const reportTypeStats = useMemo(() => {
    const stats = reports.reduce((acc, report) => {
      acc[report.reportType] = (acc[report.reportType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(stats).map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / reports.length) * 100)
    }));
  }, [reports]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      deleteReport(id);
      setReports(getReports());
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const uniqueReportTypes = Array.from(new Set(reports.map(r => r.reportType)));

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Lab Dashboard</h1>
            <p className="text-gray-600">Manage and monitor all uploaded reports</p>
          </div>
          <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Reports</p>
                <p className="text-3xl font-bold text-blue-900">{reports.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">This Month</p>
                <p className="text-3xl font-bold text-green-900">
                  {reports.filter(r => 
                    new Date(r.uploadDate).getMonth() === new Date().getMonth()
                  ).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Report Types</p>
                <p className="text-3xl font-bold text-purple-900">{uniqueReportTypes.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Active Codes</p>
                <p className="text-3xl font-bold text-orange-900">
                  {reports.filter(r => new Date(r.expiresAt) > new Date()).length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Report Type Analytics */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Report Type Distribution</h2>
        <div className="space-y-4">
          {reportTypeStats.map(({ type, count, percentage }) => (
            <div key={type} className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{type}</span>
                  <span className="text-sm text-gray-500">{count} reports ({percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Report List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
          <h2 className="text-xl font-semibold text-gray-900">All Reports</h2>
          
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              {uniqueReportTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <input
              type="month"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="uploadDate">Sort by Upload Date</option>
              <option value="patientName">Sort by Patient Name</option>
              <option value="reportType">Sort by Report Type</option>
            </select>
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-600">Try adjusting your filters or upload your first report.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Patient Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Report Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Report Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Access Code</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Upload Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => {
                  const isExpired = new Date(report.expiresAt) < new Date();
                  return (
                    <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{report.patientName}</td>
                      <td className="py-3 px-4 text-gray-600">{report.reportType}</td>
                      <td className="py-3 px-4 text-gray-600">{formatDate(report.reportDate)}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                          {report.accessCode}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{formatDate(report.uploadDate)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isExpired 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {isExpired ? 'Expired' : 'Active'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Delete report"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;