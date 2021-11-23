import { getMinutes, getHours, getSeconds } from 'date-fns';
import Resizer from 'react-image-file-resizer';

// export const dateToUCT = (date) => (new Date(`${date}Z`.replace(' ', 'T')));
export const dateToUCT = (date) => (new Date(date.replace(/-/g, '/').replace('T', ' ').replace(/\..*|\+.*/, '')));

export const timeToHours = (str) => {
  if (!str) {
    return 0;
  }

  const [hours, minutes] = str.split(':');

  return +hours + minutes / 60;
};

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

export const datetimeToMinutes = (datetime) => getHours(dateToUCT(datetime)) * 60
  + getMinutes(dateToUCT(datetime));

export const datetimeToSeconds = (datetime) => getHours(dateToUCT(datetime)) * 60 * 60
  + getMinutes(dateToUCT(datetime)) * 60
  + getSeconds(dateToUCT(datetime));

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

export const makeQueryString = (queryObj, withoutEmpty = true) => (withoutEmpty ? Object.keys(queryObj)
  .filter((item) => (queryObj[item] !== undefined && queryObj[item] !== null) && queryObj[item].toString().length)
  .map((key) => `${key}=${queryObj[key]}`).join('&') : Object.keys(queryObj)
  .map((key) => `${key}=${queryObj[key]}`).join('&'));

export const convertBase64 = (file) => new Promise((resolve, reject) => {
  const fileReader = new FileReader();
  fileReader.readAsDataURL(file);

  fileReader.onload = () => {
    resolve(fileReader.result);
  };

  fileReader.onerror = (error) => {
    reject(error);
  };
});

export const imageResize = (file) => new Promise((resolve) => {
  Resizer.imageFileResizer(
    file,
    120,
    120,
    'JPEG',
    100,
    0,
    resolve,
    'base64',
  );
});

export const onKeyDown = (e, func) => {
  if (e.key === 'Enter' || e.key === ' ') {
    func();
  }
};
