import { Document, ImageRun, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { DataForReport } from "../types/reportData";

export const generateWordDocument = async (
  reportData: DataForReport,
  schoolLogo: string,
  isSendingEmail = false
) => {
  const { baseData, dataForReport } = reportData;

  const fetchImageBuffer = async (imagePath: string): Promise<ArrayBuffer> => {
    const response = await fetch(imagePath);
    const blob = await response.blob();
    return blob.arrayBuffer();
  };
  
  const schoolLogoBuffer = await fetchImageBuffer(schoolLogo);

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            alignment: "center",
            children: [
              new ImageRun({
                data: schoolLogoBuffer,
                transformation: {
                  width: 300,
                  height: 300,
                },
                type: "png",
              }),
            ],
            spacing: { after: 400 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `School Name: ${baseData.schoolName}`,
                bold: true,
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Teacher: ${baseData.teacherName}`,
                bold: true,
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Class: ${baseData.className}`,
                bold: true,
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Date range: ${baseData.dateRange}`,
                bold: true,
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Class ${baseData.className}`,
                bold: true,
                size: 32,
              }),
            ],
          }),
        ],
      },
      ...dataForReport.map((student) => ({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `Student: ${student.studentName}`,
                bold: true,
                size: 32,
              }),
            ],
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            children: student.feedback
              ? student.feedback.split("\n").map(
                  (line) =>
                    new TextRun({
                      text: line.trim(),
                      break: 1,
                      size: 28,
                    })
                )
              : [
                  new TextRun({
                    text: "No feedback available.",
                  }),
                ],
          }),
        ],
      })),
    ],
  });

  if (!isSendingEmail) {
    Packer.toBlob(doc).then((blob) => {
      saveAs(
        blob,
        `Summary_Report_${baseData.schoolName}_${
          baseData.className
        }_${new Date().toLocaleDateString()}.docx`
      );
    });
  } else {
    return await Packer.toBuffer(doc);
  }
};
