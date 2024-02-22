package app

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"github.com/robfig/cron/v3"
	"github.com/rs/zerolog"
	"github.com/skyisboss/cli/internal/bus"
	"github.com/skyisboss/cli/internal/config"
	watchMessage "github.com/skyisboss/cli/internal/event/watchMessage"
	"github.com/skyisboss/cli/internal/ioc"
	"github.com/skyisboss/cli/internal/logs"
	"github.com/skyisboss/cli/internal/web/router"
	"github.com/skyisboss/cli/ui"
)

type App struct {
	config    *config.Config
	ctx       context.Context
	logger    *zerolog.Logger
	services  *ioc.Container
	beforeRun []BeforeRun
}

var AppInstance *App

type BeforeRun func(ctx context.Context, app *App) error

func New(ctx context.Context, cfg *config.Config) *App {
	hostname, _ := os.Hostname()
	logger := logs.New(cfg.Logger, "cli", cfg.GitVersion, cfg.Env, hostname)
	services := ioc.New(ctx, cfg, &logger)

	AppInstance = &App{
		config:   cfg,
		ctx:      ctx,
		logger:   &logger,
		services: services,
	}

	return AppInstance
}

func (app *App) OnBeforeRun(fn BeforeRun) {
	app.beforeRun = append(app.beforeRun, fn)
}

func (app *App) Ioc() *ioc.Container {
	return app.services
}

func (app *App) Logger() *zerolog.Logger {
	return app.logger
}

// 事件总线，这里写各种消费者事件
func (app *App) initEvents() {
	registerExit(app.services)
	crontab := cron.New(cron.WithLocation(time.UTC), cron.WithSeconds())
	crontab.Start()

	handlers := []bus.Handler{
		watchMessage.New(app.logger, app.services),
		// onmessageevent.New(app.logger),
		// userevents.New(
		// 	app.config.Env,
		// 	app.config.Notifications.SlackWebhookURL,
		// 	app.services.UserService(),
		// 	app.logger,
		// ),
	}

	for _, h := range handlers {
		if err := app.services.EventBus().RegisterHandler(h); err != nil {
			panic(errors.Wrapf(err, "unable to register handler %T", h))
		}
	}
}

func (app *App) StartWebApp() {
	app.initEvents()

	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery())
	router.Setup(r, app.services)

	// 其他静态文件路由
	r.StaticFS("/assets", http.FS(ui.Files()))
	r.NoRoute(func(c *gin.Context) {
		content, err := ui.Dist.ReadFile("dist/index.html")
		if err != nil {
			str, _ := os.Getwd()
			fmt.Println(err, str)
			c.String(http.StatusInternalServerError, "Error reading embedded file")
			return
		}
		c.Data(http.StatusOK, "text/html", content)
	})

	port := "8088"
	if app.config.Port != "" {
		port = app.config.Port
	}
	r.Run(":" + port)
}

// 优雅退出
func registerExit(ioc *ioc.Container) {
	ch := make(chan os.Signal, 1)
	signal.Notify(ch, syscall.SIGHUP, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT, syscall.SIGUSR1, syscall.SIGUSR2)
	go func() {
		for s := range ch {
			switch s {
			case syscall.SIGHUP, syscall.SIGINT, syscall.SIGTERM:
				fmt.Printf("\n1Got %s signal. Aborting...\n", s)
				os.Exit(1)
			case syscall.SIGUSR1:
				fmt.Printf("\n2Got %s signal. Aborting...\n", s)
			case syscall.SIGUSR2:
				fmt.Printf("\n3Got %s signal. Aborting...\n", s)
			default:
				fmt.Printf("\n4Got %s signal. Aborting...\n", s)
			}
		}
	}()
}
