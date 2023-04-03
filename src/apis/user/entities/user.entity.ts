import { Field, ObjectType } from '@nestjs/graphql';
import { Comment } from 'src/apis/comment/entities/comment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Stamp } from 'src/apis/stamp/entities/stamp.entity';
import { PickList } from 'src/apis/pickList/entities/pickList.entity';
import { LikeComment } from 'src/apis/likeComment/entities/likecomment.entity';
import { Coupon } from 'src/apis/coupon/entities/coupon.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  nickname: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  @Field(() => String)
  address: string;

  @Column({ default: '' })
  @Field(() => String)
  detailAddress: string;

  @Column()
  @Field(() => String)
  phone: string;

  @Column()
  // @Field(() => String)
  password: string;

  @Column()
  @Field(() => String)
  profileImage: string;

  // @DeleteDateColumn()
  // @Field(() => Date)
  // deletedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.user, { onDelete: 'CASCADE' })
  comment: Comment;

  @OneToMany(() => Stamp, (stamp) => stamp.user, { onDelete: 'CASCADE' })
  stamp: Stamp;

  @OneToMany(() => PickList, (pickList) => pickList.user, {
    onDelete: 'CASCADE',
  })
  pickList: PickList;

  @OneToMany(() => LikeComment, (likeComment) => likeComment.user, {
    onDelete: 'CASCADE',
  })
  likeComment: LikeComment;
  @OneToMany(() => Coupon, (coupon) => coupon.user, { onDelete: 'CASCADE' })
  coupon: Coupon[];
}
