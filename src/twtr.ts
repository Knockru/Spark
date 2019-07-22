import Twitter from "twitter";

import { isTooPast, isYesterday } from "./date";
import { TwitterResponse } from "./types";

export class Twtr {
  private readonly twtr: Twitter;

  public constructor(consumer_key: string, consumer_secret: string, access_token_key: string, access_token_secret: string) {
    this.twtr = new Twitter({
      consumer_key,
      consumer_secret,
      access_token_key,
      access_token_secret
    });
  }

  public async verify(): Promise<string> {
    try {
      const response = await this.twtr.get("account/verify_credentials", {});
      return response["id_str"] as string;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  public async statuses(params: {}): Promise<string[]> {
    const ids: string[] = [];
    let max_id: string = "";

    outer: for (let i = 0; i < 3200 / 200; i++) {
      if (max_id) params["max_id"] = max_id;

      const statuses = (await this.twtr.get("statuses/user_timeline", params)) as TwitterResponse.Status[];
      for (let status of statuses) {
        if (isTooPast(status.created_at)) {
          break outer;
        }

        if (isYesterday(status.created_at)) {
          ids.push(status.id_str);
        }

        max_id = status.id_str;
      }
    }

    return ids;
  }

  public async delete(id: string): Promise<boolean> {
    try {
      await this.twtr.post(`statuses/destroy/${id}`, {});
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
