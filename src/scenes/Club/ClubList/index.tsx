import React, { useEffect, useState, useCallback } from 'react'
import Table, { ColumnsType } from "antd/es/table";
import dayjs from 'dayjs'
import { useDispatch } from 'react-redux';
import { getClubList } from '../../../store/clubStore';
import { ThunkDispatch } from "@reduxjs/toolkit";
import { Button } from 'antd';

const ClubList = () => {
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const [clubList, setClubList] = useState([]);

    const initFetch = useCallback(async () => {

        dispatch(getClubList())
            .then((response) => {
                if (response.payload) {
                    const data = response.payload.map((item: any, index: any) => {
                        return { no: index + 1, ...item };
                    });
                    setClubList(data);
                }
            })

    }, [dispatch]);

    useEffect(() => {
        initFetch()
    }, [])


    const columns: ColumnsType<any> = [
        {
            title: 'No',
            dataIndex: 'no',
            key: 'no',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Created At',
            key: 'created_at',
            dataIndex: 'created_at',
            render: (value: any) => { return dayjs(value).format('DD-MM-YYYY'); },
        },
        {
            title: 'Total member',
            key: 'total_member_count',
            dataIndex: 'total_member_count',
        },
        {
            title: 'Action',
            key: '',
            dataIndex: '',
            render: (values: any) => {
                return (<>
                    <Button type='primary' >Join Club</Button>
                </>)
            }
        }
    ];

    return (<>
        <Table columns={columns} dataSource={clubList} />
    </>)
}

export default ClubList