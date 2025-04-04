'use client';




let shouldStop= false;
export default function page() {
    


    function requestData() {
        return new Promise(resolve => setTimeout(() => resolve("Data"), 1000));
    }

    async function processData() {
        console.log("Bắt đầu xử lý");
        if (shouldStop) return "Đã dừng trước khi request";
        const data1 = await requestData();
        console.log("Nhận data 1:", data1);
        if (shouldStop) return "Đã dừng sau khi request 1";
        const data2 = await requestData();
        console.log("Nhận data 2:", data2);
        if (shouldStop) return "Đã dừng sau khi request 1";
        const data3 = await requestData();
        console.log("Nhận data 3:", data3);
        if (shouldStop) return "Đã dừng sau khi request 1";
        const data4 = await requestData();
        console.log("Nhận data 4:", data4);
        if (shouldStop) return "Đã dừng sau khi request 1";
        const data5 = await requestData();
        console.log("Nhận data 5:", data5);
        return "Hoàn thành xử lý";
    }

    // Gọi hàm async
    const processing = processData();

    // Sau một khoảng thời gian, quyết định dừng
    let stop = () => {
        setTimeout(() => {
            shouldStop=true;
            console.log(" dừng");
        }, 1);
    }

    processing.then(result => console.log("Kết quả:", result));

    return (
        <div>
            <button onClick={() => {
                stop()
            }
            } >demo</button>
        </div>
    )
}
