/* eslint-disable no-undef */
export default {
  api: {
    url: process.env.REACT_APP_BACKEND_URL || 'https://app.grownu.com/api',
  },
  pusher: {
    key: process.env.REACT_PUSHER_APP_KEY || 'app-key',
  },
  google: {
    key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyDK6gV-4vYoIcst1DlL2cmeDhslD6L0vj4',
  },
};
