import { DELETE, GET, Handler, Inject, PathVariable, POST, PUT, RequestBody, requiredParamsInFields, View } from '../../../main';
import { AccessHandler } from '../common/handlers';
import { AphorismController } from './aphorism.controller';
import { Aphorism, AphorismID, AphorismParamInsert } from './aphorism.model';

// create, remove, modify, take, search
// one, more

@View('aphorism')
@Handler(AccessHandler)
export class AphorismView {

  @Inject()
  private controller!: AphorismController;

  @POST()
  async create(
    @RequestBody() aphorism: AphorismParamInsert,
  ) {
    requiredParamsInFields(aphorism, ['author', 'content']);
    return this.controller.insertOne({
      author: aphorism.author,
      content: aphorism.content,
      date: new Date(),
    });
  }

  @DELETE(':id')
  async remove(@PathVariable('id') id: AphorismID) {
    return this.controller.deleteOneByID(+id);
  }

  @PUT(':id')
  async modify(
    @PathVariable('id') id: AphorismID,
    @RequestBody() aphorism: Aphorism,
  ) {
    const update: Pick<Aphorism, 'author' | 'content'> = {
      author: aphorism.author,
      content: aphorism.content,
    };
    return this.controller.updateOne(+id, update);
  }

  @GET(':id')
  async take(
    @PathVariable('id') id: AphorismID,
  ) {
    return this.controller.selectOneByID(+id);
  }

}
