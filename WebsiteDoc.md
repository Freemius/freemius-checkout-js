Here’s a simple example of the checkout code will look like for a plan that
offers 3 multi-site prices:

```html
<select id="licenses">
    <option value="1" selected="selected">Single Site License</option>
    <option value="5">5-Site License</option>
    <option value="25">25-Site License</option>
</select>

<button id="purchase">Buy Button</button>

<script src="https://checkout.freemius.com/js/v2/"></script>
<script>
    const handler = new FS.Checkout({
        plugin_id: '<productID>',
        plan_id: '<planID>',
        public_key: '<productPublicKey>',
        image: 'https://your-plugin-site.com/logo-100x100.png',
    });

    document.querySelector('#purchase').addEventListener('click', function (e) {
        handler.open({
            name: '<productTitle>',
            licenses: $('#licenses').val(),
            // You can consume the response for after purchase logic.
            success: function (response) {
                // alert(response.user.email);
            },
        });
        e.preventDefault();
    });
</script>
```

For more information about the JS SDK, and to use it with NPM, please refer to
our
[official GitHub repository](https://github.com/Freemius/freemius-checkout-js).
