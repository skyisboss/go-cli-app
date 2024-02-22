package ioc

import (
	"context"
	"sync"

	"github.com/rs/zerolog"
	"github.com/skyisboss/cli/internal/bus"
	"github.com/skyisboss/cli/internal/config"
	"github.com/skyisboss/cli/internal/db"
	"github.com/skyisboss/cli/internal/models/user"
)

type Container struct {
	ctx         context.Context
	config      *config.Config
	once        map[string]*sync.Once
	logger      *zerolog.Logger
	eventBus    *bus.PubSub
	dbClient    *db.Connection
	userService *user.Service
}

func (c *Container) init(key string, fn func()) {
	if c.once[key] == nil {
		c.once[key] = &sync.Once{}
	}

	c.once[key].Do(fn)
}

func New(ctx context.Context, cfg *config.Config, logger *zerolog.Logger) *Container {
	return &Container{
		config: cfg,
		ctx:    ctx,
		logger: logger,
		once:   make(map[string]*sync.Once, 128),
	}
}

func (c *Container) Config() *config.Config {
	return c.config
}

func (ioc *Container) EventBus() *bus.PubSub {
	ioc.init("event.bus", func() {
		ioc.eventBus = bus.NewPubSub(ioc.ctx, true, ioc.logger)
	})

	return ioc.eventBus
}

func (ioc *Container) DbService() *db.Connection {
	ioc.init("db-client", func() {
		db, err := db.New(ioc.ctx, ioc.config, ioc.logger)
		if err != nil {
			ioc.logger.Fatal().Err(err).Msg("unable to open database")
			return
		}

		ioc.dbClient = db
		// graceful.AddCallback(db.Shutdown)
	})
	return ioc.dbClient
}

func (ioc *Container) UserService() *user.Service {
	ioc.init("user.service", func() {
		db := ioc.DbService()
		log := ioc.logger
		ioc.userService = user.New(db, log)
	})
	return ioc.userService
}
