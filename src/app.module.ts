import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentVariables } from 'config/type';
import { ApiExceptionFilter } from './common/filter/apiException.filter';
import { GlobalExceptionsFilter } from './common/filter/globalException.filter';
import { HttpExceptionFilter } from './common/filter/httpException.filter';
import { GlobalResponseInterceptor } from './common/interceptor/globalResponse.interceptor';
import { RequestLoggerInterceptor } from './common/interceptor/requestLogger.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', `.env.${process.env.NODE_ENV}.local`, `.env.${process.env.NODE_ENV}`],
    }),
    WinstonModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory() {
        return {
          format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), format.json()),
          transports: [
            new transports.Console(),
            new transports.DailyRotateFile({
              dirname: './logs/warns',
              filename: 'warn-%DATE%.log',
              datePattern: 'YYYY-MM-DD',
              zippedArchive: true,
              maxSize: '20m',
              maxFiles: '7d',
              level: 'warn',
            }),
            new transports.DailyRotateFile({
              dirname: './logs/infos',
              filename: 'info-%DATE%.log',
              datePattern: 'YYYY-MM-DD',
              zippedArchive: true,
              maxSize: '20m',
              maxFiles: '7d',
              level: 'info',
            }),
            new transports.DailyRotateFile({
              dirname: './logs/errors',
              filename: 'error-%DATE%.log',
              datePattern: 'YYYY-MM-DD',
              zippedArchive: true,
              maxSize: '20m',
              maxFiles: '30d',
              level: 'error',
            }),
          ],
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWD'),
        database: configService.get('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: configService.get('DB_SYNC'),
        logging: process.env.NODE_ENV === 'development',
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter,
    },
  ],
})
export class AppModule {}
