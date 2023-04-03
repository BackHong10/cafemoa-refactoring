import { Field, ObjectType } from '@nestjs/graphql';
import { CafeInform } from 'src/apis/cafeInform/entities/cafeInform.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class CafeMenuImage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  menu_imageUrl: string;

  @ManyToOne(() => CafeInform, { onDelete: 'CASCADE' })
  @Field(() => CafeInform)
  cafeInform: CafeInform;
}
