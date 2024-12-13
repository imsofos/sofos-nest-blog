import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import { Response } from "express";

@Catch(PrismaClientKnownRequestError, PrismaClientValidationError, PrismaClientInitializationError)
export class PrismaFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception instanceof PrismaClientKnownRequestError ? 400 : 500;


        let message = "Error"; // exception.message is saying a lot about error
        if (exception instanceof PrismaClientKnownRequestError) {
            switch (exception.code) {
                case 'P2002':
                    message = 'Unique constraint violation';
                    break;
                case 'P2003':
                    message = 'Foreign key constraint violation';
                    break;
                case 'P2025':
                    message = 'Record not found';
                    break;
                default:
                    message = 'Internal';
            }
        }

        response.status(status).json({
            statusCode: status,
            message,
            error: 'Internal',
        });
    }
}