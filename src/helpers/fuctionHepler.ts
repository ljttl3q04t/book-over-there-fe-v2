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