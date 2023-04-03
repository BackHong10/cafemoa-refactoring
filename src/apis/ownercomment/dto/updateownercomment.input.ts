import { InputType, PartialType } from '@nestjs/graphql';
import { CreateOwnerCommentInput } from './createownercomment.input';

@InputType()
export class UpdateOwnerCommentInput extends PartialType(
  CreateOwnerCommentInput, //
) {}
