import { Logger } from '../logger';

type ListenerCallback = (data: string | Record<string, any> | null) => void;

export interface PostmanEvents {
  /**
   * Add event listener on message when the event matches.
   */
  on: (type: string, callback: ListenerCallback) => void;
  /**
   * Add event listener on message and execute only once when event matches.
   */
  one: (type: string, callback: ListenerCallback, flush: boolean) => void;
  /**
   * Send a postMessage event to an iFrame. This is written specifically to how
   * freemius iFrames expects messages.
   *
   * @param type Type of message.
   * @param data Additional data.
   */
  post: (type: string, data: Record<string, any> | null) => void;
  /**
   * Destroy all attached listeners. Useful for event cleanup.
   */
  destroy: () => void;
}

export function postman(
  iFrame: HTMLIFrameElement,
  sourceUrl: string
): null | PostmanEvents {
  const target = iFrame.contentWindow;
  const targetUrl = iFrame.src;
  const callbacks: { [type: string]: ListenerCallback[] } = {};

  if (!target || !targetUrl) {
    return null;
  }

  // add the primary event listener
  const listener = function (event: MessageEvent<any>) {
    // skip if coming from stripe or paypal
    if (
      (event && event.origin && event.origin.indexOf('js.stripe.com') > 0) ||
      event.origin.indexOf('www.paypal.com') > 0
    ) {
      return;
    }

    // if event is not coming from the target iFrame, then don't do anything
    if (event.origin !== sourceUrl) {
      return;
    }

    // if this is a proper message coming from freemius then it will have a
    // JSON encoded data string
    if (
      event &&
      event.data &&
      typeof event.data === 'string' &&
      event.data.charAt(0) === '{'
    ) {
      try {
        const parsedData = JSON.parse(event.data);
        if (
          typeof parsedData === 'object' &&
          parsedData.type &&
          callbacks[parsedData.type]
        ) {
          callbacks[parsedData.type].forEach((cb) => {
            cb(parsedData.data);
          });
        }
      } catch (e) {
        Logger.Error(e);
      }
    }
  };
  window.addEventListener('message', listener);

  return {
    on(type, callback) {
      if (!callbacks[type]) {
        callbacks[type] = [];
      }
      callbacks[type].push(callback);
    },
    one(type, callback, flush) {
      if (flush === true) {
        delete callbacks[type];
      }
      if (callbacks[type]) {
        return;
      }
      this.on(type, callback);
    },
    destroy() {
      window.removeEventListener('message', listener);
    },
    post(type, data) {
      target.postMessage(
        JSON.stringify({ type, data }),
        targetUrl.replace(/([^:]+:\/\/[^/]+).*/, '$1')
      );
    },
  };
}
