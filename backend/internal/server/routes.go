package server

import (
	"github.com/go-chi/chi/v5"
)

func (s *Server) registerRoutes() {
	s.router.Route("/api", func(r chi.Router) {
		r.Get("/health", s.handleHealth)

		r.Route("/templates", func(r chi.Router) {
			r.Get("/", s.handleListTemplates)
			r.Post("/", s.handleCreateTemplate)
			r.Get("/{id}", s.handleGetTemplate)
			r.Put("/{id}", s.handleUpdateTemplate)
			r.Delete("/{id}", s.handleArchiveTemplate)
			r.Post("/preview", s.handlePreview)
		})
	})
}
