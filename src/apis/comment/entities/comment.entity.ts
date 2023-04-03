import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CafeInform } from 'src/apis/cafeInform/entities/cafeInform.entity';
import { CommentImage } from 'src/apis/commentImage.ts/entities/commentImage.entity';
import { OwnerComment } from 'src/apis/ownercomment/entities/ownercomment.entity';
import { User } from 'src/apis/user/entities/user.entity';
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
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  reply: string;

  @Column({ default: 0 })
  @Field(() => Int)
  like: number;

  @CreateDateColumn()
  @Field(() => Date)
  time: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @Field(() => User)
  user: User;

  @ManyToOne(() => CafeInform, { onDelete: 'CASCADE' })
  @Field(() => CafeInform)
  cafeinfo: CafeInform;

  @OneToMany(() => CommentImage, (commentImage) => commentImage.comment, {
    onDelete: 'CASCADE',
  })
  @Field(() => [CommentImage])
  commentImage: CommentImage[];

  @DeleteDateColumn()
  deletedAt: Date;
}
