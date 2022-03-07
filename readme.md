
- [Modules](#modules)
  - [WebServer](#webserver)
  - [API](#api)
  - [StaticServer](#staticserver)
  - [Yeelight](#yeelight)
  - [GitSync](#gitsync)


<a name="modules"></a>

## Modules

<a name="web-server"></a>

### WebServer
This module is a base for all webcontent.

<a name="api"></a>

### API
This module adds API functionality. Make sure you added the endpoints in [API](api/readme.md)
Submodule of [WebServer](#WebServer)

<a name="staticserver"></a>

### StaticServer
This module serves static file for for example a website.
Submodule of [WebServer](#WebServer)

<a name="yeelight"></a>

### Yeelight
This module makes sure your yeelight light turn on when the app/docker-container starts. It will also turn off your light if the app/docker-container is terminated.

<a name="gitsync"></a>

### GitSync
This module clones/pulls your github repositories. When configuring this module make sure to add a file `data/auth.json` containing the following: 
```json
{
    "github_pat": "<your_github_personal_access_token>"
}
```
Also, in the .env file you need to update `HOST_GITHUB_FOLDER` to the desired github download folder.
