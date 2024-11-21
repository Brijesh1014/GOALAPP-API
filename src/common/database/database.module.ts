import path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [path.join(__dirname, '../../**/*.entity{.ts,.js}')],
        synchronize: true, // Be cautious about using synchronize in production
      }),
      inject: [ConfigService],
      // name: 'PostgresDataSource',
    }),
  ],
  // providers: [
  //   {
  //     provide: 'PostgresDataSource',
  //     useFactory: (dataSource: DataSource) => dataSource,
  //     inject: [getDataSourceToken('PostgresDataSource')],
  //   },
  // ],
  // exports: ['PostgresDataSource'],
})
export class DatabaseModule {}
