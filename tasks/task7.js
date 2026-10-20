const studentDatabase = {
  101: { id: 101, name: 'Ali', completedCourses: ['CS301'] },
  102: { id: 102, name: 'Sara', completedCourses: [] }
};

const courseDatabase = {
  CS401: {
    code: 'CS401',
    title: 'Advanced JavaScript',
    prerequisites: ['CS301'],
    seats: 2,
    enrolled: [101]
  },
  CS402: {
    code: 'CS402',
    title: 'Middleware',
    prerequisites: ['CS401'],
    seats: 1,
    enrolled: []
  }
};

function getStudent(studentId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const student = studentDatabase[studentId];
      if (!student) {
        reject(new Error('Student does not exist'));
        return;
      }
      resolve(student);
    }, 100);
  });
}

function getCourse(courseCode) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const course = courseDatabase[courseCode];
      if (!course) {
        reject(new Error('Course does not exist'));
        return;
      }
      resolve(course);
    }, 80);
  });
}

function checkPrerequisites(student, course) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const hasPrerequisite = course.prerequisites.every((item) => student.completedCourses.includes(item));
      if (!hasPrerequisite) {
        reject(new Error('Prerequisite not completed'));
        return;
      }
      resolve({ student, course });
    }, 110);
  });
}

function checkSeats(course) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (course.enrolled.length >= course.seats) {
        reject(new Error('Course is full'));
        return;
      }
      resolve(course);
    }, 90);
  });
}

function registerStudent(studentId, courseCode) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const course = courseDatabase[courseCode];
      if (!course) {
        reject(new Error('Course does not exist'));
        return;
      }
      if (course.enrolled.includes(studentId)) {
        reject(new Error('Student already registered'));
        return;
      }
      course.enrolled.push(studentId);
      resolve({ studentId, course: courseCode, status: 'REGISTERED' });
    }, 120);
  });
}

function sendEmail() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.2) {
        reject(new Error('Email service failed'));
        return;
      }
      resolve('Email delivered');
    }, 100);
  });
}

function sendSMS() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('SMS service failed'));
    }, 100);
  });
}

function writeAuditLog() {
  return new Promise((resolve) => {
    setTimeout(() => resolve('Audit logged'), 120);
  });
}

function registerCourseChain(studentId, courseCode) {
  return getStudent(studentId)
    .then((student) => getCourse(courseCode).then((course) => ({ student, course })))
    .then(({ student, course }) => checkPrerequisites(student, course).then(() => ({ student, course })))
    .then(({ student, course }) => checkSeats(course).then(() => ({ student, course })))
    .then(({ student, course }) => registerStudent(student.id, course.code))
    .catch((error) => {
      console.error('Registration failed in chain:', error.message);
      throw error;
    })
    .finally(() => {
      console.log('Registration chain finished.');
    });
}

async function demoPostRegistration() {
  const outcomes = await Promise.allSettled([sendEmail(), sendSMS(), writeAuditLog()]);
  return outcomes.map((result, index) => ({
    service: ['Email', 'SMS', 'Audit'][index],
    status: result.status
  }));
}

async function demoServerSelection() {
  const courseFromPrimary = getCourse('CS401');
  const courseFromSecondary = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ code: 'CS401', title: 'Backup server result' });
    }, 200);
  });

  try {
    const firstSuccessful = await Promise.any([courseFromPrimary, courseFromSecondary]);
    console.log('First successful course result from either server:', firstSuccessful);
  } catch (error) {
    console.error('No server succeeded:', error.message);
  }
}

registerCourseChain(101, 'CS401')
  .then((result) => {
    console.log('Chain result:', result);
    return demoPostRegistration();
  })
  .then((report) => {
    console.log('Post-registration services:', report);
    return demoServerSelection();
  })
  .catch((error) => {
    console.error('Upper-level error:', error.message);
  });

console.log('Promise chaining and combinators used: then(), catch(), finally(), Promise.allSettled(), Promise.any().');
