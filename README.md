# UdaciRacer Intermediate Javascript Project

## Table of Contents

* [Getting Started](#getting-started)
* [Server](#server)
* [Client](#client)


## Getting Started <a name="getting-started"></a>

First clone this github project: `git clone https://github.com/edrondsal/udaciracer-project-nanodegree.git`

Install dependencies: `npm install`

Finally start the express server: `npm run start`

Now the web app is available in the localhost:  `localhost:3000`

The bin server need also to be run

To run the server, locate your operating system and run the associated command in your terminal at the root of the project.

| Your OS               | Command to start the API                                  |
| --------------------- | --------------------------------------------------------- |
| Mac                   | `ORIGIN_ALLOWED=http://localhost:3000 ./bin/server-osx`   |
| Windows               | `ORIGIN_ALLOWED=http://localhost:3000 ./bin/server.exe`   |
| Linux (Ubuntu, etc..) | `ORIGIN_ALLOWED=http://localhost:3000 ./bin/server-linux` |

If you are on an older OS and the above command doesn't run for you - or if you know that you are running a 32bit system - add `-32` to the end of the file name. For reference, here are the same commands but for a 32-bit system.

| 32 Bit Systems Only!  | Command to start the API                                     |
| --------------------- | ------------------------------------------------------------ |
| Mac                   | `ORIGIN_ALLOWED=http://localhost:3000 ./bin/server-osx-32`   |
| Windows               | `ORIGIN_ALLOWED=http://localhost:3000 ./bin/server-32.exe`   |
| Linux (Ubuntu, etc..) | `ORIGIN_ALLOWED=http://localhost:3000 ./bin/server-linux-32` |

In Windows please use the GIT Bash to launch the command defined above


## Server <a name="server"></a>

The server is provided as black box. Nothing have been added or changed to this.

## Client <a name="client"></a>

The client have been completed with the TODO missing code.

Also, some functions were added:

* `updateStore(state,object)`: In order to update the store as a immutable
* `renderNetworkError()`: In order to render a UI in case of problem with the server

Finally, a little improvement have been done to the function: `setupClickHandlers()`:

This is something that I also experience when realizing Mars Rovers Dashboard Project, when having only one `Event Click Listener` for the Cards types of UI this can have some issues because the cards have most of the time many childrens,and the target click will be then one of the children and not the real item we wanted (the card).

In order to improve this I added this type of code:

```		
if ((!!target.parentElement && target.parentElement.matches('.card.podracer'))){
			handleSelectPodRacer(target.parentElement )
}
```
