export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  postedAt: string;
}

export interface Resume {
  id: number;
  fileName: string;
  fileType: string;
  uploadedAt: string;
}

export interface CoverLetter {
  id: number;
  resumeId: number;
  jobDescription: string;
  content: string;
  createdAt: string;
}

export type ApplicationStatus = 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'REJECTED';

export interface Application {
  id: number;
  jobTitle: string;
  company: string;
  status: ApplicationStatus;
  appliedAt: string;
  notes: string;
}
