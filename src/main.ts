import Checkout, { CheckoutOptions } from './lib/checkout';

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
	function getLicensesAndFrequency() {
		let licenses = 1;
		const siteSelect = document.querySelector('#site');
		if (siteSelect) {
			licenses = Number.parseInt((siteSelect as HTMLSelectElement).value, 10);
		}
		let billing_cycle: CheckoutOptions['billing_cycle'] = 'annual';
		const freqSelect = document.querySelector('#frequency');
		if (freqSelect) {
			billing_cycle = (freqSelect as HTMLSelectElement).value as any;
		}
		return { licenses, billing_cycle };
	}
	document.querySelector('#plan-1')?.addEventListener('click', e => {
		e.preventDefault();
		fsCheckout.open({
			plan_id: Number.parseInt(import.meta.env.VITE_PLAN_ONE as string, 10),
			...getLicensesAndFrequency(),
			cancel() {
				console.log('cancel');
			},
			purchaseCompleted(data) {
				console.log('purchaseCompleted', data);
			},
			success(data) {
				console.log('success', data);
			},
			track(event, data) {
				console.log('track', event, data);
			},
			afterOpen() {
				console.log('afterOpen');
			},
			afterClose() {
				console.log('afterClose');
			},
			onExitIntent() {
				console.log('exitIntent');
			},
		});
	});
	document.querySelector('#plan-2')?.addEventListener('click', e => {
		e.preventDefault();
		fsCheckout.open({
			plan_id: Number.parseInt(import.meta.env.VITE_PLAN_TWO as string, 10),
			...getLicensesAndFrequency(),
		});
	});
	document.querySelector('#plan-3')?.addEventListener('click', e => {
		e.preventDefault();
		fsCheckout.open({
			plan_id: Number.parseInt(import.meta.env.VITE_PLAN_THREE as string, 10),
			...getLicensesAndFrequency(),
		});
	});
	console.log(
		'%cCheckout API available as %cfsCheckout%c global variable',
		'font-size: 20px; ',
		'font-size: 20px; background-color: red; color: white;',
		'font-size: 20px; background-color: transparent; '
	);
	(window as any).fsCheckout = fsCheckout;
});
