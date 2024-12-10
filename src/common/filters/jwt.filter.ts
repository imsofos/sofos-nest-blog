import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { TokenExpiredError } from "@nestjs/jwt";
import { Response } from "express";

@Catch(TokenExpiredError)
export class JWTFilter implements ExceptionFilter {
    catch(_exception: TokenExpiredError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = 403;

        response
            .status(status)
            .json({
                "message": "Your JWT is expired please login again.",
                "error": "Forbidden",
                "statusCode": status
            });
    }
}