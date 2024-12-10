import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private jwtService: JwtService) { }


    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const authorizationHeader = request.headers.authorization
            if (!authorizationHeader) return false;

            const token = authorizationHeader.split(' ')[1];
            request.user = await this.jwtService.verifyAsync(token);
            return true;
        } catch (error) {
            if (error instanceof TokenExpiredError) throw error;
            return false;
        }
    }
}