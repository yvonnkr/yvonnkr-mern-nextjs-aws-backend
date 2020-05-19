const AWS = require("aws-sdk");

// *****************CONFIGURE AWS / INSTANCE ****************************************
// configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

//new instance of aws ses
const ses = new AWS.SES({
  apiVersion: "2010-12-01",
});

// *****************REGISTER EMAIL ****************************************

exports.registerEmailParams = (email, token) => {
  const params = {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_FROM],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
                <html>
                  <h1>Verify your email address</h1>
                  <p>Please use the following link to complete your registration:</p>
                  <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                </html>`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Complete your registration",
      },
    },
  };

  return params;
};

exports.sendEmailOnRegister = async (params) => {
  try {
    await ses.sendEmail(params).promise();

    // const data = await ses.sendEmail(params).promise();
    // console.log("Email submited to SES", data);
  } catch (error) {
    throw new Error("We could not verify your email, Please try again.");
  }
};

// *****************FORGOT PASSWORD EMAIL ****************************************

exports.forgotPasswordEmailParams = (email, token) => {
  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_FROM],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
                        <html>
                            <h1>Reset Password Link</h1>
                            <p>Please use the following link to reset your password:</p>
                            <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                        </html>
                    `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Password reset link",
      },
    },
  };
};

exports.sendEmailOnforgotPassword = async (params) => {
  try {
    await ses.sendEmail(params).promise();
  } catch (error) {
    throw new Error("We could not verify your email, Please try again.");
  }
};

// *****************SEND EMAIL TO USERS ON LINK PUBLISHED (BASED ON CATEGORY) ****************************************
//PARAMS
exports.linkPublishedParams = (email, data) => {
  const params = {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_FROM],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
                <html>
                  <h1>New link published | ${process.env.CLIENT_URL} </h1>
                  <p>A new link titled <b>${
                    data.title
                  }</b> has just been published in the following categories</p>

                  ${data.categories
                    .map((c) => {
                      return `
                      <div>
                        <h2>${c.name}</h2>
                        <img src="${c.image.url}" alt="${c.name}" style="height:50px;" />
                        <h3>
                          <a href="${process.env.CLIENT_URL}/links/${c.slug}" >Check it out!</a>
                        </h3>
                      </div>
                    `;
                    })
                    .join("-----------------")}

                  <br />

                  <p>Do not wish to receive notifications?</p>
                  <p>Turn off notifications by going to your <b>Dashboard</b> > Update Profile and Uncheck the categories </p>
                  <p>
                    <a href="${
                      process.env.CLIENT_URL
                    }/user/profile/update" >Go to your Dashboard</a>
                  </p>

                </html>`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "New link published",
      },
    },
  };

  return params;
};
//SEND-EMAIL-ON-LINK-CREATE
exports.sendEmailOnlinkPublished = async (params) => {
  try {
    await ses.sendEmail(params).promise();
  } catch (error) {
    throw new Error("We could not verify your email, Please try again.");
  }
};

//#region using then()catch()
// sendEmailOnRegister
//   .then((data) => {
//     console.log("Email submited to SES", data);
//     // res.send("Email Sent");
//     return res.json({ message: "Email sent" });
//   })
//   .catch((err) => {
//     console.log("Ses email on register error", err);
//     // res.send("Email failed");
//     return res.status(400).json({ error: "Email failed" });
//   });

//#endregion
