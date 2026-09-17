import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsModule } from './Jobs/jobs.models';

@Module({

  imports: [
  TypeOrmModule.forRoot({

    type: 'better-sqlite3',
    database: 'Job.Queue.sqlite',
    autoLoadEntities: true,
    synchronize: true

  }),
     JobsModule,
],

})




export class AppModule {}
