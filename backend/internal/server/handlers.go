package server

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"ok"}`))
}

func (s *Server) handleListTemplates(w http.ResponseWriter, r *http.Request) {
	templates := s.templateService.ListTemplates(r.Context())

	templatesDto := make([]templateListItem, 0, len(templates))
	for _, t := range templates {
		var tDTO templateListItem
		tDTO.FromModel(t)
		templatesDto = append(templatesDto, tDTO)
	}

	response := ListTemplateResponse{
		Templates: templatesDto,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (s *Server) handleCreateTemplate(w http.ResponseWriter, r *http.Request) {
	var req CreateTemplateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	template := template{
		Name:        req.Name,
		Description: req.Description,
		Content:     req.Content,
	}
	created, err := s.templateService.CreateTemplate(r.Context(), template.ToModel())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	// TODO: is the the best way?
	template.FromModel(created)

	response := CreateTemplateResponse{
		Template: template,
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func (s *Server) handleGetTemplate(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		http.Error(w, "id is required", http.StatusBadRequest)
		return
	}

	foundTemplate, err := s.templateService.GetTemplate(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	var tDTO template
	tDTO.FromModel(foundTemplate)

	response := GetTemplateResponse{
		Template: tDTO,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (s *Server) handleUpdateTemplate(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		http.Error(w, "id is required", http.StatusBadRequest)
		return
	}

	var req UpdateTemplateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	updated, err := s.templateService.UpdateTemplate(
		r.Context(),
		id,
		req.Name,
		req.Description,
		*req.Content.ToModel(),
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	var tDTO template
	tDTO.FromModel(updated)

	response := UpdateTemplateResponse{
		Template: tDTO,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (s *Server) handleArchiveTemplate(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		http.Error(w, "id is required", http.StatusBadRequest)
		return
	}

	if err := s.templateService.ArchiveTemplate(r.Context(), id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (s *Server) handlePreview(w http.ResponseWriter, r *http.Request) {
	var req CompilePreviewRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	pdfBytes, err := s.templateService.ToPdf(req.TypstCode, req.Variables)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Write(pdfBytes)
}
