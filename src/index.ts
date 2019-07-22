import { AzureFunction, Context } from "@azure/functions";
export const run: AzureFunction = async function(context: Context, timer: any): Promise<void> {
  if (timer.IsPastDue) return; //

};
