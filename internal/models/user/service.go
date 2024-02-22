package user

import (
	"context"

	"github.com/rs/zerolog"
	"github.com/skyisboss/cli/internal/db"
	"gorm.io/gorm"
)

type Service struct {
	logger *zerolog.Logger
	db     *gorm.DB
}

func New(db *db.Connection, logger *zerolog.Logger) *Service {
	log := logger.With().Str("channel", "apprun.service").Logger()

	return &Service{
		db:     db.Pool,
		logger: &log,
	}
}

func (s *Service) Insert(ctx context.Context, data *UserModel) error {
	return s.db.Create(data).Error
}

func (s *Service) GetByID(ctx context.Context, id int) (*UserModel, error) {
	data := &UserModel{}
	err := s.db.Where("id = ?", id).Limit(1).Find(&data).Error
	return data, err
}

func (s *Service) GetByToken(token string) (*UserModel, error) {
	data := &UserModel{}
	err := s.db.Where("token = ?", token).Limit(1).Find(&data).Error
	return data, err
}

func (s *Service) GetByUsername(ctx context.Context, username string) (*UserModel, error) {
	data := &UserModel{}
	err := s.db.Where("username = ?", username).Limit(1).Find(&data).Error
	return data, err
}

func (s *Service) Update(ctx context.Context, info *UserModel) error {
	return s.db.Updates(&info).Error
}
