# Spark

![GitHub](https://img.shields.io/github/license/Knockru/Spark.svg?style=flat-square)
![CircleCI](https://img.shields.io/circleci/build/github/Knockru/Spark.svg?style=flat-square)

Spark will delete all tweets posted yesterday.

## Information

| Key      | Value                   |
| -------- | ----------------------- |
| Trigger  | Timer                   |
| Schedule | 15:30 (GMT) on everyday |

## Environment Variables

If you set the following variables to Azure Key Vaults, use the value of the variable name corrected to the pascal case.  
Example: `SPARK_TWITTER_ACCESS_TOKEN` is `SparkTwitterAccessToken`.


| Variable                            | Description                                     | Example      |
| ----------------------------------- | ----------------------------------------------- | ------------ |
| `AZURE_CLIENT_ID`                   | Azure AD Application Client ID                  | `xxxxxx-...` |
| `AZURE_CLIENT_SECRET`               | Azure AD Application Secret                     | `xxxxxx`     |
| `AZURE_TENANT_ID`                   | Azure AD Tenant ID                              | `xxxxxx-...` |
| `SPARK_AZURE_KEY_VAULT_NAME`        | Azure Key Vault Container Name                  | `container`  |
| `SPARK_DRY_RUN`                     | Set to `true`, delete operation will be dry-run | `1`          |
| `SPARK_TIME_DIFFERENCE`             | Time Difference between London                  | `+0900`      |
| `SPARK_TWITTER_ACCESS_TOKEN`        | Twitter Authorized Access Token                 | `xxxxxx`     |
| `SPARK_TWITTER_ACCESS_TOKEN_SECRET` | Twitter Authorized Access Token Secret          | `xxxxxx...`  |
| `SPARK_TWITTER_CONSUMER_KEY`        | Twitter Application Consumer Key                | `xxxxxx`     |
| `SPARK_TWITTER_CONSUMER_SECRET`     | Twitter Application Consumer Secret             | `xxxxxx`     |
