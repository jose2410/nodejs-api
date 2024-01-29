function errorResponse(typeError, errorMessageUser, errorMessage, awsRequestId, callback, statusCode) {
    console.error(typeError,  errorMessageUser, errorMessage, awsRequestId, statusCode);
      callback(null, {
        statusCode: statusCode,
        body: JSON.stringify({
          statusCode: statusCode,
          TypeError: typeError, 
          Error: errorMessage,
          ErrorUser: errorMessageUser,
          Reference: awsRequestId
        }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"           
      },
      });
    }
  
    module.exports = { errorResponse }