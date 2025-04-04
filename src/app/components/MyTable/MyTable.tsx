'use client'
import React, { useEffect, useState } from 'react';
import { Button, Modal, Popconfirm, Table, Tooltip } from 'antd';
import type { TableColumnsType } from 'antd';
import moment from 'moment';
import CustomPagination from '../CustomPagination/CustomPagination';
import { http } from '@/app/services/config';
import InputCustom from '../Input/InputCustom';
import { useFormik } from 'formik';
import * as yup from 'yup'
import './myTable.css'
import { toast } from 'react-toastify';


interface DataType {
  id: string
  name: string
  balance: number
  email: string
  registerAt: Date
  active: Boolean
}

interface LoadingType {
  setIsLoading: (value:boolean) => void;
  
}




const MyTable: React.FC<LoadingType> = ({setIsLoading}) => {
 

  // pagination
  const [pageSize, setPageSize] = useState(10);
  const handlePageSizeChange = (value: any) => {
    setPageSize(value);
  };

  // Table
  ///// data
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
    setIsLoading(true)
    http.get("/todos")
      .then((res) => {
        setData(res.data)
        setIsLoading(false)



      })
      .catch((err) => {
        setIsLoading(false)
        console.log(err)
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
          {moment(ngay).format('yyyy/MM/DD')}
        </Tooltip>
      ),
    },
    {
      title: 'active',
      dataIndex: 'active',
      render: (_, record) => (
        <span>
          <Button size="small" style={{ marginRight: 8, backgroundColor: "blue", color: "white" }}
            onClick={() => {
              handelEditUser(record.id)
              setIsModalOpen(true)
            }
            }
          >
            Edit
          </Button>

          <Popconfirm title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => {
              setIsLoading(true)
              http.delete(`/todos/${record.id}`).then(() => {
                renderData()
                toast("Delete Success", {
                  className: 'bg-blue-300 text-white',
                })
              }
              ).catch((err) => {
                toast("Delete Fail", {
                  className: 'bg-red-300 text-white',
                })
                console.log(err)
                setIsLoading(false)
              }
              )
            }}
          >
            <Button size="small" danger style={{ backgroundColor: "red", color: "white" }}>
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];


  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // //edit 
  let [userDetail, setUserDetail] = useState<DataType>()
  let handelEditUser = async (userId: string) => {
    setIsLoading(true)
    http.get(`/todos/${userId}`)
      .then((res) => {
        setUserDetail(res.data)
        setIsLoading(false)
      })
      .catch((err) => {
        setIsLoading(false)
        console.log(err)
      }
      )
  }
  useEffect(() => {
    userDetail && setFieldValue("id", userDetail.id);
    userDetail && setFieldValue("name", userDetail.name);
    userDetail && setFieldValue("balance", userDetail.balance);
    userDetail && setFieldValue("email", userDetail.email);
    const registerAtString = moment(userDetail && userDetail.registerAt).format('yyyy/MM/DD')
    userDetail && setFieldValue("registerAt", registerAtString);
  }, [userDetail]);


  const { handleChange, handleSubmit, values, errors, handleBlur, touched, setFieldValue } = useFormik({
    initialValues: {
      id: "",
      name: "",
      balance: undefined,
      email: "",
      registerAt: "",
    },
    onSubmit: async (values) => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const formattedDateString = values.registerAt.replace(/\//g, '-');
      const combinedString = `${formattedDateString}T${hours}:${minutes}:${seconds}Z`;
      const date = new Date(combinedString);
      const utcString = date.toISOString();
      const itemClone = { ...values }
      itemClone.registerAt = utcString
      setIsLoading(true)
      http.put(`/todos/${itemClone.id}`, itemClone)
        .then(() => {
          setIsModalOpen(false)
          renderData()
          toast("Update Success", {
            className: 'bg-blue-300 text-white',
          })
        }
        ).catch((err) => {
          setIsLoading(false)
          toast("Update Fail", {
            className: 'bg-red-300 text-white',
          })
          console.log(err)
        }
        )
    },
    validationSchema: yup.object({
      id: yup.string().required("Please do not leave empty.")
      , name: yup.string().required("Please do not leave empty.")
      , balance: yup.number().required("Please do not leave empty.")
      , email: yup.string().email("Vui lòng kiểm tra định dạng email").required("Please do not leave empty.")
      , registerAt: yup.string().matches(/^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/, "Please enter the format YYYY/MM/DD").required("Please do not leave empty.")
    })


  })




  useEffect(() => {
    renderData()
  }, [])

  return (
    <div className='relative' >

      <Table<DataType>
        columns={columns}
        dataSource={data}
        showSorterTooltip={{ target: 'sorter-icon' }}
        pagination={{
          pageSize: pageSize,
          showSizeChanger: false, //hiển thị ô thay đổi dòng trên trang
          hideOnSinglePage: true,
        }}
        virtual scroll={{ y: 600 }}
      />
      <CustomPagination
        handleSetPage={handlePageSizeChange}  // truyền xuống combonent con để nó thay đổi state(page) ở MyTable
      />



      <Modal title="USER" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <form action="#" onSubmit={handleSubmit}>
          <div >
            <InputCustom
              placeholder="Please enter Id"
              id="id"
              label="ID"
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
              name="id"
              value={values.id}
              type='text'
              disabled={isDisabled}
            />
          </div>
          <div >
            <InputCustom
              placeholder="Please enter Name"
              id="name"
              label="Name"
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              touched={touched.name}
              name="name"
              value={values.name}
              type='text'
            />
          </div>
          <div >
            <InputCustom
              placeholder="Please enter Balance"
              id="balance"
              label="Balance"
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.balance}
              touched={touched.balance}
              name="balance"
              value={values.balance}
              type='number'
            />
          </div>
          <div >
            <InputCustom
              placeholder="Please enter Email"
              id="email"
              label="Email"
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
              name="email"
              value={values.email}
              type='text'
            />
          </div>
          <div >
            <InputCustom
              placeholder="Please enter RegisterAt"
              id="registerAt"
              label="RegisterAt"
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.registerAt}
              touched={touched.registerAt}
              name="registerAt"
              value={values.registerAt}
              type='text'
            />
          </div>

          {/* button */}
          <div>
            <button type="submit" className="w-full text-white bg-black border-black  hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-8 ">Update</button>
          </div>
        </form>
      </Modal>
      

    </div>

  );
}

export default MyTable;