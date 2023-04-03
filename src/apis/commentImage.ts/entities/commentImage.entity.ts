import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from 'src/apis/comment/entities/comment.entity';

@Entity()
@ObjectType()
export class CommentImage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  image_url: string;

  @ManyToOne(() => Comment, { onDelete: 'CASCADE' })
  @Field(() => Comment)
  comment: Comment;
}
