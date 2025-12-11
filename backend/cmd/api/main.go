package main

import (
	"bytes"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"pdfgen/internal/templates"

	"github.com/Dadido3/go-typst"
	"github.com/go-chi/chi/v5"
)

func main() {
	r := chi.NewRouter()

	r.Get("/generate/{template}", GenerateTemplate)
	r.Get("/generatebytes", GenerateTemplateBytes)

	log.Println("Starting server on :1234")
	if err := http.ListenAndServe(":1234", r); err != nil {
		panic(err)
	}
}

type Invoice struct {
	Products      []Product
	ProductTotal  string
	DiscountTotal string
	Install       string
	Shipping      string
	Tax           string
	Total         string
	Name          string
	OrderNumber   string
}

type Product struct {
	Name      string
	ProductID string
	Price     string
	Quantity  string
	Discount  string
	Total     string
}

func GenerateTemplate(w http.ResponseWriter, r *http.Request) {
	products := []Product{}

	for i := range 30 {
		products = append(products, Product{
			Name:      "Cable Wire Spool - 500ft",
			ProductID: fmt.Sprintf("VR-CWS-500-%d", i),
			Price:     "425.00",
			Quantity:  "1",
			Discount:  "42.50",
			Total:     "382.50",
		})
	}
	invoice := Invoice{
		Products:      products,
		ProductTotal:  "9,364.00",
		DiscountTotal: "242.90",
		Install:       "1,500.00",
		Shipping:      "350.00",
		Tax:           "785.42",
		Total:         "11,756.52",
		Name:          "Test Invoice",
		OrderNumber:   "196690-01",
	}
	tmpl, err := template.ParseFS(templates.Pdfs, "pdf/invoice.typ")
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	var t bytes.Buffer
	err = tmpl.Execute(&t, invoice)
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

func GenerateTemplateBytes(w http.ResponseWriter, r *http.Request) {
	products := []Product{}

	for i := range 6 {
		products = append(products, Product{
			Name:      "Cable Wire Spool - 500ft",
			ProductID: fmt.Sprintf("VR-CWS-500-%d", i),
			Price:     "425.00",
			Quantity:  "1",
			Discount:  "42.50",
			Total:     "382.50",
		})
	}
	invoice := Invoice{
		Products:      products,
		ProductTotal:  "9,364.00",
		DiscountTotal: "242.90",
		Install:       "1,500.00",
		Shipping:      "350.00",
		Tax:           "785.42",
		Total:         "11,756.52",
		Name:          "Test Invoice",
		OrderNumber:   "196690-01",
	}
	tmpl, err := template.ParseFS(templates.Pdfs, "pdf/invoice.typ")
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	err = tmpl.Execute(w, invoice)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

}
