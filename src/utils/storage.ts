import { Report } from '../types';

const STORAGE_KEY = 'labvault_reports';

export const saveReport = (report: Report): void => {
  const reports = getReports();
  reports.push(report);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
};

export const getReports = (): Report[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getReportByCode = (accessCode: string): Report | null => {
  const reports = getReports();
  const report = reports.find(r => r.accessCode === accessCode);
  
  if (!report) return null;
  
  // Check if report has expired (48 hours)
  const now = new Date();
  const expirationDate = new Date(report.expiresAt);
  
  if (now > expirationDate) {
    // Remove expired report
    const updatedReports = reports.filter(r => r.accessCode !== accessCode);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReports));
    return null;
  }
  
  return report;
};

export const deleteReport = (id: string): void => {
  const reports = getReports().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
};

export const generateAccessCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};