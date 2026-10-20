const studentDatabase = {
  101: { id: 101, name: 'Ali', completedCourses: ['CS301'] },
  102: { id: 102, name: 'Sara', completedCourses: [] }
};

const courseDatabase = {
  CS401: {
    code: 'CS401',
    prerequisites: ['CS301'],
    capacity: 2,
    enrolled: [101]
  },
  CS402: {
    code: 'CS402',
    prerequisites: ['CS401'],
    capacity: 1,
    enrolled: []
  }
};

function loadStudent(studentId, callback) {
  setTimeout(() => {
    const student = studentDatabase[studentId];
    if (!student) {
      return callback(new Error('Student does not exist'));
    }
    callback(null, student);
  }, 100);
}

function checkPrerequisites(studentId, courseCode, callback) {
  setTimeout(() => {
    const student = studentDatabase[studentId];
    const course = courseDatabase[courseCode];

    if (!course) {
      return callback(new Error('Course does not exist'));
    }

    if (!student.completedCourses.includes(course.prerequisites[0])) {
      return callback(new Error('Prerequisite not completed'));
    }

    callback(null, { studentId, courseCode, ok: true });
  }, 120);
}

function checkAvailableSeats(courseCode, callback) {
  setTimeout(() => {
    const course = courseDatabase[courseCode];
    if (!course) {
      return callback(new Error('Course does not exist'));
    }

    if (course.enrolled.length >= course.capacity) {
      return callback(new Error('Course is full'));
    }

    callback(null, { courseCode, seatsAvailable: course.capacity - course.enrolled.length });
  }, 150);
}

function registerCourse(studentId, courseCode, callback) {
  setTimeout(() => {
    const course = courseDatabase[courseCode];
    if (!course) {
      return callback(new Error('Course does not exist'));
    }

    if (course.enrolled.includes(studentId)) {
      return callback(new Error('Student already registered'));
    }

    course.enrolled.push(studentId);
    callback(null, {
      studentId,
      course: courseCode,
      status: 'REGISTERED'
    });
  }, 180);
}

function registerStudentFlow(studentId, courseCode, callback) {
  loadStudent(studentId, (studentError, student) => {
    if (studentError) {
      return callback(studentError);
    }

    checkPrerequisites(student.id, courseCode, (prereqError) => {
      if (prereqError) {
        return callback(prereqError);
      }

      checkAvailableSeats(courseCode, (seatError) => {
        if (seatError) {
          return callback(seatError);
        }

        registerCourse(student.id, courseCode, (registerError, result) => {
          if (registerError) {
            return callback(registerError);
          }

          callback(null, result);
        });
      });
    });
  });
}

registerStudentFlow(101, 'CS401', (error, result) => {
  if (error) {
    console.error('Registration failed:', error.message);
    return;
  }

  console.log('Success result:', result);
});

registerStudentFlow(102, 'CS401', (error, result) => {
  if (error) {
    console.error('Second attempt failed:', error.message);
    return;
  }

  console.log('Second attempt success:', result);
});

console.log('Callback-based workflow demonstrates nested dependent asynchronous stages and immediate failure propagation.');
