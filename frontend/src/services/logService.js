// import {init, captureException} from '@sentry/browser';

function initialize() {
    // init({
    //     dsn: "https://f1d1fe5d53a14ec3af4e62c3071a67b6@sentry.io/1329935"
    // });
}

function log(error) {
    // captureException(error);
    console.error(error)
}

export default {
    initialize,
    log
}
