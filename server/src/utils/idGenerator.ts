export function generateSubmissionId(sequenceNumber: number): string {
  return `CM-V2-R1-${sequenceNumber.toString().padStart(5, '0')}`;
}
