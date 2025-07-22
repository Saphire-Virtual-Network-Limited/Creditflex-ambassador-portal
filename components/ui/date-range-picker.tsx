"use client"

import { useState, useRef, useEffect } from "react"
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DateRangePickerProps {
  startDate?: Date
  endDate?: Date
  onDateRangeChange?: (startDate: Date, endDate: Date) => void
  className?: string
}

export default function DateRangePicker({
  startDate = new Date(),
  endDate = new Date(),
  onDateRangeChange,
  className = ""
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(startDate)
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(endDate)
  const [selectingEndDate, setSelectingEndDate] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const formatDate = (date: Date) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]
    const month = months[date.getMonth()]
    const day = date.getDate()
    const year = date.getFullYear()
    
    return { month, day, year }
  }

  const formatDateRange = () => {
    if (!selectedStartDate || !selectedEndDate) return "Select date range"
    
    const start = formatDate(selectedStartDate)
    const end = formatDate(selectedEndDate)
    
    return `${start.month} ${start.day}, ${start.year} - ${end.month} ${end.day}`
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const handleDateClick = (date: Date) => {
    if (!selectingEndDate) {
      setSelectedStartDate(date)
      setSelectedEndDate(null)
      setSelectingEndDate(true)
    } else {
      if (date >= selectedStartDate!) {
        setSelectedEndDate(date)
        setSelectingEndDate(false)
        if (onDateRangeChange) {
          onDateRangeChange(selectedStartDate!, date)
        }
        setIsOpen(false)
      } else {
        setSelectedStartDate(date)
        setSelectedEndDate(null)
      }
    }
  }

  // const isDateSelected = (date: Date) => {
  //   if (!selectedStartDate || !selectedEndDate) {
  //     return date.getTime() === selectedStartDate?.getTime()
  //   }
  //   return date >= selectedStartDate && date <= selectedEndDate
  // }

  const isDateInRange = (date: Date) => {
    if (!selectedStartDate || !selectedEndDate) return false
    return date > selectedStartDate && date < selectedEndDate
  }

  const isStartDate = (date: Date) => {
    return selectedStartDate && date.getTime() === selectedStartDate.getTime()
  }

  const isEndDate = (date: Date) => {
    return selectedEndDate && date.getTime() === selectedEndDate.getTime()
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectingEndDate(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const days = getDaysInMonth(currentMonth)
  const monthName = formatDate(currentMonth).month
  const year = currentMonth.getFullYear()

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between bg-white border-gray-200 hover:bg-gray-50 text-gray-700 font-normal"
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-600" />
          <span>{formatDateRange()}</span>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-600" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[280px]">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevMonth}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-medium text-gray-900">
                {monthName} {year}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextMonth}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-xs text-gray-500 text-center py-1">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((date, index) => (
                <div key={index} className="h-8 flex items-center justify-center">
                  {date ? (
                    <button
                      onClick={() => handleDateClick(date)}
                      className={`w-8 h-8 text-sm rounded-full flex items-center justify-center transition-colors ${
                        isStartDate(date) || isEndDate(date)
                          ? 'bg-blue-600 text-white'
                          : isDateInRange(date)
                          ? 'bg-blue-100 text-blue-600'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  ) : (
                    <div className="w-8 h-8" />
                  )}
                </div>
              ))}
            </div>

            {/* Instructions */}
            {selectingEndDate && (
              <div className="mt-3 text-xs text-blue-600 text-center">
                Select end date
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 