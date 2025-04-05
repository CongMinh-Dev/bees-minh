// 'use client'
import {  Input, Form } from 'antd';
import { useState } from 'react';
import "./customPagination.css"

import { UpOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';

interface CustomPaginationProps {
    handleSetPage: (value: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({ handleSetPage }) => {

    const [valueInput, setValueInput] = useState(10);
    const handleInputChange = (event: any) => {
        setValueInput(event.target.value)

    };
    const handleSetPageE = (e: any) => {
        handleSetPage(e.target.value);

    }




    const items: MenuProps['items'] = [
        {
            key: '1',
            label: '10/page',
            onClick: () => {
                handleSetPage(10)
                setValueInput(10)
            }

        },
        {
            key: '2',
            label: '20/page',
            onClick: () => {
                handleSetPage(20)
                setValueInput(20)
            }

        },
        {
            key: '3',
            label: '50/page',
            onClick: () => {
                handleSetPage(50)
                setValueInput(50)
              
            }

        },
        {
            key: '4',
            label: '100/page',
            onClick: () => {
                handleSetPage(100)
                setValueInput(100)

            }

        },
    ];

    return (
        <Form layout="inline" className='custom_pagination'>
            <Form.Item >
                <Dropdown className='my_dropdown' menu={{ items }} placement='top'  >
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            Choose page
                            <UpOutlined />
                        </Space>
                    </a>
                </Dropdown>
                <Input
                    type="number"
                    // value={customPageSize}
                    value={valueInput}
                    onPressEnter={handleSetPageE}
                    onChange={handleInputChange}

                />

                <p >/page</p>


            </Form.Item>



        </Form >
    );
};

export default CustomPagination;