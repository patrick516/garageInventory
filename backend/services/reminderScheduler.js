const cron = require('node-cron');
const sendEmail = require('./mailer');
const Customer = require('../models/customerModel'); // Adjust path if necessary

const sendReminderEmails = async () => {
  try {
    const customers = await Customer.findAll({ where: { isDebtor: true } });
    for (const customer of customers) {
      const balance = parseFloat(customer.balance);
      const email = customer.email;

      if (balance > 0) {
        await sendEmail(
          email,
          'Reminder: Outstanding Balance',
          `Dear ${customer.name},\n\nThis is a reminder that you still have an outstanding balance of ${balance}. Please make the payment as soon as possible.\n\nThank you.`
        );
      } else {
        await sendEmail(
          email,
          'Thank You for Your Purchase!',
          `Dear ${customer.name},\n\nThank you for your purchase with UAS Motors. Your balance is now zero. We appreciate your business.\n\nBest regards,\nUAS Motors`
        );
      }
    }
  } catch (error) {
    console.error('Error sending reminder emails:', error);
  }
};

// Schedule the task to run every 5 days
cron.schedule('0 0 */5 * *', sendReminderEmails);

module.exports = sendReminderEmails;
