const formidable = require("formidable");

exports.getFormData = async (req) => {
  const form = formidable();
  let formData = {};

  try {
    //formidable as promise
    await new Promise((resolve, reject) => {
      return form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
          return;
        }

        formData = { fields, files }; //set formData
        resolve();
      });
    });

    return formData;
  } catch (error) {
    throw error;
  }
};
