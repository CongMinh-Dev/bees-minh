'use client'
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Popconfirm, Table, Tooltip } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import moment from 'moment';
import CustomPagination from '../CustomPagination/CustomPagination';
import axios from 'axios';
import { http } from '@/app/services/config';
import InputCustom from '../Input/InputCustom';

interface DataType {
  id: string
  name: string
  balance: number
  email: string
  registerAt: Date
  active: Boolean
}

interface DataTypeMock {
  id: string
  name: string
  balance: number
  email: string
  registerAt: string
  active: Boolean
}





const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
};



const App: React.FC = () => {
  // pagination
  const [pageSize, setPageSize] = useState(10);
  const handlePageSizeChange = (value: any) => {
    setPageSize(value);
  };

  // Table
  // data
  const [data, setData] = useState<DataType[]>([])
  // let data2 = [
  //   {
  //     id: "A1",
  //     name: "Oliver Smith",
  //     balance: 5.749,
  //     email: "Oliver@gmail.com",
  //     registerAt: new Date('2024-09-21T23:59:59Z'),
  //     active: true
  //   }
  // ]

  const renderData = () => {
    http.get("/todos")
      .then((res) => {
        // console.log(res.data)
        let a: DataTypeMock[] = res.data
        let b:DataType[] = a.map((item) => {
          let emptyObject: DataType = {
            id: '',
            name: '',
            balance: 0,
            email: '',
            registerAt: new Date(0),
            active: false,
          };
          emptyObject.registerAt = new Date(item.registerAt);
          emptyObject.active=item.active
          emptyObject.id=item.id
          emptyObject.name=item.name
          emptyObject.balance=item.balance
          emptyObject.email=item.email
          return emptyObject
        }
        )
        setData(b)



      })
      .catch((err) => {
        console.log(err);
      });
  }

  // columns
  const columns: TableColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      showSorterTooltip: { target: 'full-header' },

      sorter: (a, b) => a.name.localeCompare(b.name),

    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      sorter: (a, b) => a.balance - b.balance,
      render: (balance) => `$${balance}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      filters: [
        {
          text: 'Joe',
          value: 'Joe',
        },
        {
          text: 'Jim',
          value: 'Jim',
        },
      ],
      onFilter: (value, record) => record.name.indexOf(value as string) === 0,
    },
    {
      title: 'RegisterAt',
      dataIndex: 'registerAt',
      sorter: (a, b) => moment(a.registerAt).diff(moment(b.registerAt)),
      render: (ngay) => (
        <Tooltip title={moment.utc(ngay).format('HH:mm:ss')}>
          {moment(ngay).format('DD/MM/YYYY')}
        </Tooltip>
      ),
    },
    {
      title: 'active',
      dataIndex: 'active',
      render: (text, record) => (
        <span>
          <Button size="small" style={{ marginRight: 8, backgroundColor: "blue", color: "white" }}
            onClick={() => {
              setIsModalOpen(true)
            }
            }
          >
            Chỉnh sửa
          </Button>

          <Popconfirm title="Bạn có chắc chắn muốn xóa?"
          // onConfirm={() => handleDelete(record.key)}
          >
            <Button size="small" danger style={{ backgroundColor: "red", color: "white" }}>
              Xóa
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];


  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  useEffect(() => {
    renderData()
  }, [])

  return (
    <>
      <Table<DataType>
        columns={columns}
        dataSource={data}
        onChange={onChange}
        showSorterTooltip={{ target: 'sorter-icon' }}
        pagination={{
          pageSize: pageSize,
          showSizeChanger: false,
          hideOnSinglePage: true,
        }}
      />
      <CustomPagination
        handleSetPage={handlePageSizeChange}
      />



      <Modal title="USER" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <InputCustom label='Name' name='name' type='text' />
        <InputCustom label='Balance' name='balance' type='number' />
        <InputCustom label='Email' name='email' type='text' />
        <InputCustom label='RegisterAt' name='registerAt' type='text' />
      </Modal>
    </>

  );
}

export default App;