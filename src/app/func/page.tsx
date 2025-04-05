'use client';
import {  useState } from "react";
import InputCustom from "../components/Input/InputCustom";
import Link from "next/link";
let isStopped = false

export default function Page() {
    const [data, setData] = useState("");
    const [textareaValue, setTextareaValue] = useState(" ");
    const [secondNumber, setSecondNumber] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    // const handleTextareaChange:React.ChangeEventHandler<HTMLInputElement> = (e) => {
    //     setTextareaValue(e.target.value);
    // };
    const handleSecondChange:React.ChangeEventHandler<HTMLInputElement>  = (e) => {
        setSecondNumber(Number(e.target.value));
    };



    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        isStopped = false
        setIsProcessing(true);
        setData("");
        console.log(textareaValue)
        let arrayNumber = textareaValue.split(",").map((item) => Number(item.trim()));
        if (textareaValue == " ") {
            arrayNumber = []
        }

        let dataString: string = ""

        // seccond
        const secondNumberClone = secondNumber * 1
        // run func
        processWithDelay(arrayNumber, secondNumberClone, (number: number) => {
            dataString += number.toString() + ","
            setData(dataString);

        })
            .then(() => {
                setData((prevData) => `${prevData} Done`);
                setIsProcessing(false);
            })
            .catch((error) => {
                console.error("Error:", error.message);
                setData(error.message);
                setIsProcessing(false);
                isStopped = false;

            });
    };

    // build func
    async function processWithDelay(
        numbersArray: number[],
        delayTime: number,
        onProcess: (number: number) => void,

    ): Promise<void> {
        if (!Array.isArray(numbersArray)) {
            return Promise.reject(new Error("First Argument must be Array"));
        }
        if (numbersArray.some(isNaN)) {
            return Promise.reject(new Error("First Argument must be a number array."));
        }
        if (numbersArray.length == 0) {
            return Promise.reject(new Error("Missing first Argument."));
        }
        if (delayTime == 0 || typeof delayTime !== 'number' || delayTime < 0) {
            return Promise.reject(new Error(" Seccond Argument must be > 0."));
        }
        if (!delayTime) {
            return Promise.reject(new Error("Missing seccond Argument"));
        }
        for (let i = 0; i < numbersArray.length; i++) {
            if (isStopped == false) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                onProcess(numbersArray[i]);
            } else { return }


        }

    }



    return (
        <div className="func">
            
                <Link href={"/"} className="flex ">
                    <button className="bg-blue-500 hover:bg-blue-800 border rounded-[10px] py-3 px-5 ml-auto mr-8 my-3 text-white duration-500">
                        Back
                    </button>
                </Link>

            


            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <div className="w-[50%] ">
                    <label htmlFor="textArea" className="w-full mt-4 font-bold cursor-pointer block">Please enter numbers. (example: 10,25,28,26) </label>
                    <textarea id="textArea" value={textareaValue} onChange={(e) => {
                      setTextareaValue(e.target.value);
                    }
                    } className="w-full h-[150px] bg-gray-100 border mt-4 p-3" />
                </div>

                <label htmlFor="second" className="mt-4 font-bold cursor-pointer ">Second Number To Delay (s) </label>
                <InputCustom id="second" name="second" type="number" value={secondNumber} onChange={handleSecondChange} />
                <div className="flex w-1/2 justify-center space-x-2 my-2">
                    <button type="submit" disabled={isProcessing} className={` ${isProcessing?"bg-blue-100":"hover:bg-blue-800  bg-blue-500" } border rounded-[10px] py-3 px-5 duration-500`}>
                        {isProcessing ? "In Processing..." : "Do"}
                    </button>
                    <button type="button" className="bg-red-600 hover:bg-red-800 border rounded-[10px] py-3 px-5 duration-500" onClick={
                        () => {
                            isStopped = true
                        }

                    }>Stop</button>

                </div>
                {/* out put */}
                <div className="w-[50%] ">
                    <label htmlFor="outPut" className="w-full mt-4 font-bold cursor-pointer block">Out Put Of Func ProcessWithDelay</label>
                    <textarea id="outPut" value={data} className="w-full h-[150px] bg-gray-100 border mt-4 p-3" disabled />
                </div>
            </form>





        </div>
    );
}

