'use client';

import { ToastContainer } from "react-toastify";
import MyTable from "./components/MyTable/MyTable";
import { ConfigProvider, theme, Button } from "antd";
import { useState } from "react";
import Link from "next/link";
import Loading from "./components/Loading/Loading";
import useReponsive from "./hooks/useReponsive";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode); 
  };

  // Loading
  const [isLoading, setIsLoading] = useState(true); 
  const handleSetIsLoading = (isloading2: boolean) => {
    setIsLoading(isloading2)
  }
  const { isMobile } = useReponsive()
  return (
    <ConfigProvider theme={{
      algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    }}>
      <main className={`${isDarkMode ? "bg-gray-950" : "bg-[rgba(249, 251, 252, 1)]"}  ${!isMobile ? "h-[100vh]" : ""} px-[10px] `}>
        {/* toast */}
        <ToastContainer autoClose={2000} />

        {/* button header */}
        {/* mobile */}
        {isMobile ? <div className={` ${isDarkMode ? "bg-gray-950" : "bg-white"}  bg_mobile_mode`}>
          <div className="flex justify-end  my_mobile_mode">
            <Link href={"/func"}>
              <Button className="my-3 mr-3 bg-slate-400 text-white ">
                Logic Test
              </Button>
            </Link>
            <Button onClick={toggleDarkMode} className="my-3  mr-3 bg-slate-400  text-white">
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </Button>
          </div>
        </div> : <div className="flex justify-end  my_mode">
          {/* >768 */}
          <Link href={"/func"}>
            <Button className="my-3 mr-3 bg-slate-400 text-white ">
              Logic Test
            </Button>
          </Link>
          <Button onClick={toggleDarkMode} className="my-3  mr-3 bg-slate-400  text-white">
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>}


        {/* table */}
        <MyTable setIsLoading={handleSetIsLoading} />

        {/* loading */}
        <Loading isloading={isLoading} />
      </main>
    </ConfigProvider>
  );
}