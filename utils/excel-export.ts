import * as XLSX from "xlsx"

export interface ExcelColumn {
  key: string
  label: string
  width?: number
  type?: "string" | "number" | "currency" | "percentage" | "date"
}

export class ExcelExporter {
  private formatCellValue(value: any, type = "string"): any {
    if (value === null || value === undefined) return ""

    switch (type) {
      case "currency":
        return typeof value === "number" ? value : Number.parseFloat(value) || 0
      case "percentage":
        return typeof value === "number" ? value / 100 : (Number.parseFloat(value) || 0) / 100
      case "number":
        return typeof value === "number" ? value : Number.parseFloat(value) || 0
      case "date":
        return value instanceof Date ? value : new Date(value)
      default:
        return String(value)
    }
  }

  private setColumnFormats(worksheet: XLSX.WorkSheet, columns: ExcelColumn[], dataLength: number) {
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1")

    columns.forEach((column, colIndex) => {
      const colLetter = XLSX.utils.encode_col(colIndex)

      // Set column width
      if (!worksheet["!cols"]) worksheet["!cols"] = []
      worksheet["!cols"][colIndex] = { wch: column.width || 15 }

      // Set cell formats for data rows (skip header)
      for (let rowIndex = 1; rowIndex <= dataLength; rowIndex++) {
        const cellAddress = `${colLetter}${rowIndex + 1}`
        const cell = worksheet[cellAddress]

        if (cell && column.type) {
          switch (column.type) {
            case "currency":
              cell.z = "$#,##0.00"
              break
            case "percentage":
              cell.z = "0.00%"
              break
            case "number":
              cell.z = "#,##0"
              break
            case "date":
              cell.z = "mm/dd/yyyy"
              break
          }
        }
      }
    })
  }

  public exportToExcel(data: any[], columns: ExcelColumn[], filename: string, sheetName = "Sheet1") {
    try {
      // Prepare data with proper formatting
      const formattedData = data.map((row) => {
        const formattedRow: any = {}
        columns.forEach((column) => {
          formattedRow[column.label] = this.formatCellValue(row[column.key], column.type)
        })
        return formattedRow
      })

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(formattedData)

      // Apply formatting
      this.setColumnFormats(worksheet, columns, data.length)

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

      // Generate file and trigger download
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      alert("Gagal mengexport data ke Excel")
    }
  }

  // Customer export
  public exportCustomersToExcel(customers: any[]) {
    const columns: ExcelColumn[] = [
      { key: "name", label: "Nama", width: 20 },
      { key: "email", label: "Email", width: 25 },
      { key: "phone", label: "Telepon", width: 15 },
      { key: "propertyInterest", label: "Minat Properti", width: 20 },
      { key: "status", label: "Status", width: 12 },
      { key: "createdAt", label: "Tanggal Dibuat", width: 15, type: "date" },
    ]

    const timestamp = new Date().toISOString().split("T")[0]
    this.exportToExcel(customers, columns, `Data_Klien_${timestamp}.xlsx`, "Klien")
  }

  // Financial export
  public exportFinancialToExcel(transactions: any[]) {
    const columns: ExcelColumn[] = [
      { key: "type", label: "Jenis", width: 15 },
      { key: "description", label: "Deskripsi", width: 25 },
      { key: "amount", label: "Jumlah", width: 15, type: "currency" },
      { key: "client", label: "Klien", width: 20 },
      { key: "property", label: "Properti", width: 20 },
      { key: "date", label: "Tanggal", width: 12, type: "date" },
      { key: "status", label: "Status", width: 12 },
      { key: "createdAt", label: "Dibuat", width: 15, type: "date" },
    ]

    const timestamp = new Date().toISOString().split("T")[0]
    this.exportToExcel(transactions, columns, `Laporan_Keuangan_${timestamp}.xlsx`, "Transaksi")
  }

  // Marketing export
  public exportMarketingToExcel(campaigns: any[]) {
    // Add calculated fields to campaigns
    const enrichedCampaigns = campaigns.map((campaign) => ({
      ...campaign,
      roi:
        campaign.conversions && campaign.spent
          ? ((campaign.conversions * 1000 - campaign.spent) / campaign.spent) * 100
          : 0,
      conversionRate: campaign.leads && campaign.conversions ? (campaign.conversions / campaign.leads) * 100 : 0,
      costPerLead: campaign.leads && campaign.spent ? campaign.spent / campaign.leads : 0,
      costPerConversion: campaign.conversions && campaign.spent ? campaign.spent / campaign.conversions : 0,
    }))

    const columns: ExcelColumn[] = [
      { key: "name", label: "Nama Kampanye", width: 25 },
      { key: "type", label: "Jenis", width: 15 },
      { key: "budget", label: "Anggaran", width: 15, type: "currency" },
      { key: "spent", label: "Terpakai", width: 15, type: "currency" },
      { key: "leads", label: "Prospek", width: 10, type: "number" },
      { key: "conversions", label: "Konversi", width: 10, type: "number" },
      { key: "roi", label: "ROI (%)", width: 10, type: "percentage" },
      { key: "conversionRate", label: "Tingkat Konversi (%)", width: 18, type: "percentage" },
      { key: "costPerLead", label: "Biaya per Prospek", width: 18, type: "currency" },
      { key: "costPerConversion", label: "Biaya per Konversi", width: 20, type: "currency" },
      { key: "startDate", label: "Tanggal Mulai", width: 15, type: "date" },
      { key: "endDate", label: "Tanggal Selesai", width: 15, type: "date" },
      { key: "status", label: "Status", width: 12 },
    ]

    const timestamp = new Date().toISOString().split("T")[0]
    this.exportToExcel(enrichedCampaigns, columns, `Laporan_Pemasaran_${timestamp}.xlsx`, "Kampanye")
  }
}
