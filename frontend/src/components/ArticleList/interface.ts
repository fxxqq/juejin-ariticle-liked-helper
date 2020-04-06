import { SpinProps } from 'antd/es/spin';
export interface Article {
  title: string;
  author: string;
  objectId: string;
  type: string;
  tags: any[];
  collectionCount: number;
  viewsCount: number;
  createdAt: string;
  description: string,
  originalUrl: string,
  filteredValue: Object | undefined
}

export interface State {
  likeList: any[];
  pagination: any;
  searchText: string,
  searchedColumn: string,
  loading: boolean | SpinProps | undefined,
  scroll: undefined,
  filteredInfo: null | string[]
};
interface SearchFunc {
  (value: any[]): any[];
}
export interface filterDropdownType {
  setSelectedKeys: SearchFunc;
  selectedKeys: string;
  confirm: () => void,
  clearFilters: unknown,
};

export interface Props {
  id: string | undefined,
};