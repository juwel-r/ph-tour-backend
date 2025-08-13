import { envVar } from "../config/env";

export const sslPaymentUrl = (urlType: string, transactionId:string, amount:number): string => {
  const status = urlType.toLowerCase().split(/_backend|_frontend/)[0]
  
  const url: string =
    (envVar.SSL as Record<string, string>)[`SSL_${urlType}_URL`] +
    `?transactionId=${transactionId}&amount=${amount}&status=${status}`;
  return url;
};
