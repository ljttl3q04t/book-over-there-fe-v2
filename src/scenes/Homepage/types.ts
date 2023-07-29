export type DataTypeClubSlide = {
  clubName: string;
  clubId: number;
  clubBookIds: number[];
  clubBookInfor: DataTypeClubBook[];
  clubCode: string;
};

export type DataTypeClubBook = {
  no: number;
  bookName: string;
  categoryName: string;
  authorName: string;
  publisherName: string;
  image: string;
  club: string;
  totalCopyCount: number;
};
