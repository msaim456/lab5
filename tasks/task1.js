const applicants = [
  { id: 'A101', name: 'Sara Khan', age: '19', matricMarks: '91', intermediateMarks: '87', entryTest: '78', program: 'BSCS', feePaid: 'true' },
  { id: 'A102', name: 'Ahmed Ali', age: 'twenty', matricMarks: '88', intermediateMarks: '', entryTest: '72', program: 'BSSE', feePaid: 'false' },
  { id: 'A103', name: 'Hassan', age: '18', matricMarks: '76', intermediateMarks: '83', entryTest: '91', program: 'BSAI', feePaid: 'true' },
  { id: 'A104', name: 'Maria', age: '22', matricMarks: '68', intermediateMarks: '60', entryTest: '59', program: 'BSCS', feePaid: 'true' },
  { id: 'A105', name: 'Usman', age: '29', matricMarks: '95', intermediateMarks: '73', entryTest: '62', program: 'BBA', feePaid: 'true' }
];

const supportedPrograms = new Set(['BSCS', 'BSSE', 'BSAI', 'BSIT', 'BBA']);

function toNumber(value) {
  if (value === null || value === undefined || value === '') {
    return { valid: false, value: null, reason: 'Missing value' };
  }

  const trimmed = String(value).trim();
  if (trimmed === '') {
    return { valid: false, value: null, reason: 'Missing value' };
  }

  const normalized = Number(trimmed);
  if (Number.isNaN(normalized)) {
    return { valid: false, value: null, reason: 'Invalid numeric conversion' };
  }

  return { valid: true, value: normalized, reason: null };
}

function calculateMerit(matricMarks, intermediateMarks, entryTest) {
  return (matricMarks * 0.2) + (intermediateMarks * 0.3) + (entryTest * 0.5);
}

function sanitizeApplicant(applicant) {
  const ageResult = toNumber(applicant.age);
  const matricResult = toNumber(applicant.matricMarks);
  const interResult = toNumber(applicant.intermediateMarks);
  const entryResult = toNumber(applicant.entryTest);

  const fieldIssues = [];

  if (!ageResult.valid) fieldIssues.push('age');
  if (!matricResult.valid) fieldIssues.push('matricMarks');
  if (!interResult.valid) fieldIssues.push('intermediateMarks');
  if (!entryResult.valid) fieldIssues.push('entryTest');

  const program = String(applicant.program ?? '').trim();
  if (!supportedPrograms.has(program)) {
    fieldIssues.push('program');
  }

  const isAgeValid = ageResult.valid && ageResult.value >= 17 && ageResult.value <= 30;
  const isMarkValid =
    matricResult.valid && interResult.valid && entryResult.valid &&
    matricResult.value >= 0 && matricResult.value <= 100 &&
    interResult.value >= 0 && interResult.value <= 100 &&
    entryResult.value >= 0 && entryResult.value <= 100;

  const isComplete = ageResult.valid && matricResult.valid && interResult.valid && entryResult.valid && program;

  if (!isComplete || !isAgeValid || !isMarkValid || !supportedPrograms.has(program)) {
    return {
      id: applicant.id ?? 'UNKNOWN',
      name: applicant.name ?? 'Unknown',
      status: 'INVALID_DATA',
      errors: fieldIssues
    };
  }

  const merit = calculateMerit(matricResult.value, interResult.value, entryResult.value);
  const isEligible = merit >= 70 && entryResult.value >= 60 && interResult.value >= 60;

  if (isEligible) {
    return {
      id: applicant.id,
      name: applicant.name,
      age: ageResult.value,
      matricMarks: matricResult.value,
      intermediateMarks: interResult.value,
      entryTest: entryResult.value,
      program,
      merit: Number(merit.toFixed(2)),
      status: merit >= 80 ? 'SELECTED' : 'WAITING'
    };
  }

  return {
    id: applicant.id,
    name: applicant.name,
    age: ageResult.value,
    matricMarks: matricResult.value,
    intermediateMarks: interResult.value,
    entryTest: entryResult.value,
    program,
    merit: Number(merit.toFixed(2)),
    status: 'REJECTED'
  };
}

const processedApplicants = applicants.map(sanitizeApplicant);

const validApplicants = processedApplicants.filter((applicant) => applicant.status !== 'INVALID_DATA');
const invalidApplicants = processedApplicants.filter((applicant) => applicant.status === 'INVALID_DATA');

const highestMeritApplicant = validApplicants.reduce((best, current) => {
  if (!best || current.merit > best.merit) return current;
  return best;
}, null);

const lowestMeritApplicant = validApplicants.reduce((lowest, current) => {
  if (!lowest || current.merit < lowest.merit) return current;
  return lowest;
}, null);

const averageMerit = validApplicants.length
  ? validApplicants.reduce((sum, applicant) => sum + applicant.merit, 0) / validApplicants.length
  : 0;

const programTotals = validApplicants.reduce((totals, applicant) => {
  totals[applicant.program] = (totals[applicant.program] || 0) + 1;
  return totals;
}, {});

const summary = {
  totalApplicants: applicants.length,
  validApplicants: validApplicants.length,
  invalidApplicants: invalidApplicants.length,
  highestMeritApplicant: highestMeritApplicant ? {
    id: highestMeritApplicant.id,
    name: highestMeritApplicant.name,
    merit: highestMeritApplicant.merit,
    program: highestMeritApplicant.program
  } : null,
  lowestMeritAmongValidApplicants: lowestMeritApplicant ? {
    id: lowestMeritApplicant.id,
    name: lowestMeritApplicant.name,
    merit: lowestMeritApplicant.merit,
    program: lowestMeritApplicant.program
  } : null,
  averageMerit: Number(averageMerit.toFixed(2)),
  applicantsByProgram: programTotals
};

console.log('Processed Applicants');
console.log(JSON.stringify(processedApplicants, null, 2));
console.log('\nAdmission Summary');
console.log(JSON.stringify(summary, null, 2));
