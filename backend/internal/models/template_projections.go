package models

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/hallgren/eventsourcing"
	"github.com/hallgren/eventsourcing/eventstore/sql"
)

type TemplateListItem struct {
	ID          string
	Name        string
	Description string
	Archived    bool
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type ListTemplatesProjection struct {
	mu        sync.RWMutex
	Templates []TemplateListItem
}

func NewListTemplatesProjection() *ListTemplatesProjection {
	return &ListTemplatesProjection{
		Templates: []TemplateListItem{},
	}
}

// GetTemplates returns a copy of the templates slice in a thread-safe manner
func (p *ListTemplatesProjection) GetTemplates() []TemplateListItem {
	p.mu.RLock()
	defer p.mu.RUnlock()

	// Return a copy to prevent external modification
	result := make([]TemplateListItem, len(p.Templates))
	copy(result, p.Templates)
	return result
}

func (p *ListTemplatesProjection) Build(es *sql.SQLite) *eventsourcing.Projection {
	return eventsourcing.NewProjection(es.All(0), func(event eventsourcing.Event) error {
		p.mu.Lock()
		defer p.mu.Unlock()

		switch e := event.Data().(type) {
		case *TemplateCreatedEvent:
			item := TemplateListItem{
				ID:          event.AggregateID(),
				Name:        e.Name,
				Description: e.Description,
				Archived:    false,
				CreatedAt:   e.CreatedAt,
				UpdatedAt:   e.CreatedAt,
			}
			p.Templates = append(p.Templates, item)

		case *TemplateUpdatedEvent:
			for i, item := range p.Templates {
				if item.ID == event.AggregateID() {
					p.Templates[i].Name = e.Name
					p.Templates[i].Description = e.Description
					p.Templates[i].UpdatedAt = e.UpdatedAt
					break
				}
			}

		case *TemplateArchivedEvent:
			for i, item := range p.Templates {
				if item.ID == event.AggregateID() {
					p.Templates[i].Archived = true
					p.Templates[i].UpdatedAt = e.ArchivedAt
					break
				}
			}

		default:
			fmt.Printf("unknown event type in transition: %s\n", event.Data())
		}
		return nil
	})
}

func (p *ListTemplatesProjection) Run(
	ctx context.Context,
	es *sql.SQLite,
	pace time.Duration,
) error {
	return p.Build(es).Run(ctx, pace)
}
