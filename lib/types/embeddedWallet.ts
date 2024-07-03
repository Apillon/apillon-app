declare global {
  type Environment = 'development' | 'production';

  interface EwApiKeyInterface extends BaseObjectInterface {
    secret: string;
    name: string;
    env: Environment;
    created: Date;
    usage: string;
  }

  interface EwApiKeyResponse extends GeneralResponse<EwApiKeyInterface> {}
}
