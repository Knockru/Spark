# Spark

![GitHub](https://img.shields.io/github/license/Knockru/Spark.svg?style=flat-square)
![CircleCI](https://img.shields.io/circleci/build/github/Knockru/Spark.svg?style=flat-square)

Spark will delete all tweets posted yesterday.

## Information

| Key      | Value                   |
| -------- | ----------------------- |
| Trigger  | Timer                   |
| Schedule | 13:30 (GMT) on everyday |

## Environment Variables

| Variable                     | Description                    | Example      |
| ---------------------------- | ------------------------------ | ------------ |
| `SPARK_AZURE_KEY_VAULT_NAME` | Azure Key Vault Container Name | `container`  |
| `AZURE_CLIENT_ID`            | Azure AD Application Client ID | `xxxxxx-...` |
| `AZURE_CLIEN_SECRET`         | Azure AD Application Secret    | `xxxxxx`     |
| `AZURE_TENANT_ID`            | Azure AD Tenant ID             | `xxxxxx-...` |

## Key Vault Secrets

| Secret                          | Description                            |
| ------------------------------- | -------------------------------------- |
| `SparkTwitterConsumerKey`       | Twitter Application Consumer Key       |
| `SparkTwitterConsumerSecret`    | Twitter Application Consumer Secret    |
| `SparkTwitterAccessToken`       | Twitter Authorized Access Token        |
| `SparkTwitterAccessTokenSecret` | Twitter Authorized Access Token Secret |

