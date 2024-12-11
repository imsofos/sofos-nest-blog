import { AbilityBuilder, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Action } from "src/common/enums/action.enum";
import { RolesEnum } from 'src/common/enums/roles.enum';

type AppAbility = PureAbility<[Action, Subjects<{
    User: User
}> | 'all'], PrismaQuery>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: User) {
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

        if (user.role == RolesEnum.admin) {
            can(Action.Manage, 'all'); // read-write access to everything
        } else {
            can(Action.Read, 'all'); // read-only access to everything
        }

        can(Action.Update, 'User', { id: user.id });
        can(Action.Delete, 'User', { id: user.id });
        cannot(Action.Delete, 'User', { role: RolesEnum.admin });

        return build();
    }
}