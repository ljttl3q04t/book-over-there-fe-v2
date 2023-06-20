import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';

const Loading = () => {
    return <div
        style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        <Spin size='large' indicator={<LoadingOutlined />} />
    </div>
};

export default Loading;
