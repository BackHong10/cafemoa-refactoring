import { Field, ObjectType } from '@nestjs/graphql';
import { CafeInform } from 'src/apis/cafeInform/entities/cafeInform.entity';
import { Comment } from 'src/apis/comment/entities/comment.entity';
import { User } from 'src/apis/user/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class PickList {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  @Field(() => User)
  user: User;

  @ManyToOne(() => CafeInform, { onDelete: 'CASCADE' })
  @Field(() => CafeInform)
  cafeInform: CafeInform;
}
