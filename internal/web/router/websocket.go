package router

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/skyisboss/cli/internal/models/user"
	"nhooyr.io/websocket"
)

var (
	roomMu sync.Mutex
	Rooms  = make(map[string]*Room)
)

// Room 结构表示一个房间
type Room struct {
	ID      string
	Members map[*websocket.Conn]bool
	mu      sync.Mutex
}

// NewRoom 创建一个新的房间
func NewRoom(id string) *Room {
	return &Room{
		ID:      id,
		Members: make(map[*websocket.Conn]bool),
	}
}

// Join 将用户加入房间
func (r *Room) Join(conn *websocket.Conn) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.Members[conn] = true
	fmt.Println("room size", len(Rooms))
	fmt.Println("member size", len(r.Members))
}

// Leave 将用户从房间移除
func (r *Room) Leave(conn *websocket.Conn) {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.Members, conn)
	conn.Close(websocket.StatusInternalError, "WebSocket closed")
	fmt.Println("room size", len(Rooms))
	fmt.Println("member size", len(r.Members))
}

// Broadcast 向房间广播消息
func (r *Room) Broadcast(ctx context.Context, msgType websocket.MessageType, message []byte) {
	r.mu.Lock()
	defer r.mu.Unlock()
	for conn := range r.Members {
		err := conn.Write(ctx, msgType, message)
		if err != nil {
			log.Println("Error broadcasting message:", err)
		}
	}
}

// WebSocketHandler 处理 WebSocket 连接
func WebSocketHandler(w http.ResponseWriter, r *http.Request, userService *user.Service) {
	// key := r.URL.Query().Get("key")
	// md5Regex := regexp.MustCompile(`^[0-9a-fA-F]{32}$`)
	// if key == "" || !md5Regex.MatchString(key) {
	// 	w.WriteHeader(http.StatusNotFound)
	// 	return
	// }
	// data, _ := userService.GetByToken(key)
	// if data.Token != key {
	// 	w.WriteHeader(http.StatusNotFound)
	// 	return
	// }

	fmt.Println("start ws")
	// 升级 HTTP 连接为 WebSocket 连接
	conn, err := websocket.Accept(w, r, &websocket.AcceptOptions{InsecureSkipVerify: true})
	if err != nil {
		log.Println("Error during WebSocket handshake:", err)
		return
	}
	defer conn.Close(websocket.StatusInternalError, "WebSocket closed")

	// 获取房间标识符
	roomID := r.URL.Query().Get("room")

	// 创建或获取房间
	room := GetOrCreateRoom(roomID)

	// 将用户加入房间
	room.Join(conn)
	defer room.Leave(conn)

	for {
		// 读取消息
		msgType, p, err := conn.Read(r.Context())
		if err != nil {
			log.Println("Error reading WebSocket message:", err)
			return
		}

		// 广播消息到房间
		room.Broadcast(r.Context(), msgType, p)
	}
}

// GetOrCreateRoom 获取或创建指定标识符的房间
func GetOrCreateRoom(id string) *Room {
	roomMu.Lock()
	defer roomMu.Unlock()

	if room, ok := Rooms[id]; ok {
		return room
	}

	room := NewRoom(id)
	Rooms[id] = room
	return room
}
