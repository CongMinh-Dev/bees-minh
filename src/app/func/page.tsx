import processWithDelay from "../components/Count/Count";

export default function page() {
 



    processWithDelay([10,20], 1)
        .then((result:any) => {
            console.log(result.message);
        })
        .catch((error) => console.error("Lỗi:", error.message));




    return <div>
        helo
    </div>


}
