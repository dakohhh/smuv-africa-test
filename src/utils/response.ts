export class HttpResponse<T> {
  success: boolean;
  message: string;
  data: T | null;

  constructor(message: string, data?: T | null, success?: boolean) {
    this.success = success == null ? true : success;
    this.message = message;
    this.data = data || null;
  }
}

function response<T>(message: string, data?: T | null, success?: boolean): HttpResponse<T> {
  return {
    success: success == null ? true : success,
    message: message,
    data: data || null,
  };
}

export default response;
