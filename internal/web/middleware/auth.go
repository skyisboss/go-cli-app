package middleware

import (
	"context"
	"crypto/md5"
	"fmt"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/skyisboss/cli/internal/models/user"
)

type Claims struct {
	UID      int    `json:"uid"`
	Username string `json:"username"`
	jwt.StandardClaims
}

var TOKEN_KEY = "JKs-a&12dxn!@s456xn@98$asd#^as&xn#nE^a)S3s"

// CheckToken 验证token
func CheckToken(tokenString string) (*jwt.Token, *Claims, error) {
	claims := &Claims{}
	Jwtkey := []byte(TOKEN_KEY)

	key, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (i interface{}, err error) {
		return Jwtkey, nil
	})

	return key, claims, err
}

// CreateToken 生成token
func CreateToken(user *user.UserModel) (string, error) {
	Jwtkey := []byte(TOKEN_KEY)
	expireTime := time.Now().Add(time.Hour * 24 * 30) //过期时间
	nowTime := time.Now()                             //当前时间
	claims := Claims{
		UID:      int(user.ID),
		Username: user.Username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expireTime.Unix(), //过期时间戳
			IssuedAt:  nowTime.Unix(),    //当前时间戳
			Issuer:    "userToken",       //颁发者签名
			Subject:   "userToken",       //签名主题
		},
	}
	tokenStruct := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return tokenStruct.SignedString(Jwtkey)
}

func AuthMiddleware(userService *user.Service) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// 获取authorization header
		tokenString := ctx.GetHeader("x-token")

		// validate token formate
		if tokenString == "" || !strings.HasPrefix(tokenString, "Bearer ") {
			ctx.JSON(401, gin.H{"err": 401, "msg": "token错误", "res": gin.H{}})
			ctx.Abort()
			return
		}

		//验证token
		tokenString = tokenString[7:]
		token, claims, err := CheckToken(tokenString)
		if err != nil || !token.Valid {
			ctx.JSON(401, gin.H{"err": 401, "msg": "token失效", "res": gin.H{}})
			ctx.Abort()
			return
		}
		//token超时
		if time.Now().Unix() > claims.ExpiresAt {
			ctx.JSON(401, gin.H{"err": 401, "msg": "token过期", "res": gin.H{}})
			ctx.Abort()
			return
		}
		data, _ := userService.GetByID(context.Background(), claims.UID)
		if data.Token != fmt.Sprintf("%x", md5.Sum([]byte(tokenString))) {
			ctx.JSON(401, gin.H{"err": 401, "msg": "token错误", "res": gin.H{}})
			ctx.Abort()
			return
		}

		// 注入相关信息
		ctx.Set("uid", claims.UID)
		ctx.Set("username", claims.Username)
	}
}
func AuthMiddleware2(ctx *gin.Context) {
	// 获取authorization header
	tokenString := ctx.GetHeader("x-token")

	// validate token formate
	if tokenString == "" || !strings.HasPrefix(tokenString, "Bearer ") {
		ctx.JSON(401, gin.H{"err": 401, "msg": "token错误", "res": gin.H{}})
		ctx.Abort()
		return
	}

	//验证token
	tokenString = tokenString[7:]
	token, claims, err := CheckToken(tokenString)
	if err != nil || !token.Valid {
		ctx.JSON(401, gin.H{"err": 401, "msg": "token失效", "res": gin.H{}})
		ctx.Abort()
		return
	}
	//token超时
	if time.Now().Unix() > claims.ExpiresAt {
		ctx.JSON(401, gin.H{"err": 401, "msg": "token过期", "res": gin.H{}})
		ctx.Abort()
		return
	}
	// data, err := model.FindAdminUser("id", claims.UID)

	// if err != nil || data.Token == "" || fmt.Sprintf("%x", md5.Sum([]byte(tokenString))) != data.Token {
	// utils.ShowError(ctx, "用户token不存在", nil)
	// 	return
	// }

	// 注入相关信息
	ctx.Set("uid", claims.UID)
	ctx.Set("username", claims.Username)
}
