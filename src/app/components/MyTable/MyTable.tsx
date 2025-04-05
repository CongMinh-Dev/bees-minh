'use client'
import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Modal, Popconfirm, Table, Tooltip } from 'antd';
import type { TableColumnsType } from 'antd';
import moment from 'moment';
import CustomPagination from '../CustomPagination/CustomPagination';
import { http } from '@/app/services/config';
import InputCustom from '../Input/InputCustom';
import { useFormik } from 'formik';
import * as yup from 'yup'
import './myTable.css'
import { toast } from 'react-toastify';
import useReponsive from "../../hooks/useReponsive";

interface DataType {
  id: string
  name: string
  balance: number
  email: string
  registerAt: Date
  active: Boolean
}

interface LoadingType {
  setIsLoading: (value: boolean) => void;

}




const MyTable: React.FC<LoadingType> = ({ setIsLoading }) => {


  // pagination
  const [pageSize, setPageSize] = useState(10);
  const handlePageSizeChange = (value: any) => {
    setPageSize(value);
  };

  // Table
  ///// data
  const [data, setData] = useState<DataType[]>([])


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
  const { isMobile, isTablet } = useReponsive()
  // columns--- data filter email
  const emailArrayClone: string[] = []
  data?.forEach((item) => {
    const emailDomainClone = item.email.slice(item.email.indexOf("@"))
    if (emailArrayClone.indexOf(emailDomainClone) == -1) {
      emailArrayClone.push(emailDomainClone)
    }
  })
  const emailArray = emailArrayClone?.map((item) => {
    return {
      text: item,
      value: item,
    }
  }
  )

  // columns--- format column
  const columns: TableColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      showSorterTooltip: { target: 'full-header' },
      sorter: (a, b) => a.id.localeCompare(b.id),
      width: isTablet ? 65 : undefined
    },
    {
      title: 'Name',
      dataIndex: 'name',
      showSorterTooltip: { target: 'full-header' },
      sorter: (a, b) => a.name.localeCompare(b.name),
      width: isMobile ? 82 : undefined

    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      showSorterTooltip: { target: 'full-header' },
      sorter: (a, b) => a.balance - b.balance,
      render: (balance) => `$${balance}`,
      width: isTablet ? 100 : undefined
    },
    {
      title: 'Email',
      dataIndex: 'email',
      showSorterTooltip: { target: 'full-header' },
      sorter: (a, b) => a.email.localeCompare(b.email),
      filters: emailArray,
      onFilter: (value, record) => {

        return record.email.indexOf(value as string) >= 0
      },
      width: isTablet ? 200 : undefined,
      render: (text) => <a href='#' target='_blank' className='text-blue-400 hover:text-blue-700' >{text}</a>,
    },
    {
      title: 'RegisterAt',
      dataIndex: 'registerAt',
      showSorterTooltip: { target: 'full-header' },
      sorter: (a, b) => moment(a.registerAt).diff(moment(b.registerAt)),
      render: (ngay) => (
        <Tooltip title={moment.utc(ngay).format('HH:mm:ss')}>
          {moment(ngay).format('yyyy/MM/DD')}
        </Tooltip>
      ),
      width: isTablet ? 110 : undefined
    },
    {
      title: 'active',
      dataIndex: 'active',
      render: (_, record) => (
        <span>
          <Button size="small" className='mr-2 bg-blue-500 text-white  duration-500 border border-blue-500 '
            onClick={() => {
              handelEditUser(record.id)
              setIsModalOpen(true)
            }
            }
          >
            <i className="fa-solid fa-gear"></i>
          </Button>

          <Popconfirm title="Do you want delete?"
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
            <Button size="small" className='mr-2 bg-red-500 text-white  duration-500 border border-red-500' >
              <i className="fa-solid fa-trash"></i>
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];


  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);



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
  // Search 
  const [valueSearch, setValueSearch] = useState<string>()
  const handleSearch = () => {
    setIsLoading(true)
    http.get(`/todos?name=${valueSearch}`).then((res) => {
      setData(res.data)
      setIsLoading(false)

    }).catch((err) => {
      console.log(err)
      setIsLoading(false)

    })
  }




  useEffect(() => {
    renderData()
  }, [])


  return (
    <>
      {isMobile ? <div>
        {/* <768 */}
        {/* search  */}
        <div className='flex w-[155px] justify-start items-center my_search my-2'>
          <Input name='' type='' value={valueSearch} className='w-[95%]   h-[38px] bg-gray-200' placeholder='Enter name'
            onChange={(e) => {
              setValueSearch(e.target.value)
            }}
            onPressEnter={handleSearch}
          />

          <button className="bg-blue-500 hover:bg-blue-800 border rounded-[10px] border-blue-500 py-[8px] px-5 ml-1 duration-500"
            onClick={handleSearch}
          ><i className="fa-solid fa-magnifying-glass"></i></button>

        </div>

        <div className="mobile_user flex flex-wrap">
          {/* card */}
          {data?.map((item) => (
            <Card
              className="card_user"
              title={<h5 className="uppercase">{item.name}</h5>}

            >
              {/* id */}
              <div>
                <span className="nameCard">ID:</span>
                <span className="contentCard font-bold">
                  {item.id}
                </span>
              </div>
              {/* balance */}
              <div>
                <span className="nameCard mr-2">Balance:</span>
                <span className="contentCard font-bold">
                  {item.balance}
                </span>
              </div>
              {/* email */}
              <div>
                <span className="nameCard mr-2">Email:</span>
                <span className="contentCard font-bold"> <a href="#" className='text-blue-400 hover:text-blue-700'>{item.email}</a></span>
              </div>
              {/* registerAt */}
              <div>
                <span className="nameCard">RegisterAt:</span>
                <span className="contentCard font-bold">
                  {<Tooltip title={moment.utc(item.registerAt).format('HH:mm:ss')}>
                    {moment(item.registerAt).format('yyyy/MM/DD')}
                  </Tooltip>}
                </span>
              </div>
              {/* active */}
              <div>
                <span className="nameCard">Active:</span>
                <span className="contentCard font-bold">
                  {/* active---buttion edit */}
                  <Button size="small" className='mr-2 bg-blue-500 text-white  duration-500 border border-blue-500 '
                    onClick={() => {
                      handelEditUser(item.id)
                      setIsModalOpen(true)
                    }
                    }
                  >
                    <i className="fa-solid fa-gear"></i>
                  </Button>

                  <Popconfirm title="Do you want delete?"
                  onConfirm={() => {
                    setIsLoading(true)
                    http.delete(`/todos/${item.id}`).then(() => {
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
                    <Button size="small" className='mr-2 bg-red-500 text-white  duration-500 border border-red-500' >
                      <i className="fa-solid fa-trash"></i>
                    </Button>
                  </Popconfirm>




                </span>
              </div>
            </Card>
          ))}

          {/* Modal */}
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



      </div> : <div className='my_table relative' >
        {/* >768 */}
        {/* search  */}
        <div className='flex w-[200px] justify-start items-center my_search my-2'>
          <Input name='' type='' value={valueSearch} className='w-[95%]   h-[38px] bg-gray-200' placeholder='Enter name'
            onChange={(e) => {
              setValueSearch(e.target.value)
            }}
            onPressEnter={handleSearch}
          />

          <button className="bg-blue-500 hover:bg-blue-800 border rounded-[10px] border-blue-500 py-[8px] px-5 ml-1 duration-500"
            onClick={handleSearch}
          ><i className="fa-solid fa-magnifying-glass"></i></button>


        </div>


        {/* Table */}
        <Table<DataType>
          columns={columns}
          dataSource={data}
          showSorterTooltip={{ target: 'sorter-icon' }}
          pagination={{
            pageSize: pageSize,
            showSizeChanger: false, //hiển thị ô thay đổi dòng trên trang
          }}
          virtual scroll={{ y: 560 }}
        />
        {/* Pagination */}
        <CustomPagination
          handleSetPage={handlePageSizeChange}  // truyền xuống combonent con để nó thay đổi state(page) ở MyTable
        />


        {/* Modal */}
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


      </div>}
    </>


  );
}

export default MyTable;