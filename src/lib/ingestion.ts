import * as XLSX from 'xlsx';
import { supabase } from './supabase';
import { calculateStudentSuccessScore, calculatePlacementReadiness, RawStudentInput } from '../utils/scoring';

export interface ParseResult {
  fileName: string;
  totalRows: number;
  validRows: RawStudentInput[];
  invalidRows: { rowNumber: number; data: any; errors: string[] }[];
}

export interface ImportCommitResult {
  batchId: string;
  total: number;
  imported: number;
  failed: number;
  errors: { row: number; message: string }[];
}

/**
 * Parses a CSV or XLSX file and validates every record against the institutional schema.
 */
export async function parseAndValidateFile(file: File): Promise<ParseResult> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  const validRows: RawStudentInput[] = [];
  const invalidRows: { rowNumber: number; data: any; errors: string[] }[] = [];

  rawRows.forEach((row, index) => {
    const rowNumber = index + 2; // Accounting for 1-indexed header line
    const errors: string[] = [];

    // Normalized lookup (case-insensitive column keys)
    const normalized: Record<string, any> = {};
    Object.keys(row).forEach(key => {
      normalized[key.trim().toLowerCase().replace(/[\s_-]+/g, '')] = row[key];
    });

    const rollNumber = (normalized['rollnumber'] || normalized['studentid'] || normalized['rollno'] || normalized['id'] || '').toString().trim();
    const name = (normalized['name'] || normalized['fullname'] || normalized['studentname'] || '').toString().trim();
    const email = (normalized['email'] || normalized['emailaddress'] || '').toString().trim();
    const department = (normalized['department'] || normalized['dept'] || normalized['branch'] || 'Computer Science').toString().trim();
    const year = parseInt(normalized['year'] || normalized['currentyear'] || '3', 10);
    const semester = parseInt(normalized['semester'] || normalized['currentsemester'] || '5', 10);
    const cgpa = parseFloat(normalized['cgpa'] || normalized['gpa'] || '0.0');
    const internalMarks = parseFloat(normalized['internalmarks'] || normalized['internals'] || normalized['marks'] || '70.0');
    const attendancePercentage = parseFloat(normalized['attendancepercentage'] || normalized['attendance'] || '85.0');
    const backlogs = parseInt(normalized['backlogs'] || normalized['arrears'] || '0', 10);
    const codingScore = parseFloat(normalized['codingscore'] || normalized['coding'] || '60.0');
    const aptitudeScore = parseFloat(normalized['aptitudescore'] || normalized['aptitude'] || '65.0');
    const technicalSkillsScore = parseFloat(normalized['technicalskillsscore'] || normalized['technical'] || '65.0');
    const communicationScore = parseFloat(normalized['communicationscore'] || normalized['communication'] || '70.0');
    const mockInterviewsCompleted = parseInt(normalized['mockinterviewscompleted'] || normalized['interviews'] || '0', 10);

    // Validation Rules
    if (!rollNumber) errors.push('Missing required Roll Number / Student ID');
    if (!name) errors.push('Missing required Student Full Name');
    if (!email || !email.includes('@')) errors.push('Invalid or missing student institutional email');
    if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) errors.push('CGPA must be a valid number between 0.0 and 10.0');
    if (isNaN(attendancePercentage) || attendancePercentage < 0 || attendancePercentage > 100) {
      errors.push('Attendance must be a valid percentage between 0% and 100%');
    }
    if (isNaN(backlogs) || backlogs < 0) errors.push('Backlogs count cannot be negative');

    if (errors.length > 0) {
      invalidRows.push({ rowNumber, data: row, errors });
    } else {
      validRows.push({
        studentId: rollNumber,
        name,
        email,
        department,
        year: isNaN(year) ? 3 : year,
        semester: isNaN(semester) ? 5 : semester,
        cgpa,
        internalMarks: isNaN(internalMarks) ? 70 : internalMarks,
        attendancePercentage,
        backlogs: isNaN(backlogs) ? 0 : backlogs,
        lmsLoginFrequency: 5,
        assignmentCompletionPercentage: Math.min(100, Math.round(attendancePercentage * 0.95)),
        engagementScore: Math.round((attendancePercentage + internalMarks) / 2),
        codingScore: isNaN(codingScore) ? 50 : codingScore,
        aptitudeScore: isNaN(aptitudeScore) ? 50 : aptitudeScore,
        technicalSkillsScore: isNaN(technicalSkillsScore) ? 50 : technicalSkillsScore,
        communicationScore: isNaN(communicationScore) ? 60 : communicationScore,
        mockInterviewsCompleted: isNaN(mockInterviewsCompleted) ? 0 : mockInterviewsCompleted,
        feedbackScore: 80,
        mentorId: 'USR-FACULTY-01',
        mentorName: 'Dr. Aris Thorne',
        avatar: `https://images.unsplash.com/photo-${1530000000000 + (index % 100)}?w=150&auto=format&fit=crop&q=80`,
      });
    }
  });

  return {
    fileName: file.name,
    totalRows: rawRows.length,
    validRows,
    invalidRows,
  };
}

