package cmd

import (
	"context"
	"log"

	"github.com/skyisboss/cli/internal/app"
	"github.com/skyisboss/cli/internal/ioc"
	"github.com/skyisboss/cli/internal/models/user"
	"github.com/spf13/cobra"
)

var webCommand = &cobra.Command{
	Use:     "web",
	Example: "web界面",
	Run:     run,
}

func run(_ *cobra.Command, _ []string) {
	var (
		ctx = context.Background()
		cfg = RegisterConfig()
		app = app.New(ctx, cfg)
	)
	app.Logger().Info().Msg("start web")

	// 初始化操作
	checkMigrator(app.Ioc())
	app.Ioc().EventBus()
	app.Ioc().DbService()

	// 启动服务
	app.StartWebApp()
}

func checkMigrator(ioc *ioc.Container) {
	db := ioc.DbService().Instance()
	tableRows := []interface{}{
		&user.UserModel{},
	}

	for _, table := range tableRows {
		ok := db.Migrator().HasTable(table)
		if !ok {
			err := db.AutoMigrate(table)
			if err != nil {
				log.Fatal("创建数据库失败")
			}
		}
	}

}
