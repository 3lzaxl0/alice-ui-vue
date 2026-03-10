import { type Ref } from 'vue'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import type { Column } from '../../../types'

export function useTableExport<T>(
  data: Ref<T[]>,
  columns: Ref<Column<T>[]>,
  tableId: Ref<string | undefined>,
) {
  const exportToExcel = async () => {
    try {
      // 1. Create Workbook and Worksheet
      const workbook = new ExcelJS.Workbook()
      workbook.creator = 'AliceUI Export'
      workbook.created = new Date()

      const sheetName = tableId.value ? `Export_${tableId.value}` : 'Export'
      const worksheet = workbook.addWorksheet(sheetName, {
        views: [{ state: 'frozen', ySplit: 1 }], // Freeze header row
      })

      // 2. Setup Columns based on currently visible columns
      const exportColumns = columns.value.filter((col) => !col.hidden && col.key !== 'actions')

      worksheet.columns = exportColumns.map((col) => {
        const isDateColumn = col.type === 'date' || !!col.dateFormat
        let numFmt: string | undefined = undefined
        if (isDateColumn) {
          numFmt =
            col.dateFormat === 'short' || col.dateFormat === 'raw'
              ? 'dd/mm/yyyy'
              : 'dd/mm/yyyy hh:mm'
        }

        return {
          header: String(col.header || col.key),
          key: String(col.key),
          width: isDateColumn ? 22 : 20,
          style: numFmt ? { numFmt } : undefined,
        }
      })

      // 3. Add Data Rows
      data.value.forEach((row) => {
        const rowData: Record<string, unknown> = {}
        exportColumns.forEach((col) => {
          const rowRecord = row as Record<string, unknown>
          let value = rowRecord[col.key as string]
          const isDateColumn = col.type === 'date' || !!col.dateFormat

          // Native Excel date parsing
          if (isDateColumn && typeof value === 'string' && value.trim() !== '') {
            const parsedDate = new Date(value)
            if (!isNaN(parsedDate.getTime())) {
              value = parsedDate
            }
          }
          // Use the format function if provided in the column definition
          else if (col.formatter && typeof col.formatter === 'function') {
            value = col.formatter(value)

            // If the formatted value is a Vue VNode or object, fallback to raw value or empty string
            if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
              value = rowRecord[col.key as string]
            }
          }

          rowData[String(col.key)] = value
        })
        worksheet.addRow(rowData)
      })

      // 4. Style Header Row
      const headerRow = worksheet.getRow(1)
      headerRow.font = { bold: true, color: { argb: 'FF000000' } } // Black text

      // Apply pastel yellow background
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFF2CC' }, // Pastel Yellow
        }

        // Add subtle borders to header
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        }
      })

      // 5. Enable AutoFilter
      if (exportColumns.length > 0) {
        worksheet.autoFilter = {
          from: { row: 1, column: 1 },
          to: { row: 1, column: exportColumns.length },
        }
      }

      // 6. Generate File and Trigger Download
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const fileName = `${sheetName}_${new Date().toISOString().split('T')[0]}.xlsx`
      saveAs(blob, fileName)

      return true
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      return false
    }
  }

  return {
    exportToExcel,
  }
}
