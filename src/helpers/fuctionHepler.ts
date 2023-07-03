export const getDeviceType = () => {
  const isMobile = window.matchMedia('(max-width: 464px)').matches;
  const isTablet = window.matchMedia('(min-width: 464px) and (max-width: 1024px)').matches;
  const isdesktop1 = window.matchMedia('(min-width: 1024px) and (max-width: 1550px)').matches;
  if (isMobile) {
    return 'mobile';
  } else if (isTablet) {
    return 'tablet';
  } else if (isdesktop1) {
    return 'desktop1';
  } else {
    return 'desktop';
  }
};

export const getObjectByIdInArray = (array: any, id: any) => {
  return array.find((obj: any) => obj.id === id);
} 

/**
 * The debounce function takes a callback function and a delay time, and returns a new function that
 * delays the execution of the callback until the delay time has passed, ensuring that the callback is
 * only called once within that time period.
 * @param {Function} callback - The `callback` parameter is a function that will be executed after the
 * specified delay.
 * @param {number} delay - The `delay` parameter is the amount of time in milliseconds that the
 * `callback` function should be delayed before being executed.
 * @returns The debounce function returns a new function that will execute the provided callback
 * function after a specified delay.
 */
export const debounce = (callback: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback.apply(null, args);
    }, delay);
  };
};

export const formatDate = (dateString:string, format: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  let formattedDate = format.replace("yyyy", year);
  formattedDate = formattedDate.replace("mm", month);
  formattedDate = formattedDate.replace("dd", day);
  formattedDate = formattedDate.replace("hh", hours);
  formattedDate = formattedDate.replace("ss", seconds);

  return formattedDate;
}