tb.namespace('app.WebSockets').set(

    (function () {
        var $ = tb.dom;

        function WebSockets() {
            var that = this;

            that.handlers = {
                init: init
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

        function init() {
			this.render();
		}
		
        function render() {
            var that = this;

            console.log('body::render', that.target);

            template = tb.require.get('/app/WebSockets.html').trim();

            $(that.target).append($(template)).clean();

            $('.openButton').on(
                'click',
                function openSocket(ev) {
					console.log('WebSockets::render');
                    if (!that['websocket']) {
                        that.websocket = tb.webSocket(
                            'ws://127.0.0.1:8000/echo'
                        ).on(
                            'open',
                            function(ev) {
                                console.log('connection established', ev);
                            }
                        ).on(
                            'close',
                            function(ev) {
                                console.log('connection closed', ev);
                            }
                        ).on(
                            'error',
                            function(ev) {
                                console.error('connection error', ev);
                            }
                        ).on(
                            'message',
                            function(pMessage) {
                                $('.outputContainer')
                                    .append('<p>'+pMessage.data+'</p>');
                            }
                        );
                    }
					console.log('WebSockets::render done', that.websocket);
					ev.preventDefault();
                }
            );

            $('.closeButton').on(
                'click',
                function(ev) {
                    if (!!that['websocket']) {
                        that.websocket.close();
                    }
					ev.preventDefault();
                }
            );

            $('.sendButton').on(
                'click',
                function(ev) {
                    if (!!that['websocket']) {
						
                        that.websocket.send(
                            $('input', that.target)[0].value
                        );
                    }
					ev.preventDefault();
                }
            );

        }

    })()
);
