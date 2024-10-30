import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    });

    this.$on(
      'query' as never,
      (e: { query: string; params: unknown; duration: number }) => {
        console.log('Query: ' + e.query);
        console.log('Params: ' + JSON.stringify(e.params));
        console.log('Duration: ' + e.duration + 'ms');
      },
    );

    // this.$extends({
    //   query: {
    //     $allModels: {
    //       async create({ args, query }) {
    //         if ('createdBy' in args.data && !args.data?.updatedBy) {
    //           args.data.updatedBy = args.data.createdBy;
    //         }
    //         return query(args);
    //       },
    //     },
    //   },
    // });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