/**
 * Commits parsed records into the Supabase PostgreSQL database tables:
 * - public.import_batches
 * - public.student_profiles
 * - public.placement_profiles
 * - public.import_row_errors
 */
export async function commitImportBatch(
  parseResult: ParseResult,
  institutionId: string = '00000000-0000-0000-0000-000000000001'
): Promise<ImportCommitResult> {
  const { fileName, validRows, invalidRows } = parseResult;

  // 1. Create Batch Record
  const { data: batch, error: batchError } = await supabase
    .from('import_batches')
    .insert([{
      institution_id: institutionId,
      dataset_type: 'students',
      filename: fileName,
      total_rows: validRows.length + invalidRows.length,
      successful_rows: 0,
      failed_rows: invalidRows.length,
      status: 'processing'
    }])
    .select()
    .single();

  const batchId = batch?.id || `BATCH-${Date.now()}`;

  const recordedErrors: { row: number; message: string }[] = [];

  // 2. Insert Pre-validation Errors into import_row_errors
  if (invalidRows.length > 0 && batch?.id) {
    const errorRecords = invalidRows.map(inv => ({
      batch_id: batchId,
      row_number: inv.rowNumber,
      raw_data: inv.data,
      error_message: inv.errors.join('; '),
    }));
    await supabase.from('import_row_errors').insert(errorRecords);
    invalidRows.forEach(inv => {
      recordedErrors.push({ row: inv.rowNumber, message: inv.errors.join('; ') });
    });
  }

  // 3. Insert Valid Students into student_profiles
  let importedCount = 0;

  for (const [idx, item] of validRows.entries()) {
    try {
      const successScoreObj = calculateStudentSuccessScore(item);
      const placementScoreObj = calculatePlacementReadiness(item);

      const studentRecord = {
        institution_id: institutionId,
        roll_number: item.studentId,
        name: item.name,
        email: item.email,
        batch_year: 2026 - item.year,
        current_year: item.year,
        current_semester: item.semester,
        cgpa: item.cgpa,
        internal_marks: item.internalMarks,
        attendance_percentage: item.attendancePercentage,
        backlogs: item.backlogs,
        risk_level: successScoreObj.riskLevel,
        student_success_score: successScoreObj.successScore,
        placement_readiness_score: placementScoreObj.score,
      };

      // Upsert student record by institution_id + roll_number
      const { data: studentResult, error: studentError } = await supabase
        .from('student_profiles')
        .upsert([studentRecord], { onConflict: 'institution_id,roll_number' })
        .select('id')
        .single();

      if (studentError) {
        throw studentError;
      }

      // Upsert corresponding placement profile
      if (studentResult?.id) {
        await supabase
          .from('placement_profiles')
          .upsert([{
            student_profile_id: studentResult.id,
            coding_score: item.codingScore,
            aptitude_score: item.aptitudeScore,
            technical_score: item.technicalSkillsScore,
            communication_score: item.communicationScore,
            mock_interviews_completed: item.mockInterviewsCompleted,
            readiness_tier: placementScoreObj.score >= 75 ? 'Placement Ready' : placementScoreObj.score >= 50 ? 'Developing' : 'Emerging',
          }], { onConflict: 'student_profile_id' });
      }

      importedCount++;
    } catch (err: any) {
      const rowNum = idx + 2;
      const errorMsg = err?.message || 'Database insert failed';
      recordedErrors.push({ row: rowNum, message: errorMsg });

      if (batch?.id) {
        await supabase.from('import_row_errors').insert([{
          batch_id: batchId,
          row_number: rowNum,
          raw_data: item as any,
          error_message: errorMsg,
        }]);
      }
    }
  }

  // 4. Update Batch Record Status
  if (batch?.id) {
    await supabase
      .from('import_batches')
      .update({
        successful_rows: importedCount,
        failed_rows: recordedErrors.length,
        status: recordedErrors.length === 0 ? 'completed' : 'completed_with_errors'
      })
      .eq('id', batchId);
  }

  return {
    batchId,
    total: validRows.length + invalidRows.length,
    imported: importedCount,
    failed: recordedErrors.length,
    errors: recordedErrors,
  };
}
