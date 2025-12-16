package templates

import (
	"bytes"
	"html/template"

	"github.com/Dadido3/go-typst"
)

func (s *Service) ToPdf(content string, data any) ([]byte, error) {
	tmpl, err := template.New("compile-preview").Parse(content)
	if err != nil {
		return nil, err
	}

	var t bytes.Buffer
	err = tmpl.Execute(&t, data)
	if err != nil {
		return nil, err
	}

	typstCaller := typst.CLI{}

	var w bytes.Buffer
	err = typstCaller.Compile(&t, &w, nil)
	if err != nil {
		return nil, err
	}

	return w.Bytes(), nil
}
