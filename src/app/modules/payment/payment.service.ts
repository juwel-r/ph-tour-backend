/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { cloudinaryBufferUpload } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import { IInvoiceData } from "../../interfaces";
import { sendEmail } from "../../utils/emailSender";
import { generatePDF } from "../../utils/invoice.pdf";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { ITour } from "../tour/tour.interface";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { IPayment, PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import httpStatus from "http-status-codes";

const initPayment = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId);
  const payment = await Payment.findOne({ booking: booking?._id });
  const user = await User.findById(booking?.user).select(
    "name email phone address"
  );

  if (!booking || !payment || !user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Payment Not Found. You have not booked this tour"
    );
  }

  if (
    booking.status !== BOOKING_STATUS.COMPLETE ||
    payment.status !== PAYMENT_STATUS.PAID
  ) {
    const { name, email, phone, address } = user;

    const sslPayload: ISSLCommerz = {
      name,
      email,
      phone: phone!,
      address: address!,
      transactionId: payment.transactionId,
      amount: payment.amount,
    };

    const sslPayment = await SSLService.sslPaymentInit(sslPayload);
    return { paymentURL: sslPayment.GatewayPageURL };
  } else {
    throw new AppError(httpStatus.FORBIDDEN, "This booking already paid");
  }
};

const successPayment = async (transactionId: string) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const payment = await Payment.findOneAndUpdate(
      { transactionId },
      { status: PAYMENT_STATUS.PAID },
      { new: true, session }
    );

    const updateBooking = await Booking.findByIdAndUpdate(
      payment?.booking,
      { status: BOOKING_STATUS.COMPLETE },
      { new: true, session }
    )
      .populate("user", "name email")
      .populate("tour", "title")
      .populate("payment", "amount");
    if (!updateBooking) {
      throw new AppError(404, "Booking not found");
    }

    const invoiceData: IInvoiceData = {
      transactionId: transactionId,
      bookingDate: updateBooking.createdAt as Date,
      customerName: (updateBooking.user as unknown as IUser).name,
      tourTitle: (updateBooking.tour as unknown as ITour).title,
      guestCount: updateBooking.guestCount,
      totalCost: (updateBooking.payment as unknown as IPayment).amount!,
    };

    const pdfBuffer = await generatePDF(invoiceData);
    const fileName = `invoice for ${invoiceData.tourTitle}.pdf`;

    const cloudinaryPdfUpload = await cloudinaryBufferUpload(
      pdfBuffer,
      fileName
    );

    if (!cloudinaryPdfUpload) {
      throw new AppError(404, "PDF not found.");
    }

    //update invoice ulr
    await Payment.updateOne(
      { transactionId },
      { invoiceUrl: cloudinaryPdfUpload.secure_url },
      { session }
    );

    await sendEmail({
      to: (updateBooking.user as unknown as IUser).email,
      subject: `Booking invoice for ${invoiceData.tourTitle}`,
      templateName: "bookingInvoice",
      templateData: {
        name: invoiceData.customerName,
        tourName: invoiceData.tourTitle,
        totalGuest: invoiceData.guestCount,
        totalCost: invoiceData.totalCost,
      },
      attachments: [
        {
          filename: fileName,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });
    
    await session.commitTransaction();
    session.endSession();
    return { success: true, message: "Payment Successful" };
  } catch (error: any) {
    throw new Error(error);
  }
};

const failedPayment = async (transactionId: string) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const payment = await Payment.findOneAndUpdate(
      { transactionId },
      { status: PAYMENT_STATUS.FAILED },
      { new: true, session }
    );

    await Booking.findByIdAndUpdate(
      payment?.booking,
      { status: BOOKING_STATUS.FAILED },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return { success: false, message: "Payment Failed" };
  } catch (error: any) {
    throw new Error(error);
  }
};

const cancelPayment = async (transactionId: string) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const payment = await Payment.findOneAndUpdate(
      { transactionId },
      { status: PAYMENT_STATUS.CANCELLED },
      { runValidators: true, session }
    );

    await Booking.findByIdAndUpdate(
      payment?.booking,
      { status: BOOKING_STATUS.CANCEL },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return { success: false, message: "Payment Cancelled" };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const PaymentService = {
  initPayment,
  successPayment,
  failedPayment,
  cancelPayment,
};
