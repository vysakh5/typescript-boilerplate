interface IResponse {
  code: number;
  message?: string;
  data?: any;
}

const httpRes = (resData: IResponse) => {
  // const { code: number, message: string, data: any } = data;
  let code: number = resData.code;
  let message = resData.message;
  let data = resData.data;
  const responseObj: any = {
    //Success Response
      200: {type:"success", statusMessage: "OK", message: "The request is OK." },
      201: {type:"success", statusMessage: "Created", message: "The request is complete, and a new resource is created." },
      202: {type:"success", statusMessage: "Accepted", message: "The request is accepted for processing, but the processing is not complete." },
      204: {type:"success", statusMessage: "Accepted", message: "A status code and a header are given in the response, but there is no entity-body in the reply." },
  //Client side Error Response
      400: {type:"Client error", statusMessage: "Bad Request", message: "The server could not understand the request due to invalid syntax." },
      401: {type:"Client error", statusMessage: "Unauthorized", message: "The client must authenticate itself to get the requested response." },
      402: {type:"Client error", statusMessage: "Payment Required ", message: "Require payment to get response" },
      403: {type:"Client error", statusMessage: "Forbidden", message: "The server understood the request, but is refusing to fulfill it." },
      404: {type:"Client error", statusMessage: "Not Found", message: "The server can not find the requested resource" },
      405: {type:"Client error", statusMessage: "Method Not Allowed", message: "The method specified in the Request-Line is not allowed for the resource identified by the Request-URI." },
  //Server side Error Response
      500: {type:"Server error", statusMessage: "Internal Server Error", message: "The server encountered an unexpected condition which prevented it from fulfilling the request." },
      501: {type:"Server error", statusMessage: "Not Implemented", message: "The server does not support the functionality required to fulfill the request." },
      502: {type:"Server error", statusMessage: "Bad Gateway", message: "The server received an invalid response from the upstream server." },
      503: {type:"Server error", statusMessage: "Service Unavailable", message: "The server is currently unable to handle the request due to a temporary overloading or maintenance of the server." },
      504: {type:"Server error", statusMessage: "Gateway Timeout", message: "The server did not receive a timely response from the upstream server." }

  };

  return {
      type: responseObj[code].type,
      error:code >= 400 ? true : false,
      statusCode: code,
      statusMessage: responseObj[code].statusMessage,
      message: message ? message : responseObj[code].message,
      data
  };
}




export default httpRes