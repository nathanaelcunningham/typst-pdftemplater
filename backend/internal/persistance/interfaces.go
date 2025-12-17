package persistance

import (
	"context"
	"pdfgen/internal/models"
)

type TemplateRepository interface {
	// Create creates a new template
	CreateTemplate(ctx context.Context, template *models.Template) error

	// Read retrieves a template by ID
	GetTemplateByID(ctx context.Context, id string) (*models.Template, error)

	// Update updates an existing template
	UpdateTemplate(ctx context.Context, template *models.Template) error

	// Delete removes a template by ID
	DeleteTemplate(ctx context.Context, id string) error

	// List retrieves all templates
	ListTemplates(ctx context.Context) ([]*models.Template, error)
}
