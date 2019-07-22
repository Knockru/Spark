import { AzureFunction, Context } from "@azure/functions";

import { FunctionEnv } from "./env";
import { Envs } from "./types";
import { Twtr } from "./twtr";

export const run: AzureFunction = async function(context: Context, timer: any): Promise<void> {
  if (timer.IsPastDue) return; //

  const env = new FunctionEnv<Envs>(process.env.SPARK_AZURE_KEY_VAULT_NAME);
  const twtr = new Twtr(
    await env.get("SPARK_TWITTER_CONSUMER_KEY"),
    await env.get("SPARK_TWITTER_CONSUMER_SECRET"),
    await env.get("SPARK_TWITTER_ACCESS_TOKEN"),
    await env.get("SPARK_TWITTER_ACCESS_TOKEN_SECRET")
  );

  const user_id = await twtr.verify();
  if (!user_id) return; // invalid credential

  const ids = await twtr.statuses({ count: 200, include_rts: true, trim_user: true, user_id });
  for (let id of ids) {
    if (process.env.SPARK_DRY_RUN) {
      context.log(`Deleting ${id} (dry-run)`);
    } else {
      await twtr.delete(id);
    }
  }
};
