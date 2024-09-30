const cron = require('node-cron');
const sendEmail = require('./mailer'); // Adjust path to mailer if necessary
const Customer = require('../models/customerModel'); // Adjust path if necessary

const sendReminderEmails = async () => {
  try {
    const customers = await Customer.findAll({ where: { isDebtor: true } });

    const currentDate = new Date();

    for (const customer of customers) {
      const balance = parseFloat(customer.balance);
      const email = customer.email;
      const lastEmailSent = customer.lastEmailSent ? new Date(customer.lastEmailSent) : null;

      // Calculate the difference in days between the last email and the current date
      const daysSinceLastEmail = lastEmailSent
        ? Math.floor((currentDate - lastEmailSent) / (1000 * 60 * 60 * 24))
        : null;

      if (balance > 0) {
        // Send the reminder if no email was sent in the last 5 days
        if (!lastEmailSent || daysSinceLastEmail >= 5) {
          await sendEmail(
            email,
            'Reminder: Outstanding Balance',
            `Dear ${customer.name},\n\nThis is a reminder that you still have an outstanding balance of ${balance}. Please make the payment as soon as possible.\n\nThank you.`
          );

          // Update the lastEmailSent field to the current date
          await customer.update({ lastEmailSent: currentDate });
        }
      } else {
        // Send the "Thank You" email only if it hasn't been sent yet
        if (!lastEmailSent || daysSinceLastEmail > 0) {
          await sendEmail(
            email,
            'Thank You for Your Purchase!',
            `Dear ${customer.name},\n\nThank you for your purchase with UAS Motors. Your balance is now zero. We appreciate your business.\n\nBest regards,\nUAS Motors`
          );

          // Update the lastEmailSent field so no more emails are sent after balance is zero
          await customer.update({ lastEmailSent: currentDate });
        }
      }
    }
  } catch (error) {
    console.error('Error sending reminder emails:', error);
  }
};

// Schedule the task to run every 5 days at midnight
cron.schedule('0 0 */5 * *', sendReminderEmails);

module.exports = sendReminderEmails;
