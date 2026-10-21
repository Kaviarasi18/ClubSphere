export const validateClubForm = (values) => {
  const errors = {};
  if (!values.name?.trim()) errors.name = 'Club name is required.';
  if (!values.category?.trim()) errors.category = 'Category is required.';
  if (!values.description?.trim()) errors.description = 'Description is required.';
  if (!values.facultyCoordinator?.trim()) errors.facultyCoordinator = 'Faculty coordinator is required.';
  if (!values.studentCoordinator?.trim()) errors.studentCoordinator = 'Student coordinator is required.';
  if (!values.email?.trim()) errors.email = 'Official club email is required.';
  if (!values.identificationDetails?.trim()) errors.identificationDetails = 'Identification details are required.';
  if (!values.coordinatorName?.trim()) errors.coordinatorName = 'Coordinator name is required.';
  if (!values.coordinatorEmail?.trim()) errors.coordinatorEmail = 'Coordinator email is required.';

  return errors;
};

export const validateEventForm = (values) => {
  const errors = {};
  if (!values.title?.trim()) errors.title = 'Event title is required.';
  if (!values.category?.trim()) errors.category = 'Event category is required.';
  if (!values.description?.trim()) errors.description = 'Description is required.';
  if (!values.venue?.trim()) errors.venue = 'Venue is required.';
  if (!values.startDateTime) errors.startDateTime = 'Start date and time are required.';
  if (!values.endDateTime) errors.endDateTime = 'End date and time are required.';

  if (values.startDateTime && values.endDateTime) {
    if (new Date(values.endDateTime) <= new Date(values.startDateTime)) {
      errors.endDateTime = 'End date and time must be after the start date and time.';
    }
  }

  return errors;
};

export const validateLogin = (username, password) => {
  if (!username.trim()) return 'Username or email is required.';
  if (!password.trim()) return 'Password is required.';
  return '';
};

export const validateRegister = (values) => {
  const errors = {};
  if (!values.name?.trim()) errors.name = 'Name is required.';

  if (!values.username?.trim()) {
    errors.username = 'Username is required.';
  } else if (!/^[a-zA-Z0-9._]{3,30}$/.test(values.username.trim())) {
    errors.username = 'Username must be 3-30 characters using only letters, numbers, dots or underscores.';
  }

  if (!values.email?.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
};
