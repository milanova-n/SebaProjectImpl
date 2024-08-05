export const validateEmail = (email, role) => {
const tumEmailRegex = /^[a-zA-Z0-9._%+-äöüÄÖÜ]+@tum\.de$/;
const emailRegex = /^[^\s@äöüÄÖÜ]+@[^\s@äöüÄÖÜ]+\.[^\s@äöüÄÖÜ]+$/;

  if (role === "student" && !tumEmailRegex.test(email)) {
    return "Invalid email: only @tum.de emails are allowed.";
  }
  if (!emailRegex.test(email)) {
    return "Invalid email format.";
  }
  return null;
};

export const validatePassword = (password) => {
  if (password.length < 8) {
    return "Password is too short";
  }
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

  if (
    !uppercaseRegex.test(password) ||
    !lowercaseRegex.test(password) ||
    !numberRegex.test(password) ||
    !specialCharRegex.test(password)
  ) {
    return "Password is too weak";
  }
  return null;
};

export const validateName = (name) => {
  const regex = /^[a-zA-ZäöüÄÖÜ]+$/;
  return regex.test(name);
};
