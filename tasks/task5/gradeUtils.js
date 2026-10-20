export function calculateGrade(marks) {
  if (marks >= 85 && marks <= 100) return 'A';
  if (marks >= 80 && marks <= 84) return 'A-';
  if (marks >= 75 && marks <= 79) return 'B+';
  if (marks >= 70 && marks <= 74) return 'B';
  if (marks >= 65 && marks <= 69) return 'B-';
  if (marks >= 60 && marks <= 64) return 'C+';
  if (marks >= 50 && marks <= 59) return 'C';
  return 'F';
}

export function calculateAverage(numbers) {
  if (!numbers || numbers.length === 0) return 0;
  const total = numbers.reduce((sum, value) => sum + Number(value), 0);
  return total / numbers.length;
}

export function calculateGPA(marksList) {
  if (!marksList || marksList.length === 0) return 0;

  const gradePoints = {
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'F': 0
  };

  const totalPoints = marksList.reduce((sum, marks) => sum + (gradePoints[calculateGrade(marks)] ?? 0), 0);
  return totalPoints / marksList.length;
}
