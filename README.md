# FREEMIUS CHECKOUT JAVASCRIPT CLIENT

Without jQuery or any other external dependency. (Still alpha and not yet
released).

## Testing

Close the repository. Copy `.env.sample` to `.env.local` and enter plugin id and
public key as specified in the file. Run the command

```bash
yarn dev
```

and it should spin up the server. Make sure to change the ID of plans in the
`.env.local` file.

## Testing with Sandbox

To get the sandbox token and ctx, follow the steps:

1. Make sure you are running the development mode of freemius with secret key in
   your local instance.
1. Go to the Upgrade page of your freemius plugin (make sure you are running the
   free version so you have access to the upgrade page.)
1. Click to upgrade to any plan. The goal is to access the checkout page from
   WordPress Admin.
1. Now view page source and search for the word `sandbox`.
1. You should find something like this string
   `sandbox=xxxxxxxx&s_ctx_ts=00000000`.

The value of `sandbox` is token and value of `s_ctx_ts` is ctx. So for the above
value, the configuration would look like

```js
const config = {
	// ...
	sandbox: {
		token: 'xxxxxxxx',
		ctx: '00000000',
	},
};
```

**NOTICE**: Use this only during development and never publish the token and
context. In this repository we use the `.env` file for storing sandbox data.
