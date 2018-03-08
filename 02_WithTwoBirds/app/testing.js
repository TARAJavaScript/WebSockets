if (typeof module === 'undefined' ){
    tb.webSocket = (function () {

        function WS( pConfig ){
            var that = this;

            that.config = pConfig;

            that.handlers = {
                'open': [],
                'message': [],
                'error': [],
                'close': []
            };

            that.socket = new WebSocket( // jshint ignore:line
                that.config.url, 
                that.config['protocols'] || undefined 
            );

            that.socket.onopen = function onOpen( ev ){
                that.trigger( 'open', ev );
            };
            
            that.socket.onerror = function onError( ev ){
                that.trigger( 'error', ev );
            };
            
            that.socket.onmessage = function onMessage( ev ){
                that.trigger( 'message', ev.data );
            };
            
            that.socket.onclose = function onClose( ev ){
                that.trigger( 'close', ev );
            };
            
        } 

        WS.prototype = {
            send: send,
            close: close
        };

        return function( pUrl, pProtocols ){
            return new tb( 
                WS, 
                { 
                    url: pUrl,
                    protocols: pProtocols
                }
            );
        };

        function send( pSend ){
            this.socket.send( pSend );
        }

        function close(){
            this.socket.close();
        }

    })();

}

