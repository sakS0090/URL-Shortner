url-shortener/
├── src/
│   ├── config/          # DB connections (Mongoose & SQL)
│   ├── controllers/     # Route logic (Auth, URL generation, Redirects)
│   ├── models/          # MongoDB Mongoose Schemas & SQL table definitions
│   ├── middlewares/     # JWT Auth, Rate-limiter, Error handler
│   ├── utils/           # Base62 encoder/decoder logic
│   ├── routes/          # API Route definitions
│   └── app.js           # Express app setup & middleware injection
└── server.js            # App listener entry point

##################################################################################


                  ┌────────────────────────────────────────┐
                  │          Client / UI Router            │
                  └───────────────────┬────────────────────┘
                                      │
                                      ▼
                  ┌────────────────────────────────────────┐
                  │    Express.js API Gateway / Router     │
                  └───────────────────┬────────────────────┘
                                      │
                   [Apply: Custom JWT Auth & Express-Rate-Limit]
                                      │
                                      ▼
                          Is Short URL Cached?
                                     / \
                                    /   \
                               Yes /     \ No
                                  /       \
                                 ▼         ▼
                      ┌──────────────┐   ┌──────────────────────────────┐
                      │ Redis Cache  │   │     MongoDB Database         │
                      │  (O(1) Read) │   │ (Stores Long URL + Metadata) │
                      └──────────────┘   └──────────────┬───────────────┘
                                                        │
                                           [Populate Cache for Next Time]
                                                        │
                                                        ▼
                                         ┌──────────────────────────────┐
                                         │   Relational Analytics DB    │
                                         │ (SQL table tracking clicks)  │
                                         └──────────────────────────────┘




#######################################################################################################################


1.Using base62 encoding in order to avoid string collisions.

####################################################################################################################

Redis Implementation 

   [GET Route  /:shortCode Request]
                          │
                          ▼
               Check Redis Cache first
                        /   \
                       /     \
         [Cache Hit]  /       \ [Cache Miss]
                     /         \
                    ▼           ▼
            Return Long URL    Query MongoDB
         from Memory (O(1))     │
                                ▼
                            Save URL to Redis
                          (with Expiration/TTL)
                                │
                                ▼
                             Redirect