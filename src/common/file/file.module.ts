import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { FileService } from './file.service';

@Module({
  exports: [FileService],
  providers: [FileService, ConfigService],
})
export class FileModule {}
