export const validateName = (value) => {
  if (typeof value !== 'string') {
    return 'Name must be a string';
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return 'Name is required';
  }

  if (trimmedValue.length < 3) {
    return 'At least 3 characters';
  }

  const namePattern = /^[a-zA-Zа-щА-ЩЬьЮюЯяІіЇїЄєҐґ-]{3,20}$/;

  if (!namePattern.test(trimmedValue)) {
    return 'Name is not valid';
  }
};

export const validateEmail = (value) => {
  if (typeof value !== 'string') {
    return 'Email must be a string';
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return 'Email is required';
  }

  if (!trimmedValue) {
    return 'Email is required';
  }

  const emailPattern = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

  if (!emailPattern.test(trimmedValue)) {
    return 'Email is not valid';
  }
};

export const validatePassword = (value) => {
  if (typeof value !== 'string') {
    return 'Password must be a string';
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return 'Password is required';
  }

  if (trimmedValue.length < 6) {
    return 'At least 6 characters';
  }
};
