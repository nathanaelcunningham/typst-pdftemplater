package sqlite

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"pdfgen/internal/models"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

type TemplateRepository struct {
	db *sql.DB
}

func NewTemplateRepository(db *sql.DB) *TemplateRepository {
	return &TemplateRepository{db: db}
}

func (r *TemplateRepository) CreateTemplate(ctx context.Context, template *models.Template) error {
	contentJSON, err := json.Marshal(template.Content)
	if err != nil {
		return fmt.Errorf("failed to marshal template content: %w", err)
	}

	query := `
		INSERT INTO templates (id, name, description, content, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?)
	`

	now := time.Now()
	_, err = r.db.ExecContext(ctx, query,
		template.ID,
		template.Name,
		template.Description,
		contentJSON,
		now,
		now,
	)
	if err != nil {
		return fmt.Errorf("failed to create template: %w", err)
	}

	return nil
}

func (r *TemplateRepository) GetTemplateByID(ctx context.Context, id string) (*models.Template, error) {
	query := `
		SELECT id, name, description, content, created_at, updated_at
		FROM templates
		WHERE id = ?
	`

	var template models.Template
	var contentJSON []byte

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&template.ID,
		&template.Name,
		&template.Description,
		&contentJSON,
		&template.CreatedAt,
		&template.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("template not found")
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get template: %w", err)
	}

	if err := json.Unmarshal(contentJSON, &template.Content); err != nil {
		return nil, fmt.Errorf("failed to unmarshal template content: %w", err)
	}

	return &template, nil
}

func (r *TemplateRepository) UpdateTemplate(ctx context.Context, template *models.Template) error {
	contentJSON, err := json.Marshal(template.Content)
	if err != nil {
		return fmt.Errorf("failed to marshal template content: %w", err)
	}

	query := `
		UPDATE templates
		SET name = ?, description = ?, content = ?, updated_at = ?
		WHERE id = ?
	`

	result, err := r.db.ExecContext(ctx, query,
		template.Name,
		template.Description,
		contentJSON,
		time.Now(),
		template.ID,
	)
	if err != nil {
		return fmt.Errorf("failed to update template: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}
	if rowsAffected == 0 {
		return fmt.Errorf("template not found")
	}

	return nil
}

func (r *TemplateRepository) DeleteTemplate(ctx context.Context, id string) error {
	query := `DELETE FROM templates WHERE id = ?`

	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete template: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}
	if rowsAffected == 0 {
		return fmt.Errorf("template not found")
	}

	return nil
}

func (r *TemplateRepository) ListTemplates(ctx context.Context) ([]*models.Template, error) {
	query := `
		SELECT id, name, description, content, created_at, updated_at
		FROM templates
		ORDER BY created_at DESC
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to list templates: %w", err)
	}
	defer rows.Close()

	var templates []*models.Template
	for rows.Next() {
		var template models.Template
		var contentJSON []byte

		err := rows.Scan(
			&template.ID,
			&template.Name,
			&template.Description,
			&contentJSON,
			&template.CreatedAt,
			&template.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan template: %w", err)
		}

		if err := json.Unmarshal(contentJSON, &template.Content); err != nil {
			return nil, fmt.Errorf("failed to unmarshal template content: %w", err)
		}

		templates = append(templates, &template)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating templates: %w", err)
	}

	return templates, nil
}
