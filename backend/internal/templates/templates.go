package templates

import (
	"context"
	"fmt"
	"pdfgen/internal/models"

	"github.com/hallgren/eventsourcing/aggregate"
	essql "github.com/hallgren/eventsourcing/eventstore/sql"
)

type Service struct {
	es             *essql.SQLite
	listProjection *models.ListTemplatesProjection
}

func NewService(es *essql.SQLite, listProjection *models.ListTemplatesProjection) *Service {
	return &Service{
		es:             es,
		listProjection: listProjection,
	}
}

func (s *Service) CreateTemplate(
	ctx context.Context,
	template *models.Template,
) (*models.Template, error) {
	if template.Name == "" {
		return nil, fmt.Errorf("template name is required")
	}

	newTemplate := models.CreateTemplate(template.Name, template.Description, template.Content)
	err := aggregate.Save(s.es, newTemplate)
	return newTemplate, err
}

func (s *Service) GetTemplate(ctx context.Context, id string) (*models.Template, error) {
	if id == "" {
		return nil, fmt.Errorf("template id is required")
	}

	template := &models.Template{}
	if err := aggregate.Load(ctx, s.es, id, template); err != nil {
		return nil, err
	}
	return template, nil
}

func (s *Service) UpdateTemplate(
	ctx context.Context,
	id string,
	name, description string,
	content models.TemplateContent,
) (*models.Template, error) {
	if id == "" {
		return nil, fmt.Errorf("template id is required")
	}
	if name == "" {
		return nil, fmt.Errorf("template name is required")
	}

	// Load the existing aggregate first to get the correct version
	template := &models.Template{}
	if err := aggregate.Load(ctx, s.es, id, template); err != nil {
		return nil, fmt.Errorf("failed to load template: %w", err)
	}

	template.UpdateTemplate(name, description, content)
	if err := aggregate.Save(s.es, template); err != nil {
		return nil, fmt.Errorf("failed to save template: %w", err)
	}

	return template, nil
}

func (s *Service) DeleteTemplate(ctx context.Context, id string) error {
	if id == "" {
		return fmt.Errorf("template id is required")
	}

	template := &models.Template{}
	if err := aggregate.Load(ctx, s.es, id, template); err != nil {
		return err
	}

	template.ArchiveTemplate()
	err := aggregate.Save(s.es, template)
	if err != nil {
		return fmt.Errorf("failed to archive template: %w", err)
	}

	return nil
}

func (s *Service) ListTemplates(ctx context.Context) []models.TemplateListItem {
	return s.listProjection.Templates
}
