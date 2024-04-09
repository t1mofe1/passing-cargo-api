export const getTimestamp = (date: Date) => {
  const year = date.getFullYear().toString().padStart(4, '0');
  const month = date.getMonth().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
};
