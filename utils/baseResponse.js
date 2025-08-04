const baseResponse = ({
  data,
  errors = [],
  httpCode = 200,
  isSuccess = true,
}) => ({
  isSuccess,
  httpCode,
  data,
  errors,
});

module.exports = { baseResponse };
