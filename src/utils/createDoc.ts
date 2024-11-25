import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { DataForReport } from '../types/reportData';

export const generateWordDocument = (reportData: DataForReport) => {
  const { baseData, dataForReport } = reportData;

  const doc = new Document({
    sections: [
      {
        children: [
          // Логотипи
          new Paragraph({
            children: [
              new TextRun({
                text: "Teacher’s AI-d (teachers ai-d logo)",
                bold: true,
                size: 28,
              }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "(school logo)",
                italics: true,
                size: 24,
              }),
            ],
            spacing: { after: 400 },
          }),

          // Заголовок
          new Paragraph({
            children: [
              new TextRun({
                text: `Summary Usage Report for:`,
                bold: true,
                size: 24,
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph(`School Name: ${baseData.schoolName}`),
          new Paragraph(`Teacher: ${baseData.teacherName}`),
          new Paragraph(`Class: ${baseData.className}`),
          new Paragraph(`Date range: ${baseData.dateRange}`),

          // Клас
          new Paragraph({
            children: [
              new TextRun({
                text: `Class ${baseData.className}:`,
                bold: true,
                size: 20,
              }),
            ],
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph("Total time spent on App"),
        ],
      },
      ...dataForReport.map((student) => ({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `Student: ${student.studentName}`,
                bold: true,
                size: 20,
              }),
            ],
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph("Lessons completed successfully:"),
          ...student.completedAssignments.map(
            (assignment) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: `- ${assignment.title}`,
                  }),
                ],
              })
          ),
          new Paragraph("Incomplete lessons:"),
          ...student.inCompletedAssignments.map(
            (assignment) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: `- ${assignment.title}`,
                  }),
                ],
              })
          ),
          new Paragraph({
            children: [
              new TextRun({
                text: "AI Generated qualitative review of student performance:",
                bold: true,
              }),
            ],
          }),
          new Paragraph(
            "Areas where student performed well, and where student struggled. Any noticed improvement from previous time interval."
          ),
        ],
      })),
    ],
  });

  // Завантаження документа
  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, "Summary_Report.docx");
  });
}