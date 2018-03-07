package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

const theURL = "127.0.0.1:8000"

var upgrader = websocket.Upgrader{} // use default options

func echo(w http.ResponseWriter, r *http.Request) {

	webSocketHandle, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	defer webSocketHandle.Close()

	for {
		msgType, message, err := webSocketHandle.ReadMessage()
		if err != nil {
			log.Println("read:", err)
			break
		}
		log.Printf("recv: %s", message)

		err = webSocketHandle.WriteMessage(msgType, message)
		if err != nil {
			log.Println("write:", err)
			break
		}
	}
}

func serveStatic(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, r.URL.Path[1:])
}

func main() {
	http.HandleFunc("/echo", echo)
	http.HandleFunc("/", serveStatic)
	log.Fatal(http.ListenAndServe(theURL, nil))
}
