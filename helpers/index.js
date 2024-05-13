const { Admins, Customers, Vendors, Users } = require("../models");
const fs = require("fs");
const {
  sequelize,
  env: {
    ENVIRONMENT,
    LOCAL_URL,
    LIVE_URL,
    AWS_S3_BUCKET_NAME,
    IDFY_URL_FOR_REQUEST_TASK,
    IDFY_URL_TO_FETCH_TASK,
    IDFY_TASK_ID,
    IDFY_GRPOUP_ID,
    IDFY_API_KEY,
    IDFY_ACCOUNT_ID,
  },
  AWS_S3,
} = require("../config");

require("dotenv");
const { verify, sign } = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const crypto = require("crypto");

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhoneNumber = (phoneNumber) => {
  const mobileRegex = /^91\d{10}$/;
  return mobileRegex.test(phoneNumber);
};

const checkToken = async (token, refresh = false) => {
  try {
    const verifier = await verify(token, process.env.JWTSECRET);
    const avl_user = await Users.findOne({
      where: refresh
        ? {
            id: verifier.id,
            refresh_token: token,
          }
        : {
            id: verifier.id,
            access_token: token,
          },
      attributes: {
        exclude: ["password", "access_token", "refresh_token"],
      },
      raw: true,
    });
    if (!avl_user) {
      return "Session expired";
    }
    return { ...avl_user, ...verifier };
  } catch (error) {
    return "Session expired";
  }
};

const makeToken = (data) => {
  const token = sign(data, process.env.JWTSECRET, {
    expiresIn: "4h",
  });
  return token;
};
const makeRefreshToken = (data) => {
  const token = sign(data, process.env.JWTSECRET, {
    expiresIn: "1y",
  });
  return token;
};

const getTodayName = () => {
  var today = new Date();

  var dayOfWeek = today.getDay();
  var daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var dayName = daysOfWeek[dayOfWeek];
  return dayName;
};

const isValid = (text) => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const validEmail = emailRegex.test(text);
  const phoneRegex = /^91[1-9]\d{9}$/;
  const validPhone = phoneRegex.test(text);
  return {
    validEmail,
    validPhone,
  };
};

// const uploadFile = async (file, path) => {
//     try {
//         let file_url = null
//         if (file) {
//             const file_name = `${path}/${Date.now().valueOf()}.${file.filename.split('.')[file.filename.split('.').length - 1]}`
//             await fs.promises.copyFile(file.path, file_name)
//             file_url = `${file_name}`
//         }

//         return file_url
//     } catch (error) {
//         console.log(error);
//         return null
//     }
// }

const uploadFile = async (req, file, store_path) => {
  try {
    console.log(file);
    let file_url = null;
    const file_name = `${store_path}${Date.now().valueOf()}.${
      (file.filename || "unknown").split(".")[
        file.filename.split(".").length - 1
      ]
    }`;
    await fs.promises.copyFile(file.path, file_name);
    console.log(`success: ${file_name} file created`);
    file_url = `/${file_name}`;
    console.log("fileUrl", file_url);

    return {
      file_url,
    };
  } catch (error) {
    console.log(error);
  }
};

const make_hash = (text) => {
  var hash = crypto.createHash("md5").update(text).digest("hex");
  return hash;
};

const check_hash = (text, hash) => {
  var texthash = crypto.createHash("md5").update(text).digest("hex");
  return texthash == hash;
};
const encrypt_text = (text) => {
  const ciphertext = CryptoJS.AES.encrypt(text, process.env.KEY).toString();
  return ciphertext;
};

const decrypt_text = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  } catch (error) {
    console.error("Error during decryption:", error);
    return null;
  }
};

const sendError = (res, error_code, error_message) => {
  return res
    .response({
      code: error_code,
      status: "error",
      message: error_message,
    })
    .code(200);
};

const sendSuccess = (res, message, data) => {
  return res
    .response(
      data
        ? {
            code: 200,
            status: "success",
            message: message,
            data: data,
          }
        : {
            code: 200,
            status: "success",
            message: message,
          }
    )
    .code(200);
};

// const deleteFromS3 = async (key) => {
//     try {
//         const params = {
//             Bucket: AWS_S3_BUCKET_NAME,
//             Key: key,
//         };
//         await AWS_S3.deleteObject(params).promise()
//         return true
//     } catch (error) {
//         return false
//     }
// }

// const uploadToS3 = (fileName, filePath, fileData) => {
//     return new Promise((resolve, reject) => {
//         const params = {
//             Bucket: AWS_S3_BUCKET_NAME,
//             Key: filePath + '/' + fileName,
//             Body: fileData,
//         };
//         AWS_S3.upload(params, (err, data) => {
//             if (err) {
//                 console.log(err);
//                 return reject(err);
//             }
//             return resolve(data);
//         });
//     });
// };

