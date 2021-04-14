const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const sendEmail = async (email, subject, payload, template) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const source = fs.readFileSync(
      path.join(__dirname, "../", template),
      "utf8"
    );
    const compiledTemplate = handlebars.compile(source);
    const mailOptions = {
      from: `MyList <${process.env.EMAIL_USERNAME}>`,
      to: `${email}`,
      subject,
      html: compiledTemplate(payload),
    };

    // Send email
    const result = await transporter.sendMail(mailOptions);

    if (result.accepted.length) return { status: "Email sent successfully" };
  } catch (err) {
    return {
      error: "Internal server error",
      message: err.message,
      err: err.stack,
    };
  }
};

module.exports = sendEmail;
