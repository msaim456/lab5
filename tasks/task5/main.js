import Student from './Student.js';
import { calculateGrade as getGrade, calculateAverage as getAverage, calculateGPA as getGPA } from './gradeUtils.js';
import { parseTranscriptJSON, buildTranscriptReport, convertReportToJSON } from './transcriptService.js';

const rawData = `[
  {
    "id": 101,
    "name": "Ali",
    "courses": [
      { "code": "CS301", "marks": 81 },
      { "code": "CS302", "marks": 74 }
    ]
  },
  {
    "id": 102,
    "name": "Sara",
    "courses": [
      { "code": "CS301", "marks": 90 },
      { "code": "CS302", "marks": 88 }
    ]
  }
]`;

function demonstrateProcessing() {
  const students = parseTranscriptJSON(rawData);
  const report = buildTranscriptReport(students);

  console.log('Parsed student objects');
  console.log(students.map((student) => ({
    id: student.id,
    name: student.name,
    average: student.getAverageMarks(),
    gpa: student.getGPA()
  })));

  console.log('\nGenerated report');
  console.log(convertReportToJSON(report));

  console.log('\nUtility usage');
  console.log(getGrade(81));
  console.log(getAverage([81, 74]));
  console.log(getGPA([81, 74]));
}

try {
  demonstrateProcessing();
} catch (error) {
  console.error('Processing failed:', error.name, error.message);
} finally {
  console.log('\nTranscript processing attempt finished.');
}

const invalidRawData = '[{"id": 103, "courses": [{"code": "CS401", "marks": 150}]}]';

try {
  parseTranscriptJSON(invalidRawData);
} catch (error) {
  console.log('\nInvalid transcript validation example');
  console.log(error.name, error.message);
} finally {
  console.log('Validation complete.');
}

console.log('\nDemonstrated imports: default import from Student.js and named imports from gradeUtils.js.');
