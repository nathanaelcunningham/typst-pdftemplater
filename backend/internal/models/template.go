package models

import "time"

type Template struct {
	id          string
	name        string
	description string
	content     TemplateContent
	created_at  time.Time
	updated_at  time.Time
}

type TemplateContent struct {
}
