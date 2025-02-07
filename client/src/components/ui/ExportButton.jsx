import React from 'react';
import { Download } from 'lucide-react';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  WidthType,
  AlignmentType,
  Header,
  Footer,
  HeadingLevel,
  Tab,
  ImageRun,
} from 'docx';
import { saveAs } from 'file-saver';

const ExportButton = ({
  patientData,
  healthMetrics,
  medications,
  careTeam,
  recentAlerts,
}) => {
  const createHeaderParagraph = (text) => {
    return new Paragraph({
      text,
      heading: HeadingLevel.HEADING_1,
      thematicBreak: true,
      spacing: {
        before: 400,
        after: 200,
      },
      border: {
        bottom: {
          color: '3B82F6',
          size: 15,
          style: BorderStyle.SINGLE,
        },
      },
    });
  };

  const createSubHeaderParagraph = (text) => {
    return new Paragraph({
      text,
      heading: HeadingLevel.HEADING_2,
      spacing: {
        before: 300,
        after: 100,
      },
    });
  };

  const createBasicParagraph = (label, value) => {
    return new Paragraph({
      children: [
        new TextRun({
          text: `${label}: `,
          bold: true,
          size: 24,
        }),
        new TextRun({
          text: value,
          size: 24,
        }),
      ],
      spacing: {
        before: 100,
        after: 100,
      },
    });
  };

  const createTable = (headers, rows) => {
    return new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      borders: {
        top: {
          style: BorderStyle.SINGLE,
          size: 1,
        },
        bottom: {
          style: BorderStyle.SINGLE,
          size: 1,
        },
        left: {
          style: BorderStyle.SINGLE,
          size: 1,
        },
        right: {
          style: BorderStyle.SINGLE,
          size: 1,
        },
      },
      rows: [
        new TableRow({
          children: headers.map(
            (header) =>
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: header,
                        bold: true,
                        size: 24,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                shading: {
                  fill: 'E5E7EB',
                },
              })
          ),
        }),
        ...rows,
      ],
    });
  };

  const generateDoc = () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'ELder Care Center',
                      bold: true,
                      size: 36,
                      color: '2563EB',
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Medical Report - Generated on ${new Date().toLocaleDateString()}`,
                      size: 24,
                      color: '666666',
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'This report is confidential and intended only for authorized medical personnel.',
                      size: 20,
                      color: '666666',
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
          },
          children: [
            // Patient Information Section
            createHeaderParagraph('Patient Information'),
            createBasicParagraph('Name', patientData.name),
            createBasicParagraph('Age', patientData.age.toString()),
            createBasicParagraph('Room Number', patientData.roomNumber),
            createBasicParagraph('Blood Type', patientData.bloodType),
            createBasicParagraph('Insurance', patientData.insurance),
            createBasicParagraph('Admission Date', patientData.admissionDate),
            createBasicParagraph('Allergies', patientData.allergies.join(', ')),

            // Health Metrics Section
            createHeaderParagraph('Health Metrics'),
            createSubHeaderParagraph('Blood Pressure History'),
            createTable(
              ['Date', 'Time', 'Systolic', 'Diastolic', 'Pulse', 'Notes'],
              healthMetrics.bloodPressure.map(
                (bp) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph(bp.date)],
                      }),
                      new TableCell({
                        children: [new Paragraph(bp.time)],
                      }),
                      new TableCell({
                        children: [new Paragraph(bp.systolic.toString())],
                      }),
                      new TableCell({
                        children: [new Paragraph(bp.diastolic.toString())],
                      }),
                      new TableCell({
                        children: [new Paragraph(bp.pulse.toString())],
                      }),
                      new TableCell({
                        children: [new Paragraph(bp.notes)],
                      }),
                    ],
                  })
              )
            ),

            // Medications Section
            createHeaderParagraph('Medications'),
            ...medications
              .map((med) => [
                createSubHeaderParagraph(med.name),
                createBasicParagraph('Dosage', med.dosage),
                createBasicParagraph('Frequency', med.frequency),
                createBasicParagraph('Status', med.status),
                createBasicParagraph('Refill Date', med.refillDate),
                createBasicParagraph(
                  'Side Effects',
                  med.sideEffects.join(', ')
                ),
                createBasicParagraph('Adherence', `${med.adherence}%`),
                new Paragraph({
                  children: [new TextRun('')],
                  spacing: { after: 200 },
                }),
              ])
              .flat(),

            // Care Team Section
            createHeaderParagraph('Care Team'),
            ...careTeam
              .map((member) => [
                createSubHeaderParagraph(member.role),
                createBasicParagraph('Name', member.name),
                createBasicParagraph('Contact', member.contact),
                createBasicParagraph(
                  'Next Visit',
                  member.nextVisit || 'Not scheduled'
                ),
                createBasicParagraph(
                  'Availability',
                  member.available ? 'Available' : 'Unavailable'
                ),
                new Paragraph({
                  children: [new TextRun('')],
                  spacing: { after: 200 },
                }),
              ])
              .flat(),

            // Recent Alerts Section
            createHeaderParagraph('Recent Alerts'),
            ...recentAlerts
              .map((alert) => [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${alert.type} - ${alert.date}`,
                      bold: true,
                      size: 24,
                      color: alert.severity === 'high' ? 'FF0000' : 'FFA500',
                    }),
                  ],
                  spacing: { before: 200 },
                }),
                createBasicParagraph('Message', alert.message),
                createBasicParagraph('Action Required', alert.action),
                new Paragraph({
                  children: [new TextRun('')],
                  spacing: { after: 200 },
                }),
              ])
              .flat(),
          ],
        },
      ],
    });

    return doc;
  };

  const handleExport = async () => {
    const doc = generateDoc();
    const blob = await Packer.toBlob(doc);
    saveAs(
      blob,
      `${patientData.name}_medical_report_${
        new Date().toISOString().split('T')[0]
      }.docx`
    );
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm"
    >
      <Download size={20} />
      Export
    </button>
  );
};

export default ExportButton;
