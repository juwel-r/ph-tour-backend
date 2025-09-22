"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const tour_model_1 = require("../tour/tour.model");
const user_model_1 = require("../user/user.model");
const booking_interface_1 = require("./booking.interface");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const booking_model_1 = require("./booking.model");
const payment_model_1 = require("../payment/payment.model");
const payment_interface_1 = require("../payment/payment.interface");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const getTransactionID_1 = require("../../utils/getTransactionID");
const createBooking = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * Some instruction about session
     *
     * Session is used rollback transaction purpose. if any error occurred while operation or middle of operation then previous operation will be removed, session normally run operation in virtually after complete full operation then it applied on Database. if found any error while operation running then abort previous actions
     *
     * if used session then must pass payload of .create() as array of object. not in update()
     *
     * session not work in local Mongodb it run always live server
     */
    const transactionId = (0, getTransactionID_1.getTransactionID)();
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const user = yield user_model_1.User.findById(userId);
        if (!(user === null || user === void 0 ? void 0 : user.phone) || !(user === null || user === void 0 ? void 0 : user.address)) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Please update your profile to booking.");
        }
        const booking = yield booking_model_1.Booking.create(
        //if used session then must pass data in array
        [
            Object.assign(Object.assign({ user: userId }, payload), { status: booking_interface_1.BOOKING_STATUS.PENDING }),
        ], { session });
        const tour = yield tour_model_1.Tour.findById(payload.tour).select("costFrom");
        if (!(tour === null || tour === void 0 ? void 0 : tour.costFrom)) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "No Tour Cost Found!");
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const amount = Number(tour.costFrom) * Number(payload.guestCount);
        const payment = yield payment_model_1.Payment.create([
            {
                booking: booking[0]._id,
                transactionId: transactionId,
                status: payment_interface_1.PAYMENT_STATUS.UNPAID,
                amount: amount,
            },
        ], { session });
        const updatedBooking = yield booking_model_1.Booking.findByIdAndUpdate(booking[0]._id, { payment: payment[0]._id }, { new: true, runValidators: true, session })
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
        const userData = updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user;
        const { name, email, phone, address } = userData;
        const sslPayload = {
            name,
            email,
            phone,
            address,
            transactionId,
            amount,
        };
        const sslPayment = yield sslCommerz_service_1.SSLService.sslPaymentInit(sslPayload);
        yield session.commitTransaction(); //transaction
        session.endSession();
        return { paymentURL: sslPayment.GatewayPageURL, booking: updatedBooking };
    }
    catch (error) {
        yield session.abortTransaction(); //rollback
        session.endSession();
        // throw new AppError(httpStatusCodes.BAD_REQUEST, error); //❌❌❌ don't use
        throw error;
    }
});
const getUserBookings = () => __awaiter(void 0, void 0, void 0, function* () {
    return {};
});
const getBookingById = () => __awaiter(void 0, void 0, void 0, function* () {
    return {};
});
const updateBookingStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    return {};
});
const getAllBookings = () => __awaiter(void 0, void 0, void 0, function* () {
    return {};
});
exports.BookingService = {
    createBooking,
    getUserBookings,
    getBookingById,
    updateBookingStatus,
    getAllBookings,
};
