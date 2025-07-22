"use client"

import type React from "react"
import { Button, Select, SelectItem } from "@heroui/react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

export interface Column {
  key: string
  header: string
  width?: string
  render?: (value: any, row: any) => React.ReactNode
}

interface DataTableProps {
  data: any[]
  columns: Column[]
  totalItems: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function DataTable({
  data,
  columns,
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: DataTableProps) {
  const totalPages = Math.ceil(totalItems / pageSize)
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((column) => (
                <th key={column.key} className={`text-left py-3 px-4 font-semibold text-xs text-lightBrown ${column.width || ""}`}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="py-3 px-4 text-darkCharcoal text-xs font-medium">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Rows per page:</span>
          <Select
            size="sm"
            selectedKeys={[pageSize.toString()]}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string
              onPageSizeChange(Number(value))
            }}
            classNames={{
              base: "w-32 bg-gray-100 appearance-none",
              trigger: "bg-gray-100 min-h-unit-8 appearance-none",
              value: "text-gray-700",
              listboxWrapper: "bg-white border border-gray-200",
              listbox: "bg-white",
            }}
          >
            <SelectItem key="10" value="10">
              10
            </SelectItem>
            <SelectItem key="11" value="11">
              11
            </SelectItem>
            <SelectItem key="25" value="25">
              25
            </SelectItem>
            <SelectItem key="50" value="50">
              50
            </SelectItem>
            <SelectItem key="100" value="100">
              100
            </SelectItem>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {startItem}-{endItem} of {totalItems}
          </span>

          <div className="flex items-center gap-1">
            <Button isIconOnly size="sm" variant="light" onPress={() => onPageChange(1)} isDisabled={currentPage === 1}>
              <ChevronLeftIcon className="w-4 h-4" />
              <ChevronLeftIcon className="w-4 h-4 -ml-2" />
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => onPageChange(currentPage - 1)}
              isDisabled={currentPage === 1}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>

            {getVisiblePages().map((page, index) => (
              <Button
                key={index}
                size="sm"
                variant={page === currentPage ? "solid" : "light"}
                color={page === currentPage ? "primary" : "default"}
                onPress={() => typeof page === "number" && onPageChange(page)}
                isDisabled={page === "..."}
                className="min-w-8"
              >
                {page}
              </Button>
            ))}

            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => onPageChange(currentPage + 1)}
              isDisabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => onPageChange(totalPages)}
              isDisabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="w-4 h-4" />
              <ChevronRightIcon className="w-4 h-4 -ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
