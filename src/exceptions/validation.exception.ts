import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  messages: string[];

  constructor(responses: string[]) {
    super(responses, HttpStatus.BAD_REQUEST);
    this.messages = responses;
  }
}
