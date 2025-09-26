import moment from 'moment';
import 'moment/locale/id';
moment.locale('id');

// 12 years ago
export const timeFromNow = (date: string) => {
  return moment(date).fromNow();
};

// March 7, 2024
export const shortTime = (date: string) => {
  return moment(date).format('LL');
};

// March 7, 2024 9:24 AM
export const longTime = (date: string) => {
  return moment(date).format('LLL');
};
