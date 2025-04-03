export default  async function processWithDelay(numbers: number[], delayTime: number): Promise<void> {

    if (!Array.isArray(numbers)) {
        return Promise.reject(new Error("First Argument must be array"));
    }

    if (numbers.some(isNaN)) {
        return Promise.reject(new Error("First Argument must be a number array."));
    }
    if (numbers.length === 0) {
        return Promise.resolve();
        
    }



    if ( delayTime==0||typeof delayTime !== 'number' || delayTime < 0) {
        return Promise.reject(new Error(" Seccond Argument must be > 0"));
        
    }
    if ( !delayTime) {
        return Promise.reject(new Error("Missing seccond Argument"));
        
    }
   

    return new Promise<void>((resolve:any) => { 
        let b = 0;
        const intervalId = setInterval(() => {
            if (b < numbers.length) {
                console.log(numbers[b++]);
            } else {
                clearInterval(intervalId);
                resolve({message:"Done"}); 
            }
        }, delayTime*1000);
    });
}
