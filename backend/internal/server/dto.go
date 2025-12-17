package server

import (
	"pdfgen/internal/models"
	"time"
)

type templateListItem struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Archived    bool      `json:"archived"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

func (l *templateListItem) FromModel(m models.TemplateListItem) {
	l.ID = m.ID
	l.Name = m.Name
	l.Description = m.Description
	l.Archived = m.Archived
	l.CreatedAt = m.CreatedAt
	l.UpdatedAt = m.UpdatedAt
}

type template struct {
	ID          string          `json:"id"`
	Name        string          `json:"name"`
	Description string          `json:"description"`
	Content     templateContent `json:"content"`
	Archived    bool            `json:"archived"`
	CreatedAt   time.Time       `json:"createdAt"`
	UpdatedAt   time.Time       `json:"updatedAt"`
}

func (t *template) FromModel(m *models.Template) {
	t.ID = m.ID()
	t.Name = m.Name
	t.Description = m.Description
	t.Content.FromModel(&m.Content)
	t.CreatedAt = m.CreatedAt
	t.UpdatedAt = m.UpdatedAt
}

func (t *template) ToModel() *models.Template {
	m := &models.Template{
		Name:        t.Name,
		Description: t.Description,
		Content:     *t.Content.ToModel(),
		Archived:    t.Archived,
		CreatedAt:   t.CreatedAt,
		UpdatedAt:   t.UpdatedAt,
	}
	m.SetID(t.ID)
	return m
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
