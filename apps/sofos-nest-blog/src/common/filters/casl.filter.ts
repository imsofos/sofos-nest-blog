import { ForbiddenError } from "@casl/ability";
import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";

@Catch(ForbiddenError)
export class CASLFilter implements ExceptionFilter {
    catch(_exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = 403;

        response
            .status(status)
            .json({
                "message": "Permisson denied.",
                "error": "Forbidden",
                "statusCode": status
            });
    }
}