package router

import (
	"github.com/gin-gonic/gin"
	"github.com/skyisboss/cli/internal/ioc"
	"github.com/skyisboss/cli/internal/web/handler"
	"github.com/skyisboss/cli/internal/web/middleware"
)

func Setup(r *gin.Engine, ioc *ioc.Container) {

	handler := &handler.Handler{
		Ioc: ioc,
	}
	r.Use(middleware.CorsMiddleware())
	cfg := ioc.Config()
	if cfg.Debug {
		gin.SetMode(gin.DebugMode)
	} else {
		gin.SetMode(gin.ReleaseMode)
	}

	r.GET("/ws", func(c *gin.Context) {
		WebSocketHandler(c.Writer, c.Request, ioc.UserService())
	})

	public := r.Group("/api/v1")
	{
		public.POST("/login", handler.SystemLogin)
		public.POST("/register", handler.SystemRegister)
	}
	private := r.Group("/api/v1", middleware.AuthMiddleware(ioc.UserService()))
	{

		// 退出
		private.POST("/logout", handler.SystemLogout)
		// 修改密码
		private.POST("/editPwd", handler.SystemEditPwd)
	}
}
