import { Field, ObjectType } from '@nestjs/graphql';
import { CafeInform } from 'src/apis/cafeInform/entities/cafeInform.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class CafeImage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  cafe_image: string;

  @Column()
  @Field(() => Boolean)
  is_main: boolean;

  @ManyToOne(() => CafeInform, { onDelete: 'CASCADE' })
  @Field(() => CafeInform)
  cafeInform: CafeInform;
}
