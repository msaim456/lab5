const student = {
  id: 101,
  name: 'Ali',
  marks: 0,
  scholarship: false,
  address: {
    city: 'Islamabad',
    sector: 'F-10'
  },
  contact: {
    email: 'ali@university.edu'
  }
};

const update = {
  name: 'Ali Khan',
  address: { city: 'Rawalpindi' },
  contact: { phone: '03001234567' }
};

function updateStudentProfile(currentStudent, incomingUpdate) {
  const {
    name: newName = currentStudent.name,
    address: incomingAddress = {},
    contact: incomingContact = {},
    ...restFields
  } = incomingUpdate;

  const { city: updatedCity = currentStudent.address?.city, ...remainingAddressFields } = incomingAddress;
  const { phone: newPhone, email: ignoredEmail, ...remainingContactFields } = incomingContact;

  const nextAddress = {
    ...currentStudent.address,
    ...remainingAddressFields,
    ...(updatedCity !== undefined ? { city: updatedCity } : {})
  };

  const nextContact = {
    ...currentStudent.contact,
    ...remainingContactFields,
    ...(newPhone !== undefined ? { phone: newPhone } : {})
  };

  return {
    ...currentStudent,
    ...restFields,
    name: newName ?? currentStudent.name,
    address: nextAddress,
    contact: nextContact,
    marks: currentStudent.marks ?? 0,
    scholarship: currentStudent.scholarship ?? false
  };
}

const updatedStudent = updateStudentProfile(student, update);

console.log('Original student');
console.log(student);
console.log('\nUpdated student');
console.log(updatedStudent);

console.log('\nReference checks');
console.log('original object vs updated object:', Object.is(student, updatedStudent));
console.log('original address vs updated address:', Object.is(student.address, updatedStudent.address));
console.log('original contact vs updated contact:', Object.is(student.contact, updatedStudent.contact));

console.log('\nWhy references differ');
console.log('The update function creates a new top-level object and new nested address/contact objects, so the original references remain unchanged.');
console.log('Only the city field inside address is overwritten; sector remains from the original object.');
console.log('The email property is preserved because it is copied from the original contact object and the phone property is merged in.');

const [firstName, lastName] = updatedStudent.name.split(' ');
const { city, sector = 'Unknown sector' } = updatedStudent.address;
const { email } = updatedStudent.contact;
const { phone = 'Not provided' } = updatedStudent.contact;

const debug = {
  firstName,
  lastName,
  city,
  sector,
  email,
  phone,
  hasContactPhone: phone !== 'Not provided'
};

console.log('\nDestructuring demonstration');
console.log(debug);

const defaultAddress = updatedStudent.address ?? { city: 'Unknown city' };
const collection = [10, 20, 30];
const [firstItem, ...restItems] = collection;
const studentCopy = {
  ...updatedStudent,
  address: { ...updatedStudent.address },
  contact: { ...updatedStudent.contact }
};

console.log({
  firstItem,
  restItems,
  defaultAddress,
  sameStudentSnapshot: studentCopy.name === updatedStudent.name,
  optionalCity: student?.address?.city ?? 'Missing city',
  nullishName: student.name ?? 'No name available'
});
