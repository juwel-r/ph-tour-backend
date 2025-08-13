import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PaymentService } from "./payment.service";
import { sslPaymentUrl } from "../../utils/sslPaymentUrl";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const { bookingId } = req.params;

  const result = await PaymentService.initPayment(bookingId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Payment URL Generate successful.",
    data: result,
  });
});

const successPayment = catchAsync(async (req: Request, res: Response) => {
  const transactionId = req.query.transactionId as string;
  const amount = Number(req.query.amount);
  const result = await PaymentService.successPayment(transactionId);
  if (result.success) {
    res.redirect(sslPaymentUrl("SUCCESS_FRONTEND", transactionId, amount));
  }
});

const failedPayment = catchAsync(async (req: Request, res: Response) => {
  const transactionId = req.query.transactionId as string;
  const amount = Number(req.query.amount);
  const result = await PaymentService.failedPayment(transactionId);
  if (!result.success) {
    res.redirect(sslPaymentUrl("FAILED_FRONTEND", transactionId, amount));
  }
});

const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const transactionId = req.query.transactionId as string;
  const amount = Number(req.query.amount);
  const result = await PaymentService.cancelPayment(transactionId);
  if (!result.success) {
    res.redirect(sslPaymentUrl("CANCEL_FRONTEND", transactionId, amount));
  }
});

export const PaymentController = {
  initPayment,
  successPayment,
  failedPayment,
  cancelPayment,
};
