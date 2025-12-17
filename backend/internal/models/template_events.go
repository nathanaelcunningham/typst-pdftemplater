package models

import "time"

type TemplateCreatedEvent struct {
	Name        string
	Description string
	Content     TemplateContent
	CreatedAt   time.Time
}

type TemplateUpdatedEvent struct {
	Name             string
	Description      string
	ContentPatchText string
	UpdatedAt        time.Time
}

type TemplateArchivedEvent struct {
	ArchivedAt time.Time
}
