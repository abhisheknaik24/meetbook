# Meetbook

![Meetbook](https://i.ibb.co/VQSTKcR/meetbook.png)

Meetbook is a meeting room scheduling application

## Prerequisites

**Node Version 18.x.x**

## Cloning the repository

```shell
git clone https://github.com/abhisheknaik24/meetbook.git
```

## Setup .env file

```js
NEXT_PUBLIC_API=
NEXT_PUBLIC_GOOGLE_API=
DATABASE_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CLIENT_SCOPE=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
```

## Update prisma schema path in package.json

### If MongoDB then

```js
"prisma": {
    "schema": "prisma/mongodb/schema.prisma"
}
```

### If MySQL then

```js
"prisma": {
    "schema": "prisma/mysql/schema.prisma"
}
```

## Start the app

```shell
docker compose up -d --build
```
