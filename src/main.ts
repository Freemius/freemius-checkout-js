import Checkout from './lib/checkout';

import './style.css';

const fsCheckout = new Checkout({
	plugin_id: Number.parseInt(
		(import.meta.env.VITE_PLUGIN_ID as string) ?? '0',
		10
	),
	public_key: import.meta.env.VITE_PUBLIC_KEY as string,
	sandbox: {
		ctx: import.meta.env.VITE_SANDBOX_CTX as string,
		token: import.meta.env.VITE_SANDBOX_TOKEN as string,
	},
});

document.addEventListener('DOMContentLoaded', () => {
	document.querySelector('#plan-1')?.addEventListener('click', e => {
		e.preventDefault();
		fsCheckout.open({
			plan_id: 5714,
			billing_cycle: 'monthly',
		});
	});
});
