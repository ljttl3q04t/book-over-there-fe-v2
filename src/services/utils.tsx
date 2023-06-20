export const globalConstant = {
    pageSize: 10,
    statusDefault: 1,
    dateFormat: "DD-MM-YYYY",
};

export const defaultPagination = {
    pageSize: globalConstant.pageSize,
    currentPage: 1,
};

export function getRowNumber(pageIndex:any, pageSize:any, index:any) {
    return (pageIndex - 1) * pageSize + index + 1;
}