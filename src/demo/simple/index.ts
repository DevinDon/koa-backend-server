import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm';
import { GET, PathVariable, Rester, View } from '../../main';

@Entity('test')
class TestEntity extends BaseEntity {

  @ObjectIdColumn()
  _id!: string;

  @Column()
  content!: string;

}

@View()
class DemoView {

  @GET()
  index() {
    return TestEntity.insert({ content: Date.now().toString() });
  }

  @GET(':name')
  returnName(
    @PathVariable('name') name: string
  ) {
    return { name };
  }

}

const server = new Rester()
  // .configDatabases.setEntities([TestEntity]).setEntities([TestEntity], 'mongo').end()
  .configAddress.setHost('0.0.0.0').end()
  .configViews.add(DemoView).end()
  .listen();
