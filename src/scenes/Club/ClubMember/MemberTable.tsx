import React, { useEffect, useState } from "react";
import Table, { ColumnsType } from "antd/es/table";
import dfbServices from "@/services/dfb";
import { MemberInfos } from "@/services/types";

type DataType = {
  fullName: string;
  code: string;
  phoneNumber: string;
};

export function MemberTable() {
  const [loading, setLoading] = useState(false);
  const [memberIds, setMemberIds] = useState<number[]>([]);
  const [tableData, setTableData] = useState<DataType[]>([]);

  const fetchMemberIds = async () => {
    try {
      setLoading(true);
      const _memberIds = await dfbServices.getMemberIds();
      setMemberIds(_memberIds);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchMemberInfos = async () => {
    try {
      setLoading(true);
      const memberInfos: MemberInfos[] = await dfbServices.getMemberInfos(memberIds);
      const data: DataType[] = [];
      for (const member of memberInfos) {
        data.push({
          fullName: member.full_name,
          code: member.code,
          phoneNumber: member.phone_number,
        });
      }
      setTableData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberIds();
  }, []);

  useEffect(() => {
    if (memberIds.length > 0) {
      fetchMemberInfos();
    }
  }, [memberIds]);

  const columns: ColumnsType<DataType> = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
  ];
  return <Table loading={loading} columns={columns} dataSource={tableData}></Table>;
}
