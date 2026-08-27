export const getInviteUserHTML = 
(sender:string, role:string, workspaceName:string, acceptUrl:string)=>{
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>You've Been Invited to Join</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; color: #94a3b8;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0f172a; padding: 40px 20px;">
                <tr>
                <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #1e293b; border: 1px solid #334155; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3);">
                    
                    <!-- Header/Banner -->
                    <tr>
                        <td style="background-color: #0f172a; padding: 32px 40px; border-bottom: 1px solid #334155; text-align: center;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                            <tr>
                            <td style="background-color: #4f46e5; border-radius: 8px; width: 40px; height: 40px; text-align: center; vertical-align: middle;">
                                <span style="color: #ffffff; font-size: 20px; font-weight: 900; line-height: 40px; font-family: sans-serif;">Q</span>
                            </td>
                            <td style="padding-left: 12px; text-align: left; vertical-align: middle;">
                                <span style="font-size: 20px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">Prism<span style="color: #818cf8;">.IQ</span></span>
                            </td>
                            </tr>
                        </table>
                        </td>
                    </tr>

                    <!-- Content Body -->
                    <tr>
                        <td style="padding: 40px 40px 32px 40px;">
                        <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                            Workspace Invitation
                        </h1>
                        
                        <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 24px; color: #cbd5e1; font-weight: 500;">
                            Hello,
                        </p>
                        
                        <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 24px; color: #cbd5e1; font-weight: 500;">
                            <strong>${sender}</strong> has invited you to join the marketing analytics workspace 
                            <span style="color: #818cf8; font-weight: 700;">${workspaceName}</span> on PrismIQ.
                        </p>
                        
                        <p style="margin: 0 0 32px 0; font-size: 14px; line-height: 24px; color: #cbd5e1; font-weight: 500;">
                            Your assigned workspace privileges: <span style="display: inline-block; background-color: #312e81; color: #c7d2fe; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; padding: 4px 10px; border-radius: 6px; border: 1px solid rgba(99, 102, 241, 0.2);">${role}</span>.
                        </p>

                        <!-- Call to Action -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 32px;">
                            <tr>
                            <td align="center">
                                <a href="${acceptUrl}" target="_blank" style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-size: 13px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2), 0 2px 4px -1px rgba(79, 70, 229, 0.1); border: 1px solid rgba(255, 255, 255, 0.1); transition: background-color 0.2s ease;">
                                Accept Invitation & Join Workspace
                                </a>
                            </td>
                            </tr>
                        </table>
                    </tr>

                    <!-- Footer Section -->
                    <tr>
                        <td style="background-color: #0f172a; padding: 24px 40px; border-top: 1px solid #334155; text-align: center;">
                        <p style="margin: 0 0 8px 0; font-size: 11px; color: #475569; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                            Prism AI Analytics Platform
                        </p>
                        <p style="margin: 0; font-size: 11px; color: #475569; font-weight: 500; line-height: 16px;">
                            This email was generated automatically on behalf of ${sender} for ${workspaceName}. If you were not expecting this invitation, you can safely ignore this email.
                        </p>
                        </td>
                    </tr>

                    </table>
                </td>
                </tr>
            </table>
            </body>
        </html>`
}


export const getPassResetOtpHTML = (otpCode:string)=>{
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset OTP - Prism AI</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; color: #94a3b8;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0f172a; padding: 40px 20px;">
                <tr>
                <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #1e293b; border: 1px solid #334155; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3);">
                    
                    <!-- Header/Banner -->
                    <tr>
                        <td style="background-color: #0f172a; padding: 32px 40px; border-bottom: 1px solid #334155; text-align: center;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                            <tr>
                            <td style="background-color: #4f46e5; border-radius: 8px; width: 40px; height: 40px; text-align: center; vertical-align: middle;">
                                <span style="color: #ffffff; font-size: 20px; font-weight: 900; line-height: 40px; font-family: sans-serif;">Q</span>
                            </td>
                            <td style="padding-left: 12px; text-align: left; vertical-align: middle;">
                                <span style="font-size: 20px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">Prism<span style="color: #818cf8;">.IQ</span></span>
                            </td>
                            </tr>
                        </table>
                        </td>
                    </tr>

                    <!-- Content Body -->
                    <tr>
                        <td style="padding: 40px 40px 32px 40px;">
                        <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                            Reset your password
                        </h1>
                        
                        <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 24px; color: #cbd5e1; font-weight: 500;">
                            Hello,
                        </p>
                        
                        <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 24px; color: #cbd5e1; font-weight: 500;">
                            We received a request to reset the password for your account on Prism AI. Please use the following 6-digit verification code (OTP) to verify your request:
                        </p>

                        <!-- OTP Verification Display Box -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px; margin-top: 24px;">
                            <tr>
                            <td align="center">
                                <div style="background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 18px 40px; display: inline-block; letter-spacing: 6px; font-size: 32px; font-weight: 800; color: #818cf8; font-family: monospace; box-shadow: inset 0 2px 4px 0 rgba(0,0,0,0.2);">
                                ${otpCode}
                                </div>
                            </td>
                            </tr>
                        </table>

                        <p style="margin: 0 0 32px 0; font-size: 12px; line-height: 20px; color: #64748b; font-weight: 500; text-align: center;">
                            * This OTP verification code is valid for <strong>5 minutes</strong>. Do not share it with anyone.
                        </p>

                        <p style="margin: 0; font-size: 12px; line-height: 20px; color: #cbd5e1; font-weight: 500;">
                            If you did not initiate this request, someone else may have entered your email address by mistake. Your account password remains secure.
                        </p>
                        </td>
                    </tr>

                    <!-- Footer Section -->
                    <tr>
                        <td style="background-color: #0f172a; padding: 24px 40px; border-top: 1px solid #334155; text-align: center;">
                        <p style="margin: 0 0 8px 0; font-size: 11px; color: #475569; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                            Prism AI Analytics Platform
                        </p>
                        <p style="margin: 0; font-size: 11px; color: #475569; font-weight: 500; line-height: 16px;">
                            This email was sent automatically in response to your security verification request.
                        </p>
                        </td>
                    </tr>

                    </table>
                </td>
                </tr>
            </table>
            </body>
        </html>`
}



