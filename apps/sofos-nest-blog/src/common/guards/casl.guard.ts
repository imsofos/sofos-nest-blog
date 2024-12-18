import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { CaslAbilityFactory } from "../../modules/casl/caslAbility.factory";
import { Rules } from "../decorators/rule.decorator";

@Injectable()
export class CaslGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly caslAbilityFactory: CaslAbilityFactory,
        private readonly jwtService: JwtService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authorizationHeader = request.headers.authorization;

        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Authorization token missing or invalid format');
        }

        const token = authorizationHeader.split(' ')[1];
        request.user = await this.jwtService.verifyAsync(token);

        try {
            // maybe cache this ?
            const rules = this.reflector.get(Rules, context.getHandler());
            const ability = this.caslAbilityFactory.createForUser(request.user);
            request.ability = ability;
            if (!rules?.length) return true;
            return rules.every(rule => ability.can(rule.action, rule.subject));
        } catch {
            return false
        }
    }
}