package watchMessage

import (
	"context"
	"regexp"
	"sync"

	"github.com/rs/zerolog"
	"github.com/skyisboss/cli/internal/bus"
	"github.com/skyisboss/cli/internal/ioc"
)

type EventHandler struct {
	ioc    *ioc.Container
	logger *zerolog.Logger
	mu     sync.Mutex
}

func New(logger *zerolog.Logger, ioc *ioc.Container) *EventHandler {
	log := logger.With().Str("channel", "watch_consumer").Logger()

	return &EventHandler{
		logger: &log,
		ioc:    ioc,
		mu:     sync.Mutex{},
	}
}

func (h *EventHandler) Consumers() map[bus.Topic][]bus.Consumer {
	return map[bus.Topic][]bus.Consumer{
		bus.TopicOnMessage: {
			// 处理消息过滤，匹配监听内容
			h.handleMessage,
		},
		// bus.TopicUpdateWatch: {h.handleUpdateTask},
	}
}

type KeywordRow struct {
	TaskID   int
	Client   string
	Channels map[int]struct{}
	Keywords []string
	Regex    *regexp.Regexp // 存储预编译的正则表达式
}

type MessaageItem struct {
	// 消息来自哪个客户端
	Client string
	// 消息来自哪个频道
	Channel int
	// 消息内容
	Content string
}

// 处理消息匹配关键词
func (h *EventHandler) handleMessage(ctx context.Context, msg bus.Message) error {
	return nil
}
