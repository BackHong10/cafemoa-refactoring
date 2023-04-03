import { InputType, PartialType } from '@nestjs/graphql';
import { createCommentInput } from './createComment.input';
@InputType()
export class UpdateCommentInput extends PartialType(createCommentInput) {}
