tb.namespace('app.WebSockets').set(

    (function () {
        var $ = tb.dom;

        function WebSockets() {
            var that = this;

            that.handlers = {
                init: render.bind(that)
            }

        }

        WebSockets.prototype = {

            // run init() after we loaded these files
            'tb.Require': [
                '/app/WebSockets.html'
            ],

            render: render
        }

        return WebSockets;

        function render() {
            var that = this;

            console.log('body::render', that.target);

            template = tb.require.get('/app/WebSockets.html').trim();

            $(that.target).append($(template)).clean();

            $('.openButton').on(
                'click',
                function openSocket() {
                    if (!that['socket']) {
                        that.websocket = tb.webSocket(
                            'ws://127.0.0.1:8000/echo'
                        ).on(
                            'open',
                            function socketOpened(ev) {
                                console.log('connection established', ev);
                            }
                        ).on(
                            'close',
                            function socketClosed(ev) {
                                console.log('connection closed', ev);
                            }
                        ).on(
                            'error',
                            function socketError(ev) {
                                console.error('connection error', ev);
                            }
                        ).on(
                            'message',
                            function serverMessage(pMessage) {
                                $('outputContainer')
                                    .append(pMessage);
                            }
                        );
                    }
                }
            );

            $('.closeButton').on(
                'click',
                function closeSocket() {
                    if (!!that['websocket']) {
                        that.websocket.close();
                    }
                }
            );

            $('.sendButton').on(
                'click',
                function sendMessage() {
                    if (!!that['websocket']) {
                        that.websocket.send(
                            $('input', that.target).value()
                        );
                    }
                }
            );

        }

    })()
);
