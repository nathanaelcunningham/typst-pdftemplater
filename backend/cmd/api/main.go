package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"pdfgen/internal/models"
	"pdfgen/internal/persistance/sqlite"
	"pdfgen/internal/server"
	"pdfgen/internal/templates"

	"github.com/hallgren/eventsourcing/aggregate"
	essql "github.com/hallgren/eventsourcing/eventstore/sql"
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

	es, err := essql.NewSQLite(db)
	if err != nil {
		panic(err)
	}

	aggregate.Register(&models.Template{})

	listProjection := models.NewListTemplatesProjection()

	// Create cancellable context for projection
	projectionCtx, cancelProjection := context.WithCancel(context.Background())
	projectionDone := make(chan error, 1)

	// Start projection in background with graceful shutdown support
	go func() {
		if err := listProjection.Run(projectionCtx, es, time.Millisecond*500); err != nil {
			log.Printf("Projection error: %v", err)
			projectionDone <- err
		} else {
			projectionDone <- nil
		}
	}()

	templateService := templates.NewService(es, listProjection)

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

	log.Println("Shutting down gracefully...")

	// Cancel projection context to stop event processing
	cancelProjection()

	// Wait for projection to finish with timeout
	projectionShutdownTimer := time.After(5 * time.Second)
	select {
	case <-projectionDone:
		log.Println("Projection stopped")
	case <-projectionShutdownTimer:
		log.Println("Projection shutdown timed out")
	}

	// Shutdown HTTP server
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	return srv.Shutdown(ctx)
}
