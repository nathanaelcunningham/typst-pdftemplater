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

type TemplateResponse struct {
	ID          string                 `json:"id"`
	Name        string                 `json:"name"`
	Description string                 `json:"description"`
	Content     models.TemplateContent `json:"content"`
	CreatedAt   time.Time              `json:"createdAt"`
	UpdatedAt   time.Time              `json:"updatedAt"`
}

func (r *TemplateResponse) FromModel(template *models.Template) *TemplateResponse {
	r.ID = template.ID
	r.Name = template.Name
	r.Description = template.Description
	r.Content = template.Content
	r.CreatedAt = template.CreatedAt
	r.UpdatedAt = template.UpdatedAt
	return r
}

func (r *TemplateResponse) ToModel() *models.Template {
	return &models.Template{
		ID:          r.ID,
		Name:        r.Name,
		Description: r.Description,
		Content:     r.Content,
		CreatedAt:   r.CreatedAt,
		UpdatedAt:   r.UpdatedAt,
	}
}

func NewTemplateResponse(template *models.Template) *TemplateResponse {
	return (&TemplateResponse{}).FromModel(template)
}

func NewTemplateResponses(templates []models.Template) []*TemplateResponse {
	responses := make([]*TemplateResponse, len(templates))
	for i, template := range templates {
		responses[i] = NewTemplateResponse(&template)
	}
	return responses
}

type CompilePreviewRequest struct {
	TypstCode string            `json:"typstCode"`
	Variables map[string]string `json:"variables"`
}
