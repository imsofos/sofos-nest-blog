import { AbilityBuilder, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { Post, User } from '@prisma/client';
import { Action } from "../../common/enums/action.enum";
import { RolesEnum } from '../../common/enums/roles.enum';

export type AppAbility = PureAbility<[Action, Subjects<{
    User: User
    Post: Post
}> | 'all'], PrismaQuery>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: User) {
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

        if (user.role == RolesEnum.admin) {
            can(Action.Manage, 'all');
        } else {
            can(Action.Read, 'all');
            cannot(Action.Read, 'Post', { is_public: false })
        }

        can(Action.Update, 'User', { id: user.id });
        can(Action.Update, 'Post', { author_id: user.id });
        can(Action.Delete, 'User', { id: user.id });
        cannot(Action.Delete, 'User', { role: RolesEnum.admin });

        return build();
    }
}