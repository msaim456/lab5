class Person {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  introduce() {
    return `Hello, I am ${this.name} and my email is ${this.email}.`;
  }
}

class Student extends Person {
  constructor(name, email, rollNo, marks) {
    super(name, email);
    this.rollNo = rollNo;
    this.marks = marks;
  }

  introduce() {
    return `${super.introduce()} I am a student with roll number ${this.rollNo} and marks ${this.marks}.`;
  }

  getResult() {
    return this.marks >= 50 ? 'Pass' : 'Fail';
  }
}

class FacultyMember extends Person {
  constructor(name, email, employeeId, department) {
    super(name, email);
    this.employeeId = employeeId;
    this.department = department;
  }

  introduce() {
    return `${super.introduce()} I am a faculty member with employee ID ${this.employeeId} in ${this.department}.`;
  }
}

const student1 = new Student('Ali', 'ali@uni.edu', 'CS-101', 88);
const student2 = new Student('Sara', 'sara@uni.edu', 'CS-102', 72);
const faculty1 = new FacultyMember('Dr. Ahmed', 'ahmed@uni.edu', 'F-101', 'Computer Science');
const faculty2 = new FacultyMember('Dr. Zoya', 'zoya@uni.edu', 'F-202', 'Software Engineering');

const users = [student1, student2, faculty1, faculty2];

console.log('Runtime polymorphism demo');
users.forEach((user) => console.log(user.introduce()));

console.log('\nInstance checks');
console.log(student1 instanceof Student);
console.log(student1 instanceof Person);
console.log(faculty1 instanceof FacultyMember);
console.log(faculty1 instanceof Person);

const guest = { name: 'Dr. Ahmed', email: 'ahmed@example.com' };
console.log('\nUsing call() to invoke Person.introduce with guest as this');
console.log(Person.prototype.introduce.call(guest));

console.log('\nDetached method demo');
const detached = student1.introduce;
try {
  console.log(detached());
} catch (error) {
  console.log('Detached method failed:', error.name, error.message);
}

const safeBoundMethod = student1.introduce.bind(student1);
console.log('\nBound version');
console.log(safeBoundMethod());

console.log('\nExplanation');
console.log('The correct introduce() is executed because JavaScript resolves methods dynamically at runtime based on the actual object instance.');
console.log('When a method is detached, this becomes undefined in strict mode, so the call fails unless it is bound or called with call/apply.');
