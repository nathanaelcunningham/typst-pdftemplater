package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"

	"github.com/Dadido3/go-typst"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func main() {
	r := chi.NewRouter()

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{
			"Accept",
			"Authorization",
			"Content-Type",
			"X-CSRF-Token",
			"x-api-key",
		},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Post("/compile-preview", CompilePreview)

	log.Println("Starting server on :1234")
	if err := http.ListenAndServe(":1234", r); err != nil {
		panic(err)
	}
}

type CompilePreviewRequest struct {
	TypstCode string            `json:"typstCode"`
	Variables map[string]string `json:"variables"`
}

func CompilePreview(w http.ResponseWriter, r *http.Request) {
	var req CompilePreviewRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	fmt.Printf("%#v\n", req.Variables)

	tmpl, err := template.New("compile-preview").Parse(req.TypstCode)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var t bytes.Buffer
	err = tmpl.Execute(&t, req.Variables)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	typstCaller := typst.CLI{}

	err = typstCaller.Compile(&t, w, nil)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

}
