export type Envs =
  | "AZURE_CLIENT_ID"
  | "AZURE_CLIEN_SECRET"
  | "AZURE_TENANT_ID"
  | "SPARK_AZURE_KEY_VAULT_NAME"
  | "SPARK_DRY_RUN"
  | "SPARK_TWITTER_CONSUMER_KEY"
  | "SPARK_TWITTER_CONSUMER_SECRET"
  | "SPARK_TWITTER_ACCESS_TOKEN"
  | "SPARK_TWITTER_ACCESS_TOKEN_SECRET";

export namespace TwitterResponse {
  export type Status = {
    created_at: string;
    id_str: string;
  };
}
