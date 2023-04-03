import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Owner } from 'src/apis/owner/entities/owner.entity';
import { Stamp } from 'src/apis/stamp/entities/stamp.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class StampHistory {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => Int)
  count: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  @Field(() => User)
  user: User;

  @ManyToOne(() => Owner, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  @Field(() => Owner)
  owner: Owner;

  @ManyToOne(() => Stamp, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  @Field(() => Stamp)
  stamp: Stamp;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;
}
