export const timeToMinutes = (str) => {
  const timeArr = str.split(':');
  return timeArr[0] * 60 + timeArr[1];
};

export const getColorByStatus = (status) => {
  let color = '';
  switch (status) {
    case 'Approved':
      color = '#009FFF';
      break;
    case 'Pending':
      color = '#FF9D00';
      break;
    case 'Suspended':
      color = '#F4373E';
      break;
    default:
      color = 'grey';
  }

  return color;
};
