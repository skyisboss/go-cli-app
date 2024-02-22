package db

import (
	"context"

	"github.com/pkg/errors"
	"github.com/rs/zerolog"
	"github.com/skyisboss/cli/internal/config"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Connection struct {
	Pool   *gorm.DB
	logger *zerolog.Logger
}

func New(ctx context.Context, cfg *config.Config, logger *zerolog.Logger) (*Connection, error) {
	db, err := gorm.Open(sqlite.Open("database.db"), &gorm.Config{
		// Logger: newLogger,
	})
	if err != nil {
		return nil, errors.Wrap(err, "无法连接数据库")
	}

	log := logger.With().Str("channel", "sqlite").Logger()

	connection := &Connection{
		Pool:   db.WithContext(ctx),
		logger: logger,
	}
	if cfg.Debug {
		connection.Pool = connection.Pool.Debug()
	}

	log.Info().Msg("connected to db")
	return connection, nil
}

func (c *Connection) Instance() *gorm.DB {
	return c.Pool
}

func (c *Connection) Shutdown() error {
	db, _ := c.Pool.DB()
	c.logger.Info().Msg("shutting down mysql connections")
	err := db.Close()
	return err
}
