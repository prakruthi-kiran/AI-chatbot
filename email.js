// email.js
// Ensure emailjs is already initialized in your HTML (you already init in head).
// Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with IDs from EmailJS.

async function sendConfirmationEmail(params) {
    // params = { to_name, to_email, booking_details, total, date, museum }
    try {
        // Replace these with your EmailJS service and template ids
        const SERVICE_ID = 'service_s1dsp8o';
        const TEMPLATE_ID = 'template_z6nt8sq';

        // Example template parameters - match these keys with the template you create in EmailJS
        const templateParams = {
            to_name: params.to_name || 'Guest',
            to_email: params.to_email,
            museum: params.museum,
            date: params.date,
            tickets: params.booking_details,
            total: params.total,
            message: params.message || 'Thank you for booking with us!'
        };

        // send returns a Promise
        const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
        // success
        addBotMessage(`✅ Confirmation email sent to ${params.to_email}.`);
        return result;
    } catch (err) {
        console.error('EmailJS send error:', err);
        addBotMessage(`⚠️ Failed to send confirmation email. Please check your email address or try again later.`);
        return null;
    }
}

// Helper used by your page's completePayment() flow.
function collectAndSendEmailAfterPayment() {
    const emailInput = document.getElementById('customerEmail');
    const emailError = document.getElementById('emailError');
    const email = emailInput ? emailInput.value.trim() : '';

    // simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        if (emailError) {
            emailError.style.display = 'block';
        }
        addBotMessage('Please enter a valid email address in the confirmation step so we can send your e-ticket.');
        return Promise.resolve(null);
    } else {
        if (emailError) emailError.style.display = 'none';
    }

    // Prepare booking details from existing global bookingData and DOM
    const bookingDetails = formatTickets(); // uses your existing function in index.html
    const museumName = museums[bookingData.museum] || document.getElementById('confirmMuseum').textContent;
    const dateText = document.getElementById('confirmDate').textContent || document.getElementById('selectedDate').textContent;
    const totalText = `₹${bookingData.total.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

    const params = {
        to_name: 'Visitor',
        to_email: email,
        museum: museumName,
        date: dateText,
        booking_details: bookingDetails,
        total: totalText,
        message: `Your booking for ${museumName} on ${dateText} is confirmed.`
    };

    // Call the async send function
    return sendConfirmationEmail(params);
}
