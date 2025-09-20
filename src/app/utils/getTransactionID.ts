export const getTransactionID = ()=>{
    return `tran_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}