const userData = [
  { id: 1, name: 'Ali', department: 'CS', marks: 82 },
  { id: 2, name: 'Sara', department: 'CS', marks: 91 },
  { id: 3, name: 'Usman', department: 'SE', marks: 47 },
  { id: 4, name: 'Hina', department: 'AI', marks: 73 }
];

const coursesData = [
  { code: 'CS301', title: 'JavaScript' },
  { code: 'CS302', title: 'Algorithms' }
];

const resultsData = [
  { studentId: 1, marks: 82 },
  { studentId: 2, marks: 91 },
  { studentId: 3, marks: 47 },
  { studentId: 4, marks: 73 }
];

function fakeFetch(url) {
  return new Promise((resolve, reject) => {
    const delay = 100;

    setTimeout(() => {
      const endpoint = url.split('?')[0];

      if (endpoint === '/users') {
        resolve({ ok: true, status: 200, json: async () => userData });
        return;
      }

      if (endpoint === '/courses') {
        resolve({ ok: true, status: 200, json: async () => coursesData });
        return;
      }

      if (endpoint === '/results') {
        resolve({ ok: true, status: 200, json: async () => resultsData });
        return;
      }

      if (endpoint === '/missing') {
        resolve({ ok: false, status: 404, json: async () => ({ error: 'Not found' }) });
        return;
      }

      if (endpoint === '/server-error') {
        resolve({ ok: false, status: 500, json: async () => ({ error: 'Server error' }) });
        return;
      }

      if (endpoint === '/bad-json') {
        resolve({ ok: true, status: 200, json: async () => { throw new SyntaxError('Invalid JSON'); } });
        return;
      }

      if (endpoint === '/slow') {
        setTimeout(() => {
          resolve({ ok: true, status: 200, json: async () => userData });
        }, 1500);
        return;
      }

      reject(new Error('Network failure'));
    }, delay);
  });
}

async function getJSON(url, fetchImplementation) {
  try {
    const response = await fetchImplementation(url);
    if (!response || typeof response.ok === 'undefined') {
      throw new TypeError('Fetch did not return a valid response object.');
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} error for ${url}`);
    }

    try {
      return await response.json();
    } catch (error) {
      throw new SyntaxError(`Invalid JSON returned from ${url}`);
    }
  } catch (error) {
    if (error.name === 'TypeError') {
      throw new TypeError(`Fetch failure for ${url}`);
    }
    throw error;
  }
}

async function fetchWithTimeout(url, milliseconds, fetchImplementation = fetch) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), milliseconds);

  try {
    const response = await fetchImplementation(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} error for ${url}`);
    }
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out or was aborted');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function loadDashboard() {
  const [users, courses, results] = await Promise.all([
    getJSON('/users', fakeFetch),
    getJSON('/courses', fakeFetch),
    getJSON('/results', fakeFetch)
  ]);

  const totalStudents = users.length;
  const totalCourses = courses.length;
  const overallAverage = results.reduce((sum, item) => sum + item.marks, 0) / results.length;
  const highestStudent = results.reduce((best, current) => (current.marks > best.marks ? current : best), results[0]);
  const failedStudents = results.filter((item) => item.marks < 50).length;

  const departmentMap = results.reduce((acc, result) => {
    const student = users.find((user) => user.id === result.studentId);
    if (!student) return acc;

    const dept = student.department;
    if (!acc[dept]) {
      acc[dept] = { students: 0, totalMarks: 0, failed: 0 };
    }

    acc[dept].students += 1;
    acc[dept].totalMarks += result.marks;
    if (result.marks < 50) acc[dept].failed += 1;

    return acc;
  }, {});

  const departmentStatistics = Object.fromEntries(
    Object.entries(departmentMap).map(([department, data]) => [
      department,
      {
        students: data.students,
        averageMarks: Number((data.totalMarks / data.students).toFixed(2)),
        failed: data.failed
      }
    ])
  );

  return {
    totalStudents,
    totalCourses,
    overallAverage: Number(overallAverage.toFixed(2)),
    highestPerformingStudent: users.find((user) => user.id === highestStudent.studentId) ?? null,
    numberOfFailedStudents: failedStudents,
    departmentWiseStatistics: departmentStatistics
  };
}

(async () => {
  try {
    const markup = await loadDashboard();
    console.log('Dashboard summary');
    console.log(JSON.stringify(markup, null, 2));
  } catch (error) {
    console.error('Dashboard failed:', error.message);
  }

  try {
    const result = await getJSON('/missing', fakeFetch);
    console.log(result);
  } catch (error) {
    console.log('HTTP failure check:', error.message);
  }

  try {
    await fetchWithTimeout('/slow', 100, fakeFetch);
  } catch (error) {
    console.log('Timeout challenge:', error.message);
  }
})();

console.log('Expected concepts: async functions, await, Promise.all, response.ok, response.json, try/catch/finally, AbortController, and concurrent execution.');
