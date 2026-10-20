const results = [
  { id: 1, name: 'Ali', department: 'CS', course: 'FSWD', marks: 82 },
  { id: 2, name: 'Sara', department: 'CS', course: 'FSWD', marks: 91 },
  { id: 3, name: 'Usman', department: 'SE', course: 'FSWD', marks: 47 },
  { id: 4, name: 'Hina', department: 'AI', course: 'FSWD', marks: 73 },
  { id: 5, name: 'Ahmed', department: 'SE', course: 'FSWD', marks: 64 },
  { id: 6, name: 'Zoya', department: 'AI', course: 'FSWD', marks: 91 }
];

function getGrade(marks) {
  if (marks >= 85 && marks <= 100) return { grade: 'A', gradePoints: 4.0, status: 'Pass' };
  if (marks >= 80 && marks <= 84) return { grade: 'A-', gradePoints: 3.7, status: 'Pass' };
  if (marks >= 75 && marks <= 79) return { grade: 'B+', gradePoints: 3.3, status: 'Pass' };
  if (marks >= 70 && marks <= 74) return { grade: 'B', gradePoints: 3.0, status: 'Pass' };
  if (marks >= 65 && marks <= 69) return { grade: 'B-', gradePoints: 2.7, status: 'Pass' };
  if (marks >= 60 && marks <= 64) return { grade: 'C+', gradePoints: 2.3, status: 'Pass' };
  if (marks >= 50 && marks <= 59) return { grade: 'C', gradePoints: 2.0, status: 'Pass' };
  return { grade: 'F', gradePoints: 0, status: 'Fail' };
}

const enrichedResults = results.map((student) => ({
  ...student,
  ...getGrade(student.marks)
}));

const rankedMeritList = [...results]
  .sort((a, b) => b.marks - a.marks || a.name.localeCompare(b.name));

const departmentStatistics = results.reduce((acc, student) => {
  const dept = student.department;
  const deptStats = acc[dept] || { students: 0, total: 0, highest: 0, passed: 0 };

  deptStats.students += 1;
  deptStats.total += student.marks;
  deptStats.highest = Math.max(deptStats.highest, student.marks);
  if (student.marks >= 50) deptStats.passed += 1;

  acc[dept] = {
    students: deptStats.students,
    average: Number((deptStats.total / deptStats.students).toFixed(2)),
    highest: deptStats.highest,
    passed: deptStats.passed
  };

  return acc;
}, {});

const overallAverage = results.reduce((sum, student) => sum + student.marks, 0) / results.length;

const firstStudentAbove85 = results.find((student) => student.marks > 85);
const firstFailedIndex = results.findIndex((student) => student.marks < 50);
const hasAnyFailedStudent = results.some((student) => student.marks < 50);
const allMarksInRange = results.every((student) => student.marks >= 0 && student.marks <= 100);
const studentsAboveAverage = results.filter((student) => student.marks > overallAverage);
const topThree = [...results]
  .sort((a, b) => b.marks - a.marks || a.name.localeCompare(b.name))
  .slice(0, 3)
  .map((student) => student.name);

console.log('A. Result Processing');
console.log(JSON.stringify(enrichedResults, null, 2));

console.log('\nB. Ranked Merit List');
console.log(JSON.stringify(rankedMeritList, null, 2));

console.log('\nC. Department Statistics');
console.log(JSON.stringify(departmentStatistics, null, 2));

console.log('\nD. Academic Queries');
console.log({
  firstStudentAbove85,
  firstFailedIndex,
  hasAnyFailedStudent,
  allMarksInRange,
  studentsAboveAverage,
  topThree,
  overallAverage: Number(overallAverage.toFixed(2))
});
