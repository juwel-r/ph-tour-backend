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
exports.PaymentService = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const cloudinary_config_1 = require("../../config/cloudinary.config");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const emailSender_1 = require("../../utils/emailSender");
const invoice_pdf_1 = require("../../utils/invoice.pdf");
const booking_interface_1 = require("../booking/booking.interface");
const booking_model_1 = require("../booking/booking.model");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const user_model_1 = require("../user/user.model");
const payment_interface_1 = require("./payment.interface");
const payment_model_1 = require("./payment.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const initPayment = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_model_1.Booking.findById(bookingId);
    const payment = yield payment_model_1.Payment.findOne({ booking: booking === null || booking === void 0 ? void 0 : booking._id });
    const user = yield user_model_1.User.findById(booking === null || booking === void 0 ? void 0 : booking.user).select("name email phone address");
    if (!booking || !payment || !user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Payment Not Found. You have not booked this tour");
    }
    if (booking.status !== booking_interface_1.BOOKING_STATUS.COMPLETE ||
        payment.status !== payment_interface_1.PAYMENT_STATUS.PAID) {
        const { name, email, phone, address } = user;
        const sslPayload = {
            name,
            email,
            phone: phone,
            address: address,
            transactionId: payment.transactionId,
            amount: payment.amount,
        };
        const sslPayment = yield sslCommerz_service_1.SSLService.sslPaymentInit(sslPayload);
        return { paymentURL: sslPayment.GatewayPageURL };
    }
    else {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "This booking already paid");
    }
});
//generate invoice PDF, send invoice email, save pdf to cloudinary, save pdf url to db
const successPayment = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const payment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId }, { status: payment_interface_1.PAYMENT_STATUS.PAID }, { new: true, session });
        const updateBooking = yield booking_model_1.Booking.findByIdAndUpdate(payment === null || payment === void 0 ? void 0 : payment.booking, { status: booking_interface_1.BOOKING_STATUS.COMPLETE }, { new: true, session })
            .populate("user", "name email")
            .populate("tour", "title")
            .populate("payment", "amount");
        if (!updateBooking) {
            throw new AppError_1.default(404, "Booking not found");
        }
        const invoiceData = {
            transactionId: transactionId,
            bookingDate: updateBooking.createdAt,
            customerName: updateBooking.user.name,
            tourTitle: updateBooking.tour.title,
            guestCount: updateBooking.guestCount,
            totalCost: updateBooking.payment.amount,
        };
        const pdfBuffer = yield (0, invoice_pdf_1.generatePDF)(invoiceData);
        const fileName = `invoice for ${invoiceData.tourTitle}.pdf`;
        const cloudinaryPdfUpload = yield (0, cloudinary_config_1.cloudinaryBufferUpload)(pdfBuffer, fileName);
        if (!cloudinaryPdfUpload) {
            throw new AppError_1.default(404, "PDF not found.");
        }
        //update invoice ulr
        yield payment_model_1.Payment.updateOne({ transactionId }, { invoiceUrl: cloudinaryPdfUpload.secure_url }, { session });
        yield (0, emailSender_1.sendEmail)({
            to: updateBooking.user.email,
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
        yield session.commitTransaction();
        session.endSession();
        return { success: true, message: "Payment Successful" };
    }
    catch (error) {
        throw new Error(error);
    }
});
const failedPayment = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const payment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId }, { status: payment_interface_1.PAYMENT_STATUS.FAILED }, { new: true, session });
        yield booking_model_1.Booking.findByIdAndUpdate(payment === null || payment === void 0 ? void 0 : payment.booking, { status: booking_interface_1.BOOKING_STATUS.FAILED }, { runValidators: true, session });
        yield session.commitTransaction();
        session.endSession();
        return { success: false, message: "Payment Failed" };
    }
    catch (error) {
        throw new Error(error);
    }
});
const cancelPayment = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const payment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId }, { status: payment_interface_1.PAYMENT_STATUS.CANCELLED }, { runValidators: true, session });
        yield booking_model_1.Booking.findByIdAndUpdate(payment === null || payment === void 0 ? void 0 : payment.booking, { status: booking_interface_1.BOOKING_STATUS.CANCEL }, { runValidators: true, session });
        yield session.commitTransaction();
        session.endSession();
        return { success: false, message: "Payment Cancelled" };
    }
    catch (error) {
        throw new Error(error);
    }
});
const invoicePDF = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentData = yield payment_model_1.Payment.findOne({ transactionId }).select("invoiceUrl");
    if (!paymentData) {
        throw new AppError_1.default(404, "Payment invoice pdf url not found.");
    }
    return paymentData;
});
exports.PaymentService = {
    initPayment,
    successPayment,
    failedPayment,
    cancelPayment,
    invoicePDF
};
