const sgMail = require("@sendgrid/mail");

const sendgridAPIKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendgridAPIKey);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "fercho0.fpl@gmail.com",
    subject: "Thanks for joining in!",
    text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
  });
};

const sendCancelEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "fercho0.fpl@gmail.com",
    subject: "Cancel email",
    text: `We hope to see you soon, ${name}. Could you tell us why you are leaving us?`,
  });
};
module.exports = {
  sendWelcomeEmail,
  sendCancelEmail,
};
