import { GET, Handler, Inject, PathQuery, View } from '../../../main';
import { AccessHandler } from '../common/handlers';
import { AphorismController } from './aphorism.controller';

// create, remove, modify, take, search
// one, more

@View('aphorisms')
@Handler(AccessHandler)
export class AphorismsView {

  @Inject()
  private controller!: AphorismController;

  @GET()
  async take(
    @PathQuery('random') random: boolean = false,
    @PathQuery('take') take: number = 10,
    @PathQuery('skip') skip: number = 0,
  ) {
    if (random) {
      return this.controller.selectManyByRandom(+take);
    }
    return this.controller.selectMany({ skip: +skip, take: +take });
  }

}
