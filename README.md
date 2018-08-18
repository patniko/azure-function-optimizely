# azure-function-optimizely
Slack bot that enables Optimizely support. Request a list of running experiments along with current details on how well your variants are performing.

# Development Setup
1. Create a new Slack app with bot privileges.
2. Fork this repository and hook it to an Azure Function deployment configuration.
3. Create a `local.settings.json` file with a similar configuration as below.
```
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "OPTIMIZELY_TOKEN": "[Your Optimizely access token]",
    "OPTIMIZELY_PROJECT": "[Optimizely integer project identifier",
    "SLACK_TOKEN": "[Slack bot token]"
  }
}
```
4. Start debugger in VS Code and use `ngrok http 7071` to pass through traffic locally.
5. Add a new command to your Slack App called `/experiment` pointed to your `ngrok` public address.
