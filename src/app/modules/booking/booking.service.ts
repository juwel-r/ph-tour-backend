import AppError from "../../errorHelpers/AppError";
import { Tour } from "../tour/tour.model";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import httpStatusCodes from "http-status-codes";
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const user = await User.findById(userId);
  if (!user?.phone || !user?.address) {
    throw new AppError(
      httpStatusCodes.BAD_REQUEST,
      "Please update your profile to booking."
    );
  }

  const booking = await Booking.create({
    user: userId,
    ...payload,
    status: BOOKING_STATUS.PENDING,
  });

  const transactionId = `tran_${Date.now()}_${
    Math.floor(Math.random()) * 1000
  }`;
  const tour = await Tour.findById(payload.tour).select("costFrom");
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const amount = Number(tour?.costFrom) * Number(payload.guestCount!);

  const payment = await Payment.create({
    booking: booking._id,
    transactionId: transactionId,
    status: PAYMENT_STATUS.UNPAID,
    amount: amount,
  });

  const updatedBooking = await Booking.findByIdAndUpdate(
    booking._id,
    { payment: payment._id },
    { new: true }
  )
    .populate("user", "name email phone address")
    .populate("tour", "title location costFrom")
    .populate("payment", "amount status");

  return updatedBooking;
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
