import * as XLSX from 'xlsx';

export const generateExcel = (submissions: any[]): Buffer => {
  const data = submissions.map(sub => ({
    'Submission ID': sub.submissionId,
    'Team Name': sub.team?.teamName || '',
    'Leader Email': sub.leaderEmail,
    'Leader Contact': sub.leaderContact,
    'Domain': sub.domain,
    'Problem Statement': sub.problemStatement,
    'Solution Summary': sub.solutionSummary,
    'File Name': sub.fileName,
    'File Type': sub.fileType,
    'File Size (KB)': Math.round(sub.fileSize / 1024),
    'Submitted At': new Date(sub.submittedAt).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }),
    'Status': sub.status
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Freeze first row
  worksheet['!views'] = [{ state: 'frozen', ySplit: 1 }];
  // Set auto-filter on all columns
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:L1');
  worksheet['!autofilter'] = { ref: XLSX.utils.encode_range(range) };

  // Set reasonable column widths
  worksheet['!cols'] = [
    { wch: 18 }, // Submission ID
    { wch: 20 }, // Team Name
    { wch: 25 }, // Leader Email
    { wch: 15 }, // Leader Contact
    { wch: 20 }, // Domain
    { wch: 40 }, // Problem Statement
    { wch: 40 }, // Solution Summary
    { wch: 25 }, // File Name
    { wch: 10 }, // File Type
    { wch: 15 }, // File Size (KB)
    { wch: 25 }, // Submitted At
    { wch: 15 }  // Status
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions');

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
};
