import { Field, ObjectType } from '@nestjs/graphql';
import { CafeInform } from 'src/apis/cafeInform/entities/cafeInform.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class CafeTag {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  tagName: string;

  @ManyToMany(() => CafeInform, (cafeInform) => cafeInform.cafeTag, {
    onDelete: 'CASCADE',
  })
  @Field(() => [CafeInform])
  cafeInform: CafeInform[];
}
