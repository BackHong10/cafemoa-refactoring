import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { FilesUploadService } from './filesupload.service';

@Resolver()
export class FilesUploadResolver {
  constructor(
    private readonly fileUploadService: FilesUploadService, //
  ) {}

  @Mutation(() => [String])
  uploadFile(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
  ) {
    return this.fileUploadService.upload({ files });
  }

  @Mutation(() => String)
  uploadFileOne(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
  ) {
    return this.fileUploadService.uploadOne({ file });
  }
}
