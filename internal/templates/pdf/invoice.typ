#set page(
  paper: "us-letter",
  margin: (x: 0.5in, y: 0.5in),
)
#set text(
  font: "Poppins",
  size: 11pt,
)

#let products-table() = [
   #table(
      columns: (2fr, 1.5fr, 1.5fr, 1fr, 1fr, 1.5fr),
      stroke: 1pt + black,
      align: (left, left, left, left, left, left),
      inset: 5pt,

      // Header row
      table.header(
        [*Item*], [*Product ID*], [*Price-Per-Item*], [*Quantity*], [*Discount*], [*Total Price*]
      ),

      {{range .Products}}
        [{{.Name}}],[{{.ProductID}}],[{{.Price}}],[{{.Quantity}}],[#text(fill:green)[{{.Discount}}]],[{{.Total}}],
      {{end}}
    )
    #v(10pt)
    // Totals section
     #align(right)[
       #block(breakable: false)[
            #table(
              columns: (2fr, 1.5fr),
              stroke: none,
              align: (left, center),
              inset: 5pt,
      
              [Product Total], [\${{.ProductTotal}}],
              [Discount], [#text(fill: green)[\${{.DiscountTotal}}]],
              [Installation/Measurement], [\${{.Install}}],
              [Shipping], [\${{.Shipping}}],
             [Tax], [\${{.Tax}}],
      
              table.hline(stroke: 1pt + black),
              [*Total*], [*\${{.Total}}*],
              table.hline(stroke: 1pt + black),
            )
          ]
      ]
]

#let invoice-header() = {
    align(center)[
      #text(size: 22pt, weight: "bold")[VIEWRAIL]
    ]
}
#let invoice-footer() ={
  align(center + horizon)[
    #text(size: 9pt, fill: rgb("#777777"))[
      © Iron Baluster, LLC - 2024. All Rights Reserved. The unauthorized reproduction or distribution of this material is strictly prohibited.
    ]
  ]
}

// Main document - everything in the content area
  // Invoice Header Section
#page(
  header: invoice-header(), 
  footer: invoice-footer(),
  margin: (
    top: 80pt,
  )
)[
  #pad(top: 10pt)[
    #text(size: 22pt)[Invoice]

    #grid(
      columns: (1fr, 1fr),
      gutter: 20pt,

      // Left column - Company Info
      [
        #text(size: 13pt)[
          *Viewrail*\
          1722 Eisenhower Dr N\
          Goshen IN 46526
        ]
      ],

      // Right column - Invoice Info
      [
        #text(size: 13pt)[
          *Invoice Information*\
          Job Name: {{.Name}}\
          Project \#: {{.OrderNumber}}\
          Invoice Date: December 10, 2024 ET\
          Payment Term: *Net 30*
        ]
      ]
    )

    #v(10pt)

    #grid(
      columns: (1fr, 1fr),
      gutter: 20pt,

      // Shipping Address
      [
        #text(size: 13pt)[
          *Shipping Address*\
          John Smith\
          456 Oak Street Apt 2B\
          Portland, OR 97201\
          United States
        ]
      ],

      // Billing Address
      [
        #text(size: 13pt)[
          *Billing Address*\
          John Smith\
          456 Oak Street Apt 2B\
          Portland, OR 97201\
          United States
        ]
      ]
    )

    #v(15pt)
    #products-table()
  ]
]


  

