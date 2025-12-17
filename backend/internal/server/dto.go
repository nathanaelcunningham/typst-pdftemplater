package server

import (
	"pdfgen/internal/models"
	"time"
)

type CreateTemplateRequest struct {
	Name        string                 `json:"name"`
	Description string                 `json:"description"`
	Content     models.TemplateContent `json:"content"`
}

func (r *CreateTemplateRequest) ToModel() *models.Template {
	return &models.Template{
		Name:        r.Name,
		Description: r.Description,
		Content:     r.Content,
	}
}

type UpdateTemplateRequest struct {
	Name        string                 `json:"name"`
	Description string                 `json:"description"`
	Content     models.TemplateContent `json:"content"`
}

func (r *UpdateTemplateRequest) ToModel(id string) *models.Template {
	return &models.Template{
		ID:          id,
		Name:        r.Name,
		Description: r.Description,
		Content:     r.Content,
	}
}

type ListTemplateResponse struct {
	Templates []TemplateResponse `json:"templates"`
}

type TemplateResponse struct {
	ID          string          `json:"id"`
	Name        string          `json:"name"`
	Description string          `json:"description"`
	Content     TemplateContent `json:"content"`
	CreatedAt   time.Time       `json:"createdAt"`
	UpdatedAt   time.Time       `json:"updatedAt"`
}

type TemplateContent struct {
	Grid struct {
		Columns int `json:"columns"`
		Gap     int `json:"gap"`
	} `json:"grid"`
	Components []any `json:"components"` // ComponentInstance[]
	Variables  []any `json:"variables"`  // Variable[]
}

func (r *TemplateContent) FromModel(content models.TemplateContent) TemplateContent {
	return TemplateContent{
		Grid: struct {
			Columns int `json:"columns"`
			Gap     int `json:"gap"`
		}{
			Columns: content.Grid.Columns,
			Gap:     content.Grid.Gap,
		},
		Components: content.Components,
		Variables:  content.Variables,
	}
}

func (r *TemplateContent) ToModel() models.TemplateContent {
	return models.TemplateContent{
		Grid: struct {
			Columns int
			Gap     int
		}{
			Columns: r.Grid.Columns,
			Gap:     r.Grid.Gap,
		},
		Components: r.Components,
		Variables:  r.Variables,
	}
}

func (r *TemplateResponse) FromModel(template *models.Template) TemplateResponse {
	var content TemplateContent
	return TemplateResponse{
		ID:          template.ID,
		Name:        template.Name,
		Description: template.Description,
		Content:     content.FromModel(template.Content),
		CreatedAt:   template.CreatedAt,
		UpdatedAt:   template.UpdatedAt,
	}
}

func (r *TemplateResponse) ToModel() *models.Template {
	return &models.Template{
		ID:          r.ID,
		Name:        r.Name,
		Description: r.Description,
		Content:     r.Content.ToModel(),
		CreatedAt:   r.CreatedAt,
		UpdatedAt:   r.UpdatedAt,
	}
}

func NewListTemplateResponse(templates []models.Template) *ListTemplateResponse {
	responses := make([]TemplateResponse, len(templates))
	for i, template := range templates {
		responses[i] = NewTemplateResponse(&template)
	}
	return &ListTemplateResponse{
		Templates: responses,
	}
}

func NewTemplateResponse(template *models.Template) TemplateResponse {
	var t TemplateResponse
	return t.FromModel(template)
}

func NewTemplateResponses(templates []models.Template) []TemplateResponse {
	responses := make([]TemplateResponse, len(templates))
	for i, template := range templates {
		responses[i] = NewTemplateResponse(&template)
	}
	return responses
}

type CompilePreviewRequest struct {
	TypstCode string            `json:"typstCode"`
	Variables map[string]string `json:"variables"`
}
