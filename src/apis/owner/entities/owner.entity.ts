import { Field, ObjectType } from '@nestjs/graphql';
import { CafeInform } from 'src/apis/cafeInform/entities/cafeInform.entity';
import { OwnerComment } from 'src/apis/ownercomment/entities/ownercomment.entity';
import { OwnerCommentModule } from 'src/apis/ownercomment/ownercomment.module';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Owner {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  @Field(() => String)
  phone: string;

  @Column()
  @Field(() => Boolean)
  is_main: boolean;

  @Column({ default: false })
  @Field(() => Boolean)
  is_cafeInform: boolean;

  @Column()
  // @Field(() => String)
  password: string;

  @Column()
  // @Field(() => String)
  ownerPassword: string;

  @Column()
  @Field(() => String)
  ownerNum: string;

  @Column()
  @Field(() => String)
  brandName: string;

  @OneToMany(() => CafeInform, (cafeinform) => cafeinform.owner, {
    onDelete: 'CASCADE',
  })
  // @Field(() => [CafeInform])
  cafeInform: CafeInform[];

  @OneToMany(() => OwnerComment, (ownerComment) => ownerComment.owner, {
    onDelete: 'CASCADE',
  })
  ownerComment: OwnerComment[];
}
