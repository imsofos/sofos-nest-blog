import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Roles } from "../decorators/role.decorator";

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const roles = this.reflector.get(Roles, context.getHandler());
            const request = context.switchToHttp().getRequest();
            return roles && roles.includes(request.user.role)
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}