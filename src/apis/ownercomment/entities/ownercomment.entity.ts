import { Field, ObjectType } from '@nestjs/graphql';
import { Comment } from 'src/apis/comment/entities/comment.entity';
import { Owner } from 'src/apis/owner/entities/owner.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class OwnerComment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  content: string;

  @CreateDateColumn()
  @Field(() => Date)
  time: Date;

  @ManyToOne(() => Owner, { onDelete: 'CASCADE' })
  @Field(() => Owner)
  owner: Owner;

  @ManyToOne(() => Comment)
  @Field(() => Comment)
  comment: Comment;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;
}
