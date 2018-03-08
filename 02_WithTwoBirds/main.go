package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/googollee/go-socket.io"
	"github.com/gorilla/websocket"
	"github.com/rs/cors"
)

const theURL = "127.0.0.1:9000"

var upgrader = websocket.Upgrader{} // use default options

func echo(w http.ResponseWriter, r *http.Request) {
	fmt.Println("request 1")

	fmt.Println("request header: ", r.Header)

	body, _ := ioutil.ReadAll(r.Body)

	fmt.Println("body: ", body)

	webSocketHandle, err := upgrader.Upgrade(w, r, nil)

	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	defer webSocketHandle.Close()

	fmt.Println("request 2")

	for {
		msgType, message, err := webSocketHandle.ReadMessage()
		if err != nil {
			log.Println("read msgType error:", err)
			break
		}
		log.Printf("recv: %s", message)

		fmt.Println("request 3")

		err = webSocketHandle.WriteMessage(msgType, message)
		if err != nil {
			log.Println("write:", err)
			break
		}

		fmt.Println("request 4")
	}
}

func serveStatic(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, r.URL.Path[1:])
}

func main() {

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
	})

	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal(err)
	}

	server.On("connection", func(so socketio.Socket) {
		log.Println("on connection")
		so.Join("chat")
		so.On("chat message", func(msg string) {
			log.Println("emit:", so.Emit("chat message", msg))
			so.BroadcastTo("chat", "chat message", msg)
		})
		so.On("disconnection", func() {
			log.Println("on disconnect")
		})
	})

	server.On("error", func(so socketio.Socket, err error) {
		log.Println("error:", err)
	})

	http.Handle("/echo", c.Handler(server))
	http.HandleFunc("/", serveStatic)

	log.Println("Serving at localhost:8000...")
	log.Fatal(http.ListenAndServe(":8000", nil))

	//http.HandleFunc("/echo", echo)
	//http.HandleFunc("/", serveStatic)
	//log.Fatal(http.ListenAndServe(theURL, nil))
}
