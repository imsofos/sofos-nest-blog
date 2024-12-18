import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from "@nestjs/jwt";
import { Response } from "express";

@Catch(TokenExpiredError, JsonWebTokenError, NotBeforeError)
export class JWTFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = 401;
        let message = 'Your session has expired. Please log in again.';

        if (exception instanceof TokenExpiredError) {
            message = 'Your JWT has expired. Please log in again.';
        } else if (exception instanceof JsonWebTokenError) {
            message = 'Invalid JWT token. Please log in again.';
        } else if (exception instanceof NotBeforeError) {
            message = 'JWT token is not yet valid. Please try again later.';
        }
        response
            .status(status)
            .json({
                message: message,
                "error": "Unauthorized",
                "statusCode": status
            });
    }
}