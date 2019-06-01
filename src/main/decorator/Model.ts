// TODO: JSON schema like fastify
export interface BaseModel<T> {
  status: boolean;
  message: string;
  content: T;
}