// const getFromS3 = async (key) => {
//     try {
//         const params = {
//             Bucket: AWS_S3_BUCKET_NAME,
//             Key: key,
//             // SignatureVersion: 'v4',
//         };
//         const data = AWS_S3.getSignedUrl('getObject', params);
//         return data
//     } catch (error) {
//         console.log(error);
//         return null
//     }
// }

const calculatePercentage = (number, percentage) => {
  // Ensure that the parameters are valid numbers
  if (typeof number !== "number" || typeof percentage !== "number") {
    return "Please provide valid numbers as parameters.";
  }

  // Calculate the percentage value
  const result = (number * percentage) / 100;

  return result;
};

const addPercentageToNumber = (number, percentage) => {
  const percentageValue = calculatePercentage(number, percentage);

  if (typeof percentageValue === "string") {
    return percentageValue; // Return the error message from calculatePercentage
  }

  const result = number + percentageValue;
  return result;
};

const subPercentageFromNumber = (number, percentage) => {
  const percentageValue = calculatePercentage(number, percentage);

  if (typeof percentageValue === "string") {
    return percentageValue; // Return the error message from calculatePercentage
  }

  const result = number - percentageValue;
  return result;
};

const formatOrderId = (input) => {
  // Assuming this.year is the current year
  const year = new Date().getFullYear();

  // Pad the input number with leading zeros
  const paddedNumber = String(input).padStart(4, "0");

  // Construct the formatted output string
  const output = `MKJ-${year}-${paddedNumber}`;

  return output;
};
const formatOrderInvoiceId = (input) => {
  // Assuming this.year is the current year
  const year = new Date().getFullYear();

  // Pad the input number with leading zeros
  const paddedNumber = String(input).padStart(4, "0");

  // Construct the formatted output string
  const output = `MKJ-INV-${year}-${paddedNumber}`;

  return output;
};
const formatOrderIdCommission = (input) => {
  // Assuming this.year is the current year
  const year = new Date().getFullYear();

  // Pad the input number with leading zeros
  const paddedNumber = String(input).padStart(4, "0");

  // Construct the formatted output string
  const output = `SAMAKHYA-${year}-${paddedNumber}`;

  return output;
};
const formatOrderCommissionInvoiceId = (input) => {
  // Assuming this.year is the current year
  const year = new Date().getFullYear();

  // Pad the input number with leading zeros
  const paddedNumber = String(input).padStart(4, "0");

  // Construct the formatted output string
  const output = `SAMAKHYA-INV-${year}-${paddedNumber}`;

  return output;
};

const toINR = (number) => {
  return number.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const numberToText = (number) => {
  const ones = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  const teens = [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];
  const thousands = [
    "",
    "thousand",
    "million",
    "billion",
    "trillion",
    "quadrillion",
    "quintillion",
    "sextillion",
    "septillion",
    "octillion",
    "nonillion",
    "decillion",
    "undecillion",
    "duodecillion",
    "tredecillion",
    "quattuordecillion",
    "quindecillion",
  ];

  const convertChunk = (num) => {
    if (num === 0) return "";
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + " " + ones[num % 10];
    return ones[Math.floor(num / 100)] + " hundred " + convertChunk(num % 100);
  };

  const splitIntoChunks = (num) => {
    const chunks = [];
    while (num > 0) {
      chunks.push(num % 1000);
      num = Math.floor(num / 1000);
    }
    return chunks;
  };

  if (number === 0) return "zero only";

  const rupee = Math.floor(number); // Extract the rupee part
  const paisa = Math.round((number - rupee) * 100); // Extract the paisa part

  const chunks = splitIntoChunks(rupee);
  let text = "";

  for (let i = chunks.length - 1; i >= 0; i--) {
    const chunkText = convertChunk(chunks[i]);
    if (chunkText !== "") {
      text += chunkText + " " + thousands[i] + " ";
    }
  }

  if (paisa !== 0) {
    if (text !== "") {
      text += "rupees & ";
    }
    text += convertChunk(paisa) + " paisas ";
  }

  return text.trim() + " only";
};

module.exports = {
  checkToken,
  makeToken,
  makeRefreshToken,
  getTodayName,
  uploadFile,
  make_hash,
  check_hash,
  encrypt_text,
  decrypt_text,
  sendError,
  sendSuccess,
  // uploadToS3,
  // getFromS3,
  // deleteFromS3,
  calculatePercentage,
  addPercentageToNumber,
  subPercentageFromNumber,
  formatOrderId,
  formatOrderInvoiceId,
  formatOrderIdCommission,
  formatOrderCommissionInvoiceId,
  toINR,
  numberToText,
  validateEmail,
  validatePhoneNumber,
  isValid,
};
