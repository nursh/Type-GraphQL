import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";
import { ObjectType, Field, ID, Root } from "type-graphql";


@ObjectType()
@Entity()
export class User extends BaseEntity{

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    firstName: string;

    @Field()
    @Column()
    lastName: string;

    @Field()
    @Column('text', { unique: true })
    email: string;

    // GraphQL only field
    @Field()
    name(@Root() parent: User): string {
      return `${parent.firstName} ${parent.lastName}`;
    }

    // Database only field
    @Column()
    password: string;

    // Database only field
    @Column("bool", { default: false })
    confirmed: boolean;

}