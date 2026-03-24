const PDFDocument = require("pdfkit");

const generateTicketPdf = (registration, event) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      doc.fontSize(20).text("Event Registration Ticket", { align: "center" });
      doc.moveDown();

      doc.fontSize(14).text(`Student Name: ${registration.studentName}`);
      doc.text(`Student Email: ${registration.studentEmail}`);
      doc.text(`Event Title: ${event.title}`);
      doc.text(`Description: ${event.description || "N/A"}`);
      doc.text(`Date: ${event.date}`);
      doc.text(`Time: ${event.time}`);
      doc.text(`Venue: ${event.venue}`);
      doc.text(`Registration ID: ${registration._id}`);
      doc.moveDown();

      doc.text("Thank you for registering!", { align: "center" });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateTicketPdf;