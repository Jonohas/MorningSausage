### Yeelight
This module makes sure your yeelight light turn on when the app/docker-container starts. It will also turn off your light if the app/docker-container is terminated.

### GitSync
This module clones/pulls your github repositories. When configuring this module make sure to add a file `data/auth.json` containing the following: 
```json
{
    "github_pat": "<your_github_personal_access_token>"
}
```
Also, in the .env file you need to update `HOST_GITHUB_FOLDER` to the desired github download folder.
