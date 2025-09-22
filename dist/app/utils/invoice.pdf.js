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
exports.generatePDF = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const generatePDF = (invoiceData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ size: "A4", margin: 50 });
            const buffer = [];
            doc.on("data", (chunk) => buffer.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(buffer)));
            doc.on("error", (error) => reject(error));
            //pdf content
            doc.fontSize(20).text("Invoice", { align: "center" });
            doc.moveDown();
            doc.fontSize(14).text(`Transaction ID ${invoiceData.transactionId}`);
            doc.text(`Booking Data ${invoiceData.bookingDate}`);
            doc.text(`Customer ${invoiceData.customerName}`);
            doc.moveDown();
            doc.text(`Tour Name: ${invoiceData.tourTitle} `);
            doc.text(`Total guest: ${invoiceData.guestCount} `);
            doc.text(`Total Cost: ${invoiceData.totalCost} `);
            doc.moveDown();
            doc.text("Thank you for stay with us.", { align: "center" });
            doc.end();
        });
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        throw new AppError_1.default(401, "Error pdf creation");
    }
});
exports.generatePDF = generatePDF;
