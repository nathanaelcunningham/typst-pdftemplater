package templates

import (
	"context"
	"fmt"
	"pdfgen/internal/models"
	"pdfgen/internal/persistance"
	"time"

	"github.com/google/uuid"
)

type Service struct {
	repo persistance.TemplateRepository
}

func NewService(repo persistance.TemplateRepository) *Service {
	return &Service{
		repo: repo,
	}
}

func (s *Service) CreateTemplate(ctx context.Context, template *models.Template) (*models.Template, error) {
	if template.Name == "" {
		return nil, fmt.Errorf("template name is required")
	}

	template.ID = uuid.New().String()
	template.CreatedAt = time.Now()
	template.UpdatedAt = time.Now()

	if err := s.repo.CreateTemplate(ctx, template); err != nil {
		return nil, fmt.Errorf("failed to create template: %w", err)
	}

	return template, nil
}

func (s *Service) GetTemplate(ctx context.Context, id string) (*models.Template, error) {
	if id == "" {
		return nil, fmt.Errorf("template id is required")
	}

	template, err := s.repo.GetTemplateByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get template: %w", err)
	}

	return template, nil
}

func (s *Service) UpdateTemplate(ctx context.Context, template *models.Template) (*models.Template, error) {
	if template.ID == "" {
		return nil, fmt.Errorf("template id is required")
	}
	if template.Name == "" {
		return nil, fmt.Errorf("template name is required")
	}

	template.UpdatedAt = time.Now()

	if err := s.repo.UpdateTemplate(ctx, template); err != nil {
		return nil, fmt.Errorf("failed to update template: %w", err)
	}

	return template, nil
}

func (s *Service) DeleteTemplate(ctx context.Context, id string) error {
	if id == "" {
		return fmt.Errorf("template id is required")
	}

	if err := s.repo.DeleteTemplate(ctx, id); err != nil {
		return fmt.Errorf("failed to delete template: %w", err)
	}

	return nil
}

func (s *Service) ListTemplates(ctx context.Context) ([]*models.Template, error) {
	templates, err := s.repo.ListTemplates(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to list templates: %w", err)
	}

	return templates, nil
}