export const getVerifyEmailHTML = (name:string, verifyUrl:string)=>{
    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email Address - Prisma AI</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; color: #94a3b8;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0f172a; padding: 40px 20px;">
                <tr>
                <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #1e293b; border: 1px solid #334155; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3);">
                    
                    <!-- Header/Banner -->
                    <tr>
                        <td style="background-color: #0f172a; padding: 32px 40px; border-bottom: 1px solid #334155; text-align: center;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                            <tr>
                            <td style="background-color: #4f46e5; border-radius: 8px; width: 40px; height: 40px; text-align: center; vertical-align: middle;">
                                <span style="color: #ffffff; font-size: 20px; font-weight: 900; line-height: 40px; font-family: sans-serif;">Q</span>
                            </td>
                            <td style="padding-left: 12px; text-align: left; vertical-align: middle;">
                                <span style="font-size: 20px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">Prism<span style="color: #818cf8;">.IQ</span></span>
                            </td>
                            </tr>
                        </table>
                        </td>
                    </tr>

                    <!-- Content Body -->
                    <tr>
                        <td style="padding: 40px 40px 32px 40px;">
                        <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                            Verify your email address
                        </h1>
                        
                        <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 24px; color: #cbd5e1; font-weight: 500;">
                            Hello ${name},
                        </p>
                        
                        <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 24px; color: #cbd5e1; font-weight: 500;">
                            Thank you for creating an account on PrismIQ! To complete your registration and activate your dashboard access, please confirm your email address by clicking the button below.
                        </p>

                        <!-- Call to Action -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 32px; margin-top: 32px;">
                            <tr>
                            <td align="center">
                                <a href="${verifyUrl}" target="_blank" style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-size: 13px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2), 0 2px 4px -1px rgba(79, 70, 229, 0.1); border: 1px solid rgba(255, 255, 255, 0.1); transition: background-color 0.2s ease;">
                                Verify Email Address
                                </a>
                            </td>
                            </tr>
                        </table>
                    </tr>

                    <!-- Footer Section -->
                    <tr>
                        <td style="background-color: #0f172a; padding: 24px 40px; border-top: 1px solid #334155; text-align: center;">
                        <p style="margin: 0 0 8px 0; font-size: 11px; color: #475569; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                            Prisma AI Analytics Platform
                        </p>
                        <p style="margin: 0; font-size: 11px; color: #475569; font-weight: 500; line-height: 16px;">
                            If you did not sign up for an account on Prism AI, you can safely ignore or delete this email.
                        </p>
                        </td>
                    </tr>

                    </table>
                </td>
                </tr>
            </table>
            </body>
        </html>`
}