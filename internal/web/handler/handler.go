package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
	"github.com/skyisboss/cli/internal/ioc"
	"github.com/skyisboss/cli/internal/utils"
)

type Handler struct {
	Ioc *ioc.Container
}
type BaseParams struct {
	Nav  *int `json:"nav" binding:"required" validate:"number"`
	Page int  `json:"page" binding:"required" validate:"number"`
}
type ActionParams struct {
	ID     int    `json:"id" binding:"required" validate:"number"`
	Action string `json:"action" binding:"required"`
}
type InfoParams struct {
	ID int `json:"id" binding:"required" validate:"number"`
}

func CheckBaseParams(c *gin.Context) (BaseParams, error) {
	var post BaseParams
	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(http.StatusOK, utils.Response("参数错误", 110, nil))
		return BaseParams{}, err
	}

	validate := validator.New()
	err := validate.Struct(post)
	if err != nil {
		c.JSON(http.StatusOK, utils.Response(err.Error(), 110, nil))
		return BaseParams{}, err
	}

	return post, nil
}

func CheckActionParams(c *gin.Context) (ActionParams, error) {
	var post ActionParams
	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(http.StatusOK, utils.Response("参数错误", 110, nil))
		return ActionParams{}, err
	}

	validate := validator.New()
	err := validate.Struct(post)
	if err != nil {
		c.JSON(http.StatusOK, utils.Response(err.Error(), 110, nil))
		return ActionParams{}, err
	}

	return post, nil
}

func CheckInfoParams(c *gin.Context) (InfoParams, error) {
	var post InfoParams
	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(http.StatusOK, utils.Response("参数错误", 110, nil))
		return InfoParams{}, err
	}

	validate := validator.New()
	err := validate.Struct(post)
	if err != nil {
		c.JSON(http.StatusOK, utils.Response(err.Error(), 110, nil))
		return InfoParams{}, err
	}

	return post, nil
}
