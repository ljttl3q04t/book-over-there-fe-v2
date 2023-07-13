import { ColumnType } from "antd/es/table";
import { Button, Input, InputRef, Space, Tag, notification } from "antd";
import React, { useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import unorm from "unorm";

interface DataType {
  no: number;
  bookClubName: string;
  memberName: string;
  memberStatus: string;
  memberEmail: string;
  memberPhone: string;
  memberAvatar: string;
  createdAt: string;
  joinedAt: string;
  leaveAt: string;
  isStaff: boolean;
  memberId: number;
}
type DataIndex = keyof DataType;
// const searchInput = useRef<InputRef>(null);
// const [searchText, setSearchText] = useState("");
// const [searchedColumn, setSearchedColumn] = useState("");

// const handleReset = (clearFilters: () => void) => {
//   clearFilters();
//   setSearchText("");
// };

// const handleSearch = (
//   selectedKeys: string[],
//   confirm: (param?: FilterConfirmProps) => void,
//   dataIndex: DataIndex,
// ) => {
//   confirm();
//   setSearchText(selectedKeys[0]);
//   setSearchedColumn(dataIndex);
// };

export const getColumnSearchProps = (
  dataIndex: any,
  searchInput: any,
  searchText: any,
  setSearchText: any,
  searchedColumn: any,
  setSearchedColumn: any,
  handleReset: Function,
  handleSearch: Function,
): ColumnType<DataType> => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
    <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
      <Input
        ref={searchInput}
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
        style={{ marginBottom: 8, display: "block" }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button
          onClick={() => {
            clearFilters && handleReset(clearFilters);
            handleSearch(selectedKeys as string[], confirm, dataIndex);
          }}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
        {/* <Button
          type="link"
          size="small"
          onClick={() => {
            confirm({ closeDropdown: false });
            setSearchText((selectedKeys as string[])[0]);
            setSearchedColumn(dataIndex);
          }}
        >
          Filter
        </Button> */}
        <Button
          type="link"
          size="small"
          onClick={() => {
            close();
          }}
        >
          close
        </Button>
      </Space>
    </div>
  ),
  filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />,
  onFilter: (value, record: any) => {
    const normalizedValue = unorm.nfd(value).toLowerCase();
    const normalizedRecord = unorm.nfd(record[dataIndex].toString()).toLowerCase();
    return normalizedRecord.includes(normalizedValue);
  },
  onFilterDropdownOpenChange: (visible) => {
    if (visible) {
      setTimeout(() => searchInput.current?.select(), 100);
    }
  },
  render: (text) =>
    searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ""}
      />
    ) : (
      text
    ),
});
