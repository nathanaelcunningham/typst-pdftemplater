package server

type CreateTemplateRequest struct {
	Name        string          `json:"name"`
	Description string          `json:"description"`
	Content     templateContent `json:"content"`
}

type CreateTemplateResponse struct {
	Template template `json:"template"`
}

type UpdateTemplateRequest struct {
	Name        string          `json:"name"`
	Description string          `json:"description"`
	Content     templateContent `json:"content"`
}

type UpdateTemplateResponse struct {
	Template template `json:"template"`
}

type ListTemplateResponse struct {
	Templates []template `json:"templates"`
}

type GetTemplateResponse struct {
	Template template `json:"template"`
}

type CompilePreviewRequest struct {
	TypstCode string            `json:"typstCode"`
	Variables map[string]string `json:"variables"`
}
