import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { CafeImage } from 'src/apis/cafeImage/entities/cafeImage.entity';
import { CafeMenuImage } from 'src/apis/cafemenuimage/entities/cafemenuimage.entity';
import { CafeTag } from 'src/apis/cafeTag/entities/cafeTag.entity';

import { Comment } from 'src/apis/comment/entities/comment.entity';
import { Coupon } from 'src/apis/coupon/entities/coupon.entity';

import { Owner } from 'src/apis/owner/entities/owner.entity';
import { PickList } from 'src/apis/pickList/entities/pickList.entity';
import { Stamp } from 'src/apis/stamp/entities/stamp.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class CafeInform {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ length: 1500 })
  @Field(() => String)
  cafeinfo: string;

  @Column({ length: 1500 })
  @Field(() => String)
  notice: string;

  @Column({ length: 1500 })
  @Field(() => String)
  operatingInfo: string;

  @Column()
  @Field(() => String)
  cafeAddr: string;

  @Column()
  @Field(() => String)
  detailAddr: string;

  @Column({ default: 0 })
  @Field(() => Int)
  like: number;

  @Column()
  @Field(() => String)
  thumbNail: string;

  // @Column()
  // @Field(() => Boolean)
  // thumbNail: string;

  @Column()
  @Field(() => Boolean)
  is_WC: boolean;

  @Column()
  @Field(() => Boolean)
  is_Wifi: boolean;

  @Column()
  @Field(() => Boolean)
  is_Parking: boolean;

  @ManyToOne(() => Owner, { onDelete: 'CASCADE' })
  @Field(() => Owner)
  owner: Owner;

  @JoinTable()
  @ManyToMany(() => CafeTag, (cafeTag) => cafeTag.cafeInform, {
    onDelete: 'CASCADE',
  })
  @Field(() => [CafeTag])
  cafeTag: CafeTag[];

  @OneToMany(() => CafeImage, (cafeImage) => cafeImage.cafeInform, {
    cascade: true,
  })
  @Field(() => [CafeImage])
  cafeImage: CafeImage[];

  @OneToMany(() => CafeMenuImage, (cafeMenuImage) => cafeMenuImage.cafeInform, {
    cascade: true,
  })
  @Field(() => [CafeMenuImage])
  cafeMenuImage: CafeMenuImage[];

  @OneToMany(() => PickList, (pickList) => pickList.cafeInform, {
    onDelete: 'CASCADE',
  })
  pickList: PickList[];

  @OneToMany(() => Comment, (comment) => comment.cafeinfo, {
    onDelete: 'CASCADE',
  })
  comment: Comment;

  @OneToMany(() => Stamp, (stamp) => stamp.cafeInform, {
    onDelete: 'CASCADE',
  })
  stamp: Stamp[];

  @OneToMany(() => Coupon, (coupon) => coupon.cafeInform, {
    onDelete: 'CASCADE',
  })
  coupon: Coupon[];

  @CreateDateColumn()
  createdAt: Date;
}
