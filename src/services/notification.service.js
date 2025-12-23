const nodemailer = require('nodemailer');

// 1. Create a transporter object using the clinic's Gmail credentials
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    host: process.env.EMAIL_SERVICE_HOST,
    port: process.env.EMAIL_SERVICE_PORT, 
    secure: process.env.EMAIL_SERVICE_SECURE === 'true', 
    auth: {
        user: process.env.EMAIL_SERVICE_USER,
        pass: process.env.EMAIL_SERVICE_PASS,
    },
    // Stabilizes connection on cloud platforms like Render
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
});

const sendAppointmentConfirmation = async (appointmentDetails) => {
    const { doctorId, date, time, patientInfo } = appointmentDetails;
    
    // The official clinic email is both the sender and the recipient for the doctor/admin alert.
    const fromAddress = process.env.EMAIL_SERVICE_USER;
    const doctorNameFormatted = doctorId.charAt(0).toUpperCase() + doctorId.slice(1);

    // --- 1. Email Content for Patient (TO: patientInfo.email) ---
    const patientMailOptions = {
        from: `"Gurpreet Dental and Implant Clinic" <${fromAddress}>`,
        to: patientInfo.email,
        subject: 'Appointment Confirmed! [Gurpreet Dental and Implant Clinic]',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            
            <div style="text-align: center; padding: 20px 0; background-color: #f7f7f7;">
                <img src="https://cdn-icons-png.flaticon.com/512/5610/5610944.png" alt="Confirmed Checkmark" width="40" height="40" style="display: block; margin: 0 auto 10px;">
                <h1 style="color: #1abc9c; font-size: 24px; margin: 0;">Appointment Confirmed!</h1>
            </div>

            <div style="padding: 20px;">
                <p style="font-size: 16px; margin-bottom: 20px;">Dear ${patientInfo.name},</p>
                
                <div style="background-color: #e6f7ff; border-radius: 6px; padding: 15px; text-align: center; margin-bottom: 20px;">
                    <p style="font-size: 18px; color: #007bff; margin: 0 0 5px 0;">Your appointment is scheduled with</p>
                    <h2 style="font-size: 28px; color: #333; margin: 0;">Dr. ${doctorNameFormatted}</h2>
                    <p style="font-size: 16px; color: #555; margin: 5px 0 0 0;">
                        on <strong>${date}</strong> at <strong>${time}</strong>
                    </p>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #555;">Patient Name:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${patientInfo.name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #555;">Clinic Email:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${fromAddress}</td>
                    </tr>
                </table>

                <p style="font-size: 14px; color: #777; text-align: center;">
                    Please arrive 15 minutes before your scheduled time.
                </p>

                <div style="text-align: center; margin-top: 20px;">
                    <a href="mailto:${fromAddress}?subject=Question%20about%20my%20${date}%20appointment" 
                       style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                       Contact Clinic
                    </a>
                </div>
            </div>
            
            <div style="text-align: center; padding: 10px; font-size: 12px; color: #aaa; border-top: 1px solid #eee;">
                Gurpreet Dental and Implant Clinic
            </div>
        </div>
        `,
    };

    // --- 2. Email Content for Clinic/Doctor (TO: gurpreetdentalclinic@gmail.com) ---
    const clinicMailOptions = {
        from: `"Booking System Alert" <${fromAddress}>`,
        to: fromAddress, // Sending to the official clinic email for recording and notification
        subject: `NEW Appointment Booked: Dr. ${doctorNameFormatted} on ${date} at ${time}`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 500px; margin: auto; border: 1px solid #e74c3c; border-radius: 8px; overflow: hidden;">
            
            <div style="text-align: center; padding: 15px 0; background-color: #e74c3c; color: white;">
                <p style="font-size: 24px; margin: 0;">🚨 NEW BOOKING ALERT 🚨</p>
            </div>

            <div style="padding: 20px;">
                <h2 style="font-size: 22px; color: #333; margin-top: 0; border-bottom: 2px solid #ddd; padding-bottom: 10px;">
                    Action Required: Appointment Confirmed
                </h2>
                
                <div style="background-color: #fff8e1; border: 1px solid #ffeb3b; border-radius: 6px; padding: 15px; margin-bottom: 20px;">
                    <p style="font-size: 16px; color: #555; margin: 0 0 5px 0;">Appointment Time</p>
                    <p style="font-size: 28px; font-weight: bold; color: #f39c12; margin: 0 0 5px 0;">${time}</p>
                    <p style="font-size: 16px; color: #555; margin: 0;">Dr. ${doctorNameFormatted} | ${date}</p>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #555; width: 40%;"><strong>Patient Name:</strong></td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: left; font-weight: bold; color: #333;">${patientInfo.name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #555;"><strong>Patient Email:</strong></td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: left; color: #3498db;">${patientInfo.email}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #555;"><strong>Doctor ID:</strong></td>
                        <td style="padding: 10px 0; text-align: left; color: #333;">${doctorId}</td>
                    </tr>
                </table>

                <p style="font-size: 15px; color: #e74c3c; font-weight: bold; text-align: center; border: 1px dashed #e74c3c; padding: 10px; border-radius: 4px;">
                    Please update the official clinic schedule immediately.
                </p>
            </div>
            
            <div style="text-align: center; padding: 10px; font-size: 12px; color: #aaa; background-color: #f7f7f7; border-top: 1px solid #eee;">
                Booking System Notification | Gurpreet Dental Clinic
            </div>
        </div>
        `,
    };

    try {
        // Send confirmation to the patient
        await transporter.sendMail(patientMailOptions);
        console.log(`Notification: Confirmation sent to patient ${patientInfo.email}`);
        
        // Send administrative alert to the clinic email
        await transporter.sendMail(clinicMailOptions);
        console.log(`Notification: Admin alert sent to ${fromAddress}`);
    } catch (error) {
        console.error('Error sending email notification:', error);
    }
};

module.exports = {
    sendAppointmentConfirmation,
};