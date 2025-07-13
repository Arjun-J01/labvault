export interface Report {
  id: string;
  accessCode: string;
  patientName: string;
  reportType: string;
  reportDate: string;
  remarks: string;
  fileName: string;
  fileData: string; // base64 encoded file data
  uploadDate: string;
  expiresAt: string;
}

export interface ReportMetadata {
  patientName: string;
  reportType: string;
  reportDate: string;
  remarks: string;
}