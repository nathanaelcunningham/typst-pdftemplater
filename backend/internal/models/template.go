package models

import (
	"encoding/json"
	"time"

	"github.com/hallgren/eventsourcing"
	"github.com/hallgren/eventsourcing/aggregate"
	"github.com/sergi/go-diff/diffmatchpatch"
)

type Template struct {
	aggregate.Root
	Name        string
	Description string
	Content     TemplateContent
	Archived    bool
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type TemplateContent struct {
	Grid       TemplateGrid
	Components []any // ComponentInstance[]
	Variables  []any // Variable[]
}

func (t TemplateContent) ToString() string {
	contentBytes, _ := json.MarshalIndent(t, "", "  ")
	return string(contentBytes)
}

func (t *TemplateContent) FromString(contentStr string) error {
	return json.Unmarshal([]byte(contentStr), t)
}

type TemplateGrid struct {
	Columns int
	Gap     int
}

func CreateTemplate(name, description string, content TemplateContent) *Template {
	templ := &Template{}
	event := &TemplateCreatedEvent{
		Name:        name,
		Description: description,
		Content:     content,
		CreatedAt:   time.Now(),
	}
	aggregate.TrackChange(templ, event)
	return templ
}

func (t *Template) UpdateTemplate(name, description string, content TemplateContent) {
	dmp := diffmatchpatch.New()
	patches := dmp.PatchMake(t.Content.ToString(), content.ToString())
	patchText := dmp.PatchToText(patches)
	event := &TemplateUpdatedEvent{
		Name:             name,
		Description:      description,
		ContentPatchText: patchText,
		UpdatedAt:        time.Now(),
	}
	aggregate.TrackChange(t, event)
}

func (t *Template) ArchiveTemplate() {
	event := &TemplateArchivedEvent{
		ArchivedAt: time.Now(),
	}
	aggregate.TrackChange(t, event)
}

func (t *Template) Transition(event eventsourcing.Event) {
	switch e := event.Data().(type) {
	case *TemplateCreatedEvent:
		t.Name = e.Name
		t.Description = e.Description
		t.Content = e.Content
		t.CreatedAt = e.CreatedAt

	case *TemplateUpdatedEvent:
		dmp := diffmatchpatch.New()
		patches, _ := dmp.PatchFromText(e.ContentPatchText)
		newContent, _ := dmp.PatchApply(patches, t.Content.ToString())

		var updatedContent TemplateContent
		updatedContent.FromString(newContent)
		t.Content = updatedContent

		t.UpdatedAt = e.UpdatedAt

	case *TemplateArchivedEvent:
		t.Archived = true
		t.UpdatedAt = e.ArchivedAt

	default:
		panic("unknown event type")
	}
}

func (t *Template) Register(r aggregate.RegisterFunc) {
	r(&TemplateCreatedEvent{}, &TemplateUpdatedEvent{})
}
