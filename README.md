

## Description

This application demonstrates a process where user bill data is generated, sent to an Azure Event Hub, and then routed to different Service Bus queues based on specific criteria. Subsequently, the application listens to these queues, retrieves the messages, and stores them in a MongoDB database for further processing and analysis.

## Installation

```bash
$ npm install
#add your you settings for your .env file 
EVENT_HUB_CONNECTION 
EVENT_HUB_CONSUMER_CONNECTION
EVENT_HUB_NAME
EVENT_HUB_GROUP = # $Default
EVENT_SERVICE_BUS
EVENT_HUB_QUEUE_NAME1
EVENT_HUB_QUEUE_NAME2
MONGODB_CONNECTION
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
