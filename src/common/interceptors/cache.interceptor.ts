import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Request } from "express";
import { map, Observable, of } from "rxjs";

@Injectable()
export class CacheInterceptor implements NestInterceptor {

    cache: [];

    constructor() {
        this.cache = [];
    }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();
        const cache = this.cache[request.originalUrl];
        // check diff with now :))
        if (cache && cache.count--) {
            return of(cache.data);
        }
        return next.handle().pipe(map(data => {
            // set time maybe :)
            this.cache[request.originalUrl] = { data, count: 5 };
            return data;
        }));
    }
}