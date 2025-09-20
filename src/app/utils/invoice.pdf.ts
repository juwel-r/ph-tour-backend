import PDFDocument from "pdfkit";
import AppError from "../errorHelpers/AppError";
import { IInvoiceData } from "../interfaces";

export const generatePDF = async (
  invoiceData: IInvoiceData
): Promise<Buffer<ArrayBufferLike>> => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffer: Uint8Array[] = [];

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
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw new AppError(401, "Error pdf creation");
  }
};
