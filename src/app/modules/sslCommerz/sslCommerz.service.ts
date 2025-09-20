import axios from "axios";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { ISSLCommerz } from "./sslCommerz.interface";
import { envVar } from "../../config/env.config";
import { sslPaymentUrl } from "../../utils/sslPaymentUrl";

const sslPaymentInit = async (payload: ISSLCommerz) => {
  const { amount, name, email, address, phone, transactionId } = payload;

  try {
    const data = {
      store_id: envVar.SSL.SSL_STORE_ID,
      store_passwd: envVar.SSL.SSL_STORE_PASS,
      total_amount: amount,
      currency: "BDT",
      tran_id: transactionId,
      success_url: sslPaymentUrl("SUCCESS_BACKEND", transactionId, amount),
      fail_url: sslPaymentUrl("FAILED_BACKEND", transactionId, amount),
      cancel_url: sslPaymentUrl("CANCEL_BACKEND", transactionId, amount),
      // ipn_url: "http://localhost:3030/ipn",
      shipping_method: "N/A",
      product_name: "Tour",
      product_category: "Service",
      product_profile: "General",
      cus_name: name,
      cus_email: email,
      cus_add1: address,
      cus_add2: "N/A",
      cus_city: "Dhaka",
      cus_state: "N/A",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: phone,
      cus_fax: "N/A",
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: "N/A",
      ship_country: "N/A",
    };

    const response = await axios({
      method: "POST",
      url: envVar.SSL.SSL_PAYMENT_API,
      data: data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response.data;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

export const SSLService = {
  sslPaymentInit,
};
