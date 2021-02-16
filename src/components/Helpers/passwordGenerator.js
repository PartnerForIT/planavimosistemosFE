const passwordGenerator = ({
  length = 6,
  numbers = false,
  specialChars = false,
  uppercase = true,
}) => {
  const string = 'abcdefghijklmnopqrstuvwxyz'; // to upper
  const numeric = '0123456789';
  // eslint-disable-next-line no-useless-escape
  const specials = '!@#$%^&*()_+~`|}{[]\:;?><,./-=';
  let password = '';
  let character = '';
  while (password.length < length) {
    const entity1 = Math.ceil(string.length * Math.random() * Math.random());
    const entity2 = Math.ceil(numeric.length * Math.random() * Math.random());
    const entity3 = Math.ceil(specials.length * Math.random() * Math.random());
    let hold = string.charAt(entity1);
    // eslint-disable-next-line no-nested-ternary
    hold = uppercase ? (password.length % 2 === 0) ? (hold.toUpperCase()) : (hold) : (hold);
    character += hold;

    if (numbers) {
      character += numeric.charAt(entity2);
    }
    if (specialChars) {
      character += specials.charAt(entity3);
    }
    password = character;
  }
  password = password.split('')
    .sort(() => 0.5 - Math.random())
    .join('');

  return password.substr(0, length);
};

export default passwordGenerator;
