'use client';

import { ToastContainer } from "react-toastify";
import MyTable from "./components/MyTable/MyTable";
import { ConfigProvider, theme, Button } from "antd";
import { useState } from "react";
import Link from "next/link";
import Loading from "./components/Loading/Loading";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false); // State lưu trữ chế độ

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode); // Hàm chuyển đổi chế độ
  };

  // Loading
  const [isLoading, setIsLoading] = useState(true); // State lưu trữ chế độ
  const handleSetIsLoading = (isloading2: boolean) => {
    setIsLoading(isloading2)
  }


  return (
    <ConfigProvider theme={{
      algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    }}>
      <main className={`${isDarkMode ? "bg-gray-950" : "bg-[rgba(249, 251, 252, 1)]"} h-[100vh]  mx-[10px] `}>
        <ToastContainer autoClose={2000} />

        <div className="flex justify-end  my_mode">
          <Link href={"/func"}>
            <Button className="my-3 mr-3 bg-slate-400 text-white ">
              Logic Test
            </Button>
          </Link>

          <Button onClick={toggleDarkMode} className="my-3  mr-3 bg-slate-400  text-white">
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>

        <MyTable setIsLoading={handleSetIsLoading} />
        <Loading isloading={isLoading} />

      </main>
    </ConfigProvider>
  );
}