package server

import (
	"pdfgen/internal/models"
	"time"
)

type template struct {
	ID          string          `json:"id"`
	Name        string          `json:"name"`
	Description string          `json:"description"`
	Content     templateContent `json:"content"`
	CreatedAt   time.Time       `json:"createdAt"`
	UpdatedAt   time.Time       `json:"updatedAt"`
}

func (t *template) FromModel(m *models.Template) {
	t.ID = m.ID
	t.Name = m.Name
	t.Description = m.Description
	t.Content.FromModel(&m.Content)
	t.CreatedAt = m.CreatedAt
	t.UpdatedAt = m.UpdatedAt
}

func (t *template) ToModel() *models.Template {
	return &models.Template{
		ID:          t.ID,
		Name:        t.Name,
		Description: t.Description,
		Content:     *t.Content.ToModel(),
		CreatedAt:   t.CreatedAt,
		UpdatedAt:   t.UpdatedAt,
	}
}

type templateContent struct {
	Grid       templateGrid `json:"grid"`
	Components []any        `json:"components"` // ComponentInstance[]
	Variables  []any        `json:"variables"`  // Variable[]
}

type templateGrid struct {
	Columns int `json:"columns"`
	Gap     int `json:"gap"`
}

func (t *templateContent) FromModel(m *models.TemplateContent) {
	t.Grid = templateGrid(m.Grid)
	t.Components = m.Components
	t.Variables = m.Variables
}

func (t *templateContent) ToModel() *models.TemplateContent {
	return &models.TemplateContent{
		Grid: models.TemplateGrid{
			Columns: t.Grid.Columns,
			Gap:     t.Grid.Gap,
		},
		Components: t.Components,
		Variables:  t.Variables,
	}
}
