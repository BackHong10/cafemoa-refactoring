import { Module } from '@nestjs/common';
import { FilesUploadResolver } from './filesupload.resolver';
import { FilesUploadService } from './filesupload.service';

@Module({
  providers: [
    FilesUploadResolver, //
    FilesUploadService,
  ],
})
export class FilesUploadModule {}
