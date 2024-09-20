This is an Angular library for using the Changelog service Headway, as a simple directive.
It's a simple wrapper for the [Headway API]("https://docs.headwayapp.co/widget").

# Usage

1. Make sure to provide your account ID for the library to work.

This is done in providing the HEADWAY_ACCOUNT_TOKEN provider. I recommend setting the value in your environment. Here's how the implementation could look in `app.config.ts`:

```
 providers: [
    ...
    {
      provide: HEADWAY_ACCOUNT_TOKEN,
      useValue: environment.headwayAccountId, // Provide the account from your environment file
    },
  ],
```

2. To use this library, simply find the intended location, and create any html element where you want to render the badge and provide the directive `headwayBadge`
3. That's it!

As the need unfolds I will add more features.
