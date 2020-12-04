import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm';
import { Controller, GET, Inject, PathVariable, Rester, View } from '../../main';

@Entity('test')
class TestEntity extends BaseEntity {

  @ObjectIdColumn()
  _id!: string;

  @Column()
  content!: string;

}

@Controller()
class DemoController {

  init() {
    // eslint-disable-next-line no-console
    console.log('I\'m OK!');
  }

  echo(text: string) {
    return text;
  }

}

@View()
class DemoView {

  @Inject() private controller!: DemoController;

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

  @GET('echo/:text')
  echo(
    @PathVariable('text') text: string = ''
  ) {
    return this.controller.echo(text);
  }

}

const server = new Rester()
  // .configDatabases.setEntities([TestEntity]).setEntities([TestEntity], 'mongo').end()
  .configAddress.setHost('0.0.0.0').end()
  .configViews.add(DemoView).end()
  .listen();
