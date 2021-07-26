const passwordValidator = ({
  password = '', minLength = 1, numbers = false, specialChars = false, uppercase = false,
}) => {
  if (password.length) {
    if (minLength && password.length < minLength) {
      return {
        password: { message: `Passwords must be at least ${minLength} characters long.` },
      };
    } if (numbers && !password.match(/[0-9]/g)) {
      return {
        password: { message: 'Your password must contain at least one number digit.' },
      };
      // eslint-disable-next-line no-useless-escape
    } if (specialChars && !password.match(/[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/g)) {
      return {
        password: { message: 'Your password must contain at least one special character.' },
      };
    } if (uppercase && !password.match(/[A-Z]/g)) {
      return {
        password: { message: 'Password must contain at least one uppercase, or capital, letter.' },
      };
    }
    return {
      password: {},
    };
  }
  return {
    password: {},
  };
};

export default passwordValidator;
