import type {
  CreateParams,
  DataProvider,
  DeleteParams,
  GetListParams,
  GetManyParams,
  GetManyReferenceParams,
  GetOneParams,
  Identifier,
  QueryFunctionContext,
  RaRecord,
  UpdateParams,
} from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

type MongoRecord = RaRecord & { _id: Identifier };

// Records coming back from the API use Mongo's "_id" as their primary key.
// React Admin requires every record to have an "id" field, so this maps
// "_id" -> "id" on every response coming out of the underlying REST provider.
// See https://marmelab.com/react-admin/FAQ.html#can-i-have-custom-identifiersprimary-keys-for-my-resources
const toRaRecord = (record: MongoRecord): RaRecord => ({
  ...record,
  id: record._id,
});

export const createMongoIdDataProvider = (apiBase: string): DataProvider => {
  const baseProvider = simpleRestProvider(apiBase);

  const provider = {
    ...baseProvider,
    getList: (resource: string, params: GetListParams & QueryFunctionContext) =>
      baseProvider.getList<MongoRecord>(resource, params).then((response) => ({
        ...response,
        data: response.data.map(toRaRecord),
      })),
    getOne: (resource: string, params: GetOneParams & QueryFunctionContext) =>
      baseProvider.getOne<MongoRecord>(resource, params).then((response) => ({
        ...response,
        data: toRaRecord(response.data),
      })),
    getMany: (resource: string, params: GetManyParams & QueryFunctionContext) =>
      baseProvider.getMany<MongoRecord>(resource, params).then((response) => ({
        ...response,
        data: response.data.map(toRaRecord),
      })),
    getManyReference: (resource: string, params: GetManyReferenceParams & QueryFunctionContext) =>
      baseProvider.getManyReference<MongoRecord>(resource, params).then((response) => ({
        ...response,
        data: response.data.map(toRaRecord),
      })),
    create: (resource: string, params: CreateParams) =>
      baseProvider.create<MongoRecord>(resource, params).then((response) => ({
        ...response,
        data: toRaRecord(response.data),
      })),
    update: (resource: string, params: UpdateParams) =>
      baseProvider.update<MongoRecord>(resource, params).then((response) => ({
        ...response,
        data: toRaRecord(response.data),
      })),
    delete: (resource: string, params: DeleteParams) =>
      baseProvider.delete<MongoRecord>(resource, params).then((response) => ({
        ...response,
        data: toRaRecord(response.data),
      })),
  };

  return provider as unknown as DataProvider;
};
