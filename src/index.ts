// eslint-disable-next-line import/no-unresolved
import { Context } from "@azure/functions";
import { EnvironmentCredential } from "@azure/identity";
import LookEnv, { AzureIdentity, LocalIdentity } from "@mikazuki/lookenv";
import Twitter from "twitter";

import { isTooPast, isYesterday } from "./date";
import { Variables } from "./types";

const DEFAULT_VARIABLES = {
  WEBSITE_TIME_ZONE: "GMT Standard Time" // Europe/London
};

function verifyCredentials(twitter: Twitter): Promise<Twitter.ResponseData> {
  return twitter.get("account/verify_credentials", {});
}

function getStatuses(twitter: Twitter, params: Twitter.RequestParams): Promise<Twitter.ResponseData> {
  return twitter.get("statuses/user_timeline", params);
}

async function collectStatuses(env: LookEnv<Variables>, twitter: Twitter, userId: string): Promise<string[]> {
  const timezone = await env.get("WEBSITE_TIME_ZONE");
  const ids: string[] = [];
  const params: any = { count: 200, include_rts: true, trim_user: true, user_id: userId };
  let maxId: string = "";

  for (let i = 0; i < 3200 / 200; i += 1) {
    if (maxId) params.max_id = maxId;

    // eslint-disable-next-line no-await-in-loop
    const statuses = (await getStatuses(twitter, params)) as any[];

    // eslint-disable-next-line no-restricted-syntax
    for (const status of statuses) {
      if (isTooPast(status.created_at, timezone)) return ids;

      if (isYesterday(status.created_at, timezone)) ids.push(status.id_str);

      maxId = status.id_str;
    }
  }

  return ids;
}

async function deleteStatus(env: LookEnv<Variables>, ctx: Context, twitter: Twitter, statusId: string): Promise<void | Twitter.ResponseData> {
  const isDryRun = !!(await env.get("SPARK_DRY_RUN"));

  ctx.log.info(`Deleted tweet ${statusId}${isDryRun ? " (dry-run)" : ""}`);
  return isDryRun ? Promise.resolve() : twitter.post(`statuses/destroy/${statusId}`);
}

export async function run(context: Context, timer: any): Promise<void> {
  if (timer.IsPastDue) return; //

  const azure = new AzureIdentity(process.env.SPARK_AZURE_KEY_VAULT_NAME, new EnvironmentCredential());
  const local = new LocalIdentity(DEFAULT_VARIABLES); // Fallback Value for Time Zone
  const env = new LookEnv<Variables>(azure, local);

  const twitter = new Twitter({
    consumer_key: await env.get("SPARK_TWITTER_CONSUMER_KEY"),
    consumer_secret: await env.get("SPARK_TWITTER_CONSUMER_SECRET"),
    access_token_key: await env.get("SPARK_TWITTER_ACCESS_TOKEN"),
    access_token_secret: await env.get("SPARK_TWITTER_ACCESS_TOKEN_SECRET")
  });

  try {
    const account = await verifyCredentials(twitter);
    if (account === null) {
      context.log.warn("Invalid Credentials");
      return;
    }

    const userId = account.user_id as string;
    const ids = await collectStatuses(env, twitter, userId);
    const tasks: Promise<void | Twitter.ResponseData>[] = [];

    ids.forEach(id => tasks.push(deleteStatus(env, context, twitter, id)));

    await Promise.all(tasks);
  } catch (e) {
    context.log.error(e);
  }
}
