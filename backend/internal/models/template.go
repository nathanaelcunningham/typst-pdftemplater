package models

import "time"

type Template struct {
	ID          string
	Name        string
	Description string
	Content     TemplateContent
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type TemplateContent struct {
}
