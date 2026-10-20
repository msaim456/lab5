import Student from './Student.js';
import { calculateGrade } from './gradeUtils.js';

export function parseTranscriptJSON(rawData) {
  let parsedData;

  try {
    parsedData = JSON.parse(rawData);
  } catch (error) {
    throw new SyntaxError('Malformed transcript JSON input.');
  }

  if (!Array.isArray(parsedData)) {
    throw new TypeError('Transcript data must be an array of student records.');
  }

  const seenIds = new Set();

  return parsedData.map((studentRecord, index) => {
    if (!studentRecord || typeof studentRecord !== 'object') {
      throw new TypeError(`Student record at index ${index} is invalid.`);
    }

    if (studentRecord.id === undefined || studentRecord.id === null) {
      throw new TypeError(`Student at index ${index} is missing an ID.`);
    }

    const normalizedId = String(studentRecord.id);
    if (seenIds.has(normalizedId)) {
      throw new Error(`Duplicate student ID found: ${normalizedId}`);
    }

    seenIds.add(normalizedId);

    const courses = Array.isArray(studentRecord.courses) ? studentRecord.courses : [];
    const validatedCourses = courses.map((course, courseIndex) => {
      if (!course || typeof course !== 'object') {
        throw new TypeError(`Course at index ${courseIndex} for student ${normalizedId} is invalid.`);
      }

      if (!course.code || String(course.code).trim() === '') {
        throw new TypeError(`Course code missing for student ${normalizedId}.`);
      }

      const numericMarks = Number(course.marks);
      if (Number.isNaN(numericMarks) || numericMarks < 0 || numericMarks > 100) {
        throw new RangeError(`Marks for course ${course.code} are outside the valid range 0-100.`);
      }

      return {
        code: String(course.code).trim(),
        marks: numericMarks
      };
    });

    return new Student(normalizedId, studentRecord.name ?? 'Unknown Student', validatedCourses);
  });
}

export function buildTranscriptReport(studentRecords) {
  return studentRecords.map((student) => ({
    id: student.id,
    name: student.name,
    average: Number(student.getAverageMarks().toFixed(2)),
    gpa: Number(student.getGPA().toFixed(2)),
    courses: student.courses.map((course) => ({
      code: course.code,
      marks: course.marks,
      grade: calculateGrade(course.marks)
    }))
  }));
}

export function convertReportToJSON(report) {
  return JSON.stringify(report, null, 2);
}
