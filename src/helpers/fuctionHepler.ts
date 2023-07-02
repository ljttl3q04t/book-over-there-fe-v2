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

export const createFileFromImageLink = async (imageLink: string, fileName: string) => {
  try {
    const response = await fetch(imageLink);
    const blob = await response.blob();
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  } catch (error) {
    console.error("Lỗi khi tạo File từ liên kết hình ảnh:", error);
    throw error;
  }
}