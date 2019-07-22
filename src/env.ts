import { EnvironmentCredential } from "@azure/identity";
import { SecretsClient } from "@azure/keyvault-secrets";

export class FunctionEnv<T extends string = string> {
  private readonly client: SecretsClient;

  public constructor(vault: string) {
    this.client = new SecretsClient(`https://${vault}.vault.azure.net`, new EnvironmentCredential());
  }

  public async get(name: T): Promise<string> {
    if (process.env[name]) {
      return process.env[name] as string;
    }

    const secret = await this.client.getSecret(this.pascalize(name));
    return secret.value;
  }

  public pascalize(str: string): string {
    if (!str.includes("_")) return str;

    return str
      .split("_")
      .map(w => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase())
      .join("");
  }
}
