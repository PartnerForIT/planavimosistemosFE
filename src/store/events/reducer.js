import {
  GET_EVENTS_LIST,
  GET_EVENTS_LIST_SUCCESS,
  GET_EVENTS_LIST_ERROR,
  EVENT_VIEWED,
} from './types';

// function randomInteger(min, max) {
//   // получить случайное число от (min-0.5) до (max+0.5)
//   let rand = min - 0.5 + Math.random() * (max - min + 1);
//   return Math.round(rand);
// }
//
// const mockItem = () => ({
//   group: {
//     name: 'group 2',
//   },
//   employee: {
//     name: `employee - ${randomInteger(0, 20)}`,
//   },
//   place: {
//     name: 'place 2',
//   },
//   type: randomInteger(1, 10),
//   reason: 'Vacation Request',
//   total: {
//     week: randomInteger(0, 20),
//     month: randomInteger(0, 20),
//     total: randomInteger(0, 20),
//   },
// });
// const mockData = [
//   {
//     id: 1,
//     timestamp: '2021-05-29 16:06:36',
//     seen: 0,
//     ...mockItem(),
//   },
//   {
//     id: 2,
//     timestamp: '2021-05-29 16:06:36',
//     seen: 1,
//     ...mockItem(),
//   },
//   {
//     id: 3,
//     timestamp: '2021-03-19 10:06:36',
//     seen: 1,
//     ...mockItem(),
//   },
//   {
//     id: 4,
//     timestamp: '2021-04-19 16:06:36',
//     seen: 0,
//     ...mockItem(),
//   },
//   {
//     id: 5,
//     timestamp: '2021-03-19 15:06:36',
//     seen: 0,
//     ...mockItem(),
//   },
//   {
//     id: 6,
//     timestamp: '2021-03-19 16:06:36',
//     seen: 1,
//     ...mockItem(),
//   },
// ];
const initialState = {
  loading: false,
  error: null,
  events: [],
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EVENTS_LIST:
      return { ...state, error: null, loading: true };

    case GET_EVENTS_LIST_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        events: action.data,
      };

    case EVENT_VIEWED: {
      const foundIndex = state.events.findIndex((item) => item.id === action.data.id);
      return {
        ...state,
        error: null,
        loading: false,
        events: [
          ...state.events.slice(0, foundIndex),
          {
            ...state.events[foundIndex],
            seen: 1,
          },
          ...state.events.slice(foundIndex + 1),
        ],
      };
    }

    case GET_EVENTS_LIST_ERROR:
      return {
        ...state,
        loading: false,
      };

    default: return state;
  }
};

export default reducer;
