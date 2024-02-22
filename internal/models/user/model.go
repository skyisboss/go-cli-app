package user

import (
	"gorm.io/gorm"
)

type UserModel struct {
	ID int `json:"id" gorm:"primarykey"`
	// 账号
	Username string `json:"username" gorm:"type:varchar(64);NOT NULL"`
	// 密码
	Password string `json:"password" gorm:"type:varchar(128);NOT NULL"`
	// 校验码
	AuthCode string `json:"authcode" gorm:"type:varchar(64);NOT NULL"`
	// token
	Token string `json:"token" gorm:"type:varchar(64);NOT NULL"`

	gorm.Model
}

func (table *UserModel) TableName() string {
	return "user"
}
