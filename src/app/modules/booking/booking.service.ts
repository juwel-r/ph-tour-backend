import AppError from "../../errorHelpers/AppError";
import { Tour } from "../tour/tour.model";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import httpStatusCodes from "http-status-codes";
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { getTransactionID } from "../../utils/getTransactionID";

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  /**
   * Some instruction about session
   *
   * Session is used rollback transaction purpose. if any error occurred while operation or middle of operation then previous operation will be removed, session normally run operation in virtually after complete full operation then it applied on Database. if found any error while operation running then abort previous actions
   *
   * if used session then must pass payload of .create() as array of object. not in update()
   *
   * session not work in local Mongodb it run always live server
   */
  const transactionId = getTransactionID();

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId);
    if (!user?.phone || !user?.address) {
      throw new AppError(
        httpStatusCodes.BAD_REQUEST,
        "Please update your profile to booking."
      );
    }

    const booking = await Booking.create(
      //if used session then must pass data in array
      [
        {
          user: userId,
          ...payload,
          status: BOOKING_STATUS.PENDING,
        },
      ],
      { session }
    );

    const tour = await Tour.findById(payload.tour).select("costFrom");

    if (!tour?.costFrom) {
      throw new AppError(httpStatusCodes.BAD_REQUEST, "No Tour Cost Found!");
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const amount = Number(tour.costFrom) * Number(payload.guestCount!);

    const payment = await Payment.create(
      [
        {
          booking: booking[0]._id,
          transactionId: transactionId,
          status: PAYMENT_STATUS.UNPAID,
          amount: amount,
        },
      ],
      { session }
    );

    const updatedBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      { payment: payment[0]._id },
      { new: true, runValidators: true, session }
    )
      .populate("user", "name email phone address")
      .populate("tour", "title location costFrom")
      .populate("payment", "amount status");

    // amount: number;
    // transactionId: string;
    // name: string,
    // email: string,
    // phoneNumber: string;
    // address: string
    //amount, name, email, address, phoneNumber, transactionId

    const userData = updatedBooking?.user as any;
    const { name, email, phone, address } = userData;

    const sslPayload: ISSLCommerz = {
      name,
      email,
      phone,
      address,
      transactionId,
      amount,
    };

    const sslPayment = await SSLService.sslPaymentInit(sslPayload);

    await session.commitTransaction(); //transaction
    session.endSession();

    return { paymentURL: sslPayment.GatewayPageURL, booking: updatedBooking };
  } catch (error: any) {
    await session.abortTransaction(); //rollback
    session.endSession();
    // throw new AppError(httpStatusCodes.BAD_REQUEST, error); //❌❌❌ don't use
    throw error;
  }
};

const getUserBookings = async () => {
  return {};
};

const getBookingById = async () => {
  return {};
};

const updateBookingStatus = async () => {
  return {};
};

const getAllBookings = async () => {
  return {};
};

export const BookingService = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  getAllBookings,
};
