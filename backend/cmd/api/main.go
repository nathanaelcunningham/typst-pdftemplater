package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"pdfgen/internal/persistance/sqlite"
	"pdfgen/internal/server"
	"pdfgen/internal/templates"
)

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	db, err := sqlite.NewDB("./tmp/db")
	if err != nil {
		return fmt.Errorf("failed to initialize database: %w", err)
	}
	defer db.Close()

	templateRepo := sqlite.NewTemplateRepository(db)
	templateService := templates.NewService(templateRepo)

	srv := server.New(server.Config{
		Port:            "1234",
		AllowedOrigins:  []string{"*"},
		TemplateService: templateService,
	})

	go func() {
		if err := srv.Start(); err != nil {
			log.Printf("Server error: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	return srv.Shutdown(ctx)
}
