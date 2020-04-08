import { getMinutes, getHours, getSeconds } from 'date-fns';

export const timeToMinutes = (str) => {
  const timeArr = str.split(':');
  return parseInt(timeArr[0], 10) * 60 + parseInt(timeArr[1], 10);
};

export const minutesToString = (totalMinutes) => {
  let hours = Math.floor(totalMinutes / 60) || 0;
  hours = hours > 10 ? hours : `0${hours}`;
  let minutes = totalMinutes % 60 || 0;
  minutes = minutes > 10 ? minutes : `0${minutes}`;
  return `${hours}:${minutes}`;
};

export const datetimeToMinutes = (datetime) => getHours(new Date(datetime.replace(' ', 'T'))) * 60
  + getMinutes(new Date(datetime));

export const datetimeToSeconds = (datetime) => getHours(new Date(datetime.replace(' ', 'T'))) * 60 * 60
  + getMinutes(new Date(datetime)) * 60 + getSeconds(new Date(datetime));

export const getColorByStatus = (status) => {
  let color = '';
  switch (status) {
    case 'Approved':
    case 'work':
      color = '#009FFF';
      break;
    case 'Pending':
    case 'break':
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

export const getInfoCardColors = (type) => {
  let theme = {};
  switch (type) {
    case 'total':
      theme = {
        text: '#0085ff',
        background: '#ecf3f9',
      };
      break;
    case 'break':
      theme = {
        text: '#ff9d00',
        background: 'rgba(253, 176, 51, 0.21)',
      };
      break;
    default:
      theme = {
        text: '#0085ff',
        background: '#ecf3f9',
      };
  }

  return theme;
};

export const makeQueryString = (queryObj) => Object.keys(queryObj)
  .filter((item) => typeof queryObj[item] !== 'undefined' && queryObj[item].toString().length)
  .map((key) => `${key}=${queryObj[key]}`).join('&');
