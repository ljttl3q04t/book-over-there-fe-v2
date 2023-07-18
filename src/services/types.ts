export type Book = {
  name: string;
  category: {
    name: string;
  };
  author: {
    name: string;
  };
  publisher: {
    name: string;
  };
  image: string;
};

export type BookCopy = {
  id: number;
  book: Book;
  user: number;
  book_status: string;
};

export type ListView<T> = {
  count: number;
  results: T[];
};

export type BookClubInfo = {
  id: number;
  name: string;
  code: string;
};

export type BookClub = {
  id: number;
  is_member: boolean;
  updated_at: string;
  name: string;
  description: string;
  address: string;
  created_at: string;
};

export type Club = {
  book_club: BookClub;
  created_at: string;
  id: number;
  is_staff: boolean;
  joined_at: string;
  leaved_at: string;
  member_status: string;
  updated_at: string;
};

// D Free Book
export type CategoryInfos = {
  id: number;
  name: string;
};

export type AuthorInfos = {
  id: number;
  name: string;
};

export type BookInfos = {
  name: string;
  category: CategoryInfos | null;
  author: AuthorInfos | null;
  publisher: null;
  description: string | null;
  image: string | null;
};

export type ClubBookInfos = {
  id: number;
  book: BookInfos;
  code: string;
  club_id: number;
  init_count: number;
  current_count: number;
};

export type MemberInfos = {
  id: number;
  club_id: number;
  phone_number: string;
  full_name: string;
  code: string;
};

export type OrderDetails = {
  id: number;
  book_code: string;
  book_name: string;
  order_id: number;
  return_date: string;
  due_date: string;
  order_status: string;
  overdue_day_count: number | undefined;
};

export type OrderInfos = {
  id: number;
  member: MemberInfos;
  club_id: number;
  order_date: string;
  due_date: string;
  order_details: OrderDetails[];
};

export type CreateMemberRequest = {
  club_id: number;
  code: string;
  phone_number?: string;
  full_name: string;
};

export type UpdateMemberRequest = {
  member_id: number;
  code?: string;
  phone_number?: string;
  full_name?: string;
};

export type GetClubBookIdsOptions = {
  clubs?: BookClubInfo[];
};
