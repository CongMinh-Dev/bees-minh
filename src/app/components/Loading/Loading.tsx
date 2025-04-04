import React from 'react';
import {  Spin } from 'antd';

interface PropsType{
    isloading:boolean
 }

const Loading: React.FC<PropsType> = ({isloading=false}) => (

    <div style={{ width: "100%", backgroundColor: "#e1e3e5", height: "100vh", position: "fixed", top: "0", left: "0", zIndex:"9999", 
    display:`${isloading==true?"block":"none"}`
    
    }}>
        <Spin tip="Loading..." size="large" className='absolute top-[50%] right-[50%] translate-x-[50%] translate-y-[50%]' >
        </Spin>
    </div>



);

export default Loading;