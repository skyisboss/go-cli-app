package handler

import (
	"context"
	"crypto/md5"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator"
	"github.com/skyisboss/cli/internal/models/user"
	"github.com/skyisboss/cli/internal/utils"
	"github.com/skyisboss/cli/internal/web/middleware"
)

// 登录系统
func (h *Handler) SystemLogin(c *gin.Context) {
	type formParam struct {
		Username string `json:"username" binding:"required" validate:"min=2,max=32"`
		Password string `json:"password" binding:"required" validate:"min=2,max=32"`
		AuthCode string `json:"authcode" binding:"required" validate:"len=6,number"`
	}
	var req struct {
		// Type  string `json:"type" binding:"required" validate:"oneof=pwd token"`
		// Param formParam
		Username string `json:"username" binding:"required" validate:"min=2,max=32" err_msg:"账号输入错误"`
		Password string `json:"password" binding:"required" validate:"min=2,max=32" err_msg:"密码输入错误"`
		AuthCode string `json:"authcode" binding:"required" validate:"len=6,number" err_msg:"验证码输入错误"`
	}
	if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {
		c.JSON(http.StatusOK, utils.Response("参数不完整", 1, nil))
		return
	}

	validate := validator.New()
	err := validate.Struct(req)
	if err != nil {
		c.JSON(http.StatusOK, utils.Response(utils.ProcessErr(req, err), 1, nil))
		return
	}

	UserService := h.Ioc.UserService()
	// 查询用户信息
	user, err := UserService.GetByUsername(context.Background(), req.Username)
	if err != nil {
		// 用户不存在
		c.JSON(http.StatusOK, utils.Response("用户名或密码错误", 1, nil))
		return
	}

	// 校验密码
	if !utils.PasswordVerify(req.Password, user.Password) {
		c.JSON(http.StatusOK, utils.Response("用户名或密码错误", 1, nil))
		return
	}

	// 校验验证码
	ok, _ := utils.NewGoogleAuth().VerifyCode(req.AuthCode, user.AuthCode)
	if !ok {
		c.JSON(http.StatusOK, utils.Response("验证码错误", 1, nil))
		return
	}

	// 发放token
	token, err := middleware.CreateToken(user)
	if err != nil {
		c.JSON(http.StatusOK, utils.Response("无法创建token", 1, nil))
		return
	}

	// 更新数据,token已md5保存，中间件校验的时候也需要将token转为md5后再判断
	user.Token = fmt.Sprintf("%x", md5.Sum([]byte(token))) //token //
	err = UserService.Update(context.Background(), user)
	if err != nil {
		c.JSON(http.StatusOK, utils.Response("更新用户信息失败", 1, nil))
		return
	}
	c.JSON(http.StatusOK, utils.Response("ok", 0, gin.H{
		"token":     token,
		"username":  user.Username,
		"uid":       user.ID,
		"auth_code": user.AuthCode,
	}))
}

func (h *Handler) SystemRegister(c *gin.Context) {
	var req struct {
		Username string `json:"username" binding:"required" validate:"min=2,max=32"`
		Password string `json:"password" binding:"required" validate:"min=2,max=32"`
	}
	if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {
		c.JSON(http.StatusOK, utils.Response("参数不完整", 1, nil))
		return
	}

	validate := validator.New()
	err := validate.Struct(req)
	if err != nil {
		c.JSON(http.StatusOK, utils.Response(err.Error(), 1, nil))
		return
	}

	hash, err := utils.PasswordHash(req.Password)
	if err != nil {
		c.JSON(http.StatusOK, utils.Response("更新密码失败", 1, nil))
		return
	}
	secret, _ := utils.InitAuth(req.Username)
	user := &user.UserModel{
		Username: req.Username,
		Password: hash,
		AuthCode: secret,
	}

	UserService := h.Ioc.UserService()
	err = UserService.Insert(context.Background(), user)
	if err != nil {
		c.JSON(http.StatusOK, utils.Response("创建用户失败", 1, nil))
		return
	}

	// 发放token
	token, err := middleware.CreateToken(user)
	if err != nil {
		c.JSON(http.StatusOK, utils.Response("无法创建token", 1, nil))
		return
	}
	user.Token = token
	err = UserService.Update(context.Background(), user)
	if err != nil {
		c.JSON(http.StatusOK, utils.Response("更新信息失败", 1, nil))
		return
	}

	c.JSON(http.StatusOK, utils.Response("ok", 0, gin.H{
		"username": user.Username,
		"token":    user.Token,
		"authcode": user.AuthCode,
	}))
}

// 退出登录
func (h *Handler) SystemLogout(c *gin.Context) {
	uid := c.GetInt("uid")
	UserService := h.Ioc.UserService()
	// 查询用户信息
	user, err := UserService.GetByID(context.Background(), uid)
	if err != nil {
		c.JSON(http.StatusOK, utils.Response("用户不存在", 1, nil))
		return
	}

	user.Token = ""
	err = UserService.Update(context.Background(), user)
	if err != nil {
		c.JSON(http.StatusOK, utils.Response("更新信息失败", 1, nil))
		return
	}

	c.JSON(http.StatusOK, utils.Response("ok", 0, nil))
}

// 修改密码
func (h *Handler) SystemEditPwd(c *gin.Context) {
	var req struct {
		OldPwd   string `json:"old_pwd" binding:"required" validate:"min=2,max=32"`
		NewPwd   string `json:"new_pwd" binding:"required" validate:"min=2,max=32"`
		AuthCode string `json:"authcode" binding:"required" validate:"len=6,number"`
	}
	if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {
		c.JSON(http.StatusOK, utils.Response("参数不完整", 1, nil))
		return
	}

	validate := validator.New()
	err := validate.Struct(req)
	if err != nil {
		c.JSON(http.StatusOK, utils.Response(err.Error(), 1, nil))
		return
	}

	uid := c.GetInt("uid")
	UserService := h.Ioc.UserService()
	// 查询用户信息
	user, err := UserService.GetByID(context.Background(), uid)
	if err != nil {
		c.JSON(http.StatusOK, utils.Response("用户不存在", 1, nil))
		return
	}

	// 校验密码
	if !utils.PasswordVerify(req.OldPwd, user.Password) {
		c.JSON(http.StatusOK, utils.Response("密码错误", 1, nil))
		return
	}

	// 校验验证码
	ok, _ := utils.NewGoogleAuth().VerifyCode(req.AuthCode, user.AuthCode)
	if !ok {
		c.JSON(http.StatusOK, utils.Response("验证码错误", 1, nil))
		return
	}

	hash, err := utils.PasswordHash(req.NewPwd)
	if err != nil {
		c.JSON(http.StatusOK, utils.Response("更新密码失败", 1, nil))
		return
	}
	// 发放token
	token, err := middleware.CreateToken(user)
	if err != nil {
		c.JSON(http.StatusOK, utils.Response("无法创建token", 1, nil))
		return
	}
	user.Token = token
	user.Password = hash
	err = UserService.Update(context.Background(), user)
	if err != nil {
		c.JSON(http.StatusOK, utils.Response("更新信息失败", 1, nil))
		return
	}

	c.JSON(http.StatusOK, utils.Response("ok", 0, nil))
}
