import EventEmitter from 'eventemitter3';
import Pusher from 'pusher-js';
import Logger from './../lib/Logger';

class PusherStore extends EventEmitter {
  configure(key, options) {
    this.pusher = new Pusher(key, options);
  }

  isConfigured() {
    return !!this.pusher;
  }

  listen(channel) {
    Logger.info("[PusherStore] Listening to channel `" + channel + "`");

    this.pusher.subscribe(channel).bind_all((event, payload) => {
      Logger.info("[PusherStore]", event, payload);

      this.emit(event, payload);
    });
  }
}

export default new PusherStore()