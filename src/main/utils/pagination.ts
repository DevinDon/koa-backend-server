import { BaseEntity, MongoRepository } from 'typeorm';
import { ObjectId, PaginationParam } from '../interfaces';

export const getPagination = async<E extends BaseEntity & { _id: ObjectId }>(
  repo: MongoRepository<E>,
  { from, take }: Required<PaginationParam<string>>,
) => {
  const list = await repo.find({
    where: {
      _id: {
        $gte: new ObjectId(from),
      },
    },
    take: take + 1,
  });
  if (list.length === take + 1) {
    return { next: list[list.length - 1]._id.toHexString(), list: list.slice(0, take) };
  }
  return { list };
};
