import { IAssignment } from "./assignment";

interface BaseReportData {
  schoolName: string;
  teacherName: string;
  className: string;
  dateRange: string;
}

export interface ReportData {
  completedAssignments: IAssignment[];
  inCompletedAssignments: IAssignment[];
  studentEmail: string;
  studentName: string;
  feedback?: string;
}

export interface DataForReport {
  dataForReport: ReportData[];
  baseData: BaseReportData;
}
