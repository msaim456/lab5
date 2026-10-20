import { calculateAverage, calculateGPA } from './gradeUtils.js';

export default class Student {
  constructor(id, name, courses = []) {
    this.id = id;
    this.name = name;
    this.courses = courses;
  }

  getAverageMarks() {
    return calculateAverage(this.courses.map((course) => course.marks));
  }

  getGPA() {
    return calculateGPA(this.courses.map((course) => course.marks));
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      courses: this.courses
    };
  }
}
