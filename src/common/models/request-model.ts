
export interface RequestLogObject {
    url: string,
    method: string,
    body?: object,
    params?: object
  }
  
  export interface ResponseLogObject {
    status: string,
    data?: object,
    message: string
  }