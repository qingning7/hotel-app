import { useEffect, useMemo, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

const pad = (num) => String(num).padStart(2, '0')

const formatDateStr = (date) => {
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  return `${year}-${month}-${day}`
}

const parseDate = (dateStr) => {
  if (!dateStr) return null
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const addDays = (date, days) => {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

const formatDisplay = (dateStr) => {
  const date = parseDate(dateStr)
  if (!date) return ''
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${date.getMonth() + 1}月${date.getDate()}日 ${weekDays[date.getDay()]}`
}

export default function CalendarModal({
  visible,
  startDate,
  endDate,
  minDate,
  defaultField = 'start',
  onClose,
  onConfirm
}) {
  if (!visible) return null

  const todayStr = formatDateStr(new Date())
  const minDateStr = minDate || todayStr

  const normalizeStart = (value) => (value && value >= minDateStr ? value : minDateStr)
  const normalizeEnd = (startValue, endValue) => {
    if (endValue && endValue > startValue) return endValue
    return formatDateStr(addDays(parseDate(startValue), 1))
  }

  const [activeField, setActiveField] = useState(defaultField)
  const [draftStart, setDraftStart] = useState(normalizeStart(startDate))
  const [draftEnd, setDraftEnd] = useState(() => {
    const baseStart = normalizeStart(startDate)
    return normalizeEnd(baseStart, endDate)
  })
  const [viewMonth, setViewMonth] = useState(() => {
    const base = parseDate(startDate || minDateStr) || new Date()
    return new Date(base.getFullYear(), base.getMonth(), 1)
  })

  useEffect(() => {
    if (!visible) return
    const baseStart = normalizeStart(startDate)
    const baseEnd = normalizeEnd(baseStart, endDate)
    setDraftStart(baseStart)
    setDraftEnd(baseEnd)
    setActiveField(defaultField || 'start')
    const base = parseDate(baseStart) || new Date()
    setViewMonth(new Date(base.getFullYear(), base.getMonth(), 1))
  }, [visible, startDate, endDate, defaultField, minDateStr])

  const canPrevMonth = () => {
    const prevMonthEnd = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 0)
    return prevMonthEnd >= parseDate(minDateStr)
  }

  const handlePrevMonth = () => {
    if (!canPrevMonth()) return
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))
  }

  const calendarCells = useMemo(() => {
    const year = viewMonth.getFullYear()
    const month = viewMonth.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstWeekday = new Date(year, month, 1).getDay()
    const cells = []
    for (let i = 0; i < 42; i += 1) {
      const dayNum = i - firstWeekday + 1
      if (dayNum <= 0 || dayNum > daysInMonth) {
        cells.push(null)
      } else {
        cells.push(dayNum)
      }
    }
    return { year, month, cells }
  }, [viewMonth])

  const handleSelectDate = (dateStr, disabled) => {
    if (disabled) return
    if (activeField === 'start') {
      const startObj = parseDate(dateStr)
      let nextEnd = draftEnd
      if (!draftEnd || dateStr >= draftEnd) {
        nextEnd = formatDateStr(addDays(startObj, 1))
      }
      setDraftStart(dateStr)
      setDraftEnd(nextEnd)
      setActiveField('end')
      return
    }
    if (dateStr <= draftStart) {
      Taro.showToast({
        title: '离店日期需晚于入住日期',
        icon: 'none'
      })
      return
    }
    setDraftEnd(dateStr)
  }

  const handleConfirm = () => {
    if (onConfirm) onConfirm(draftStart, draftEnd)
  }

  return (
    <View className='calendar-modal'>
      <View className='calendar-mask' onClick={onClose}></View>
      <View className='calendar-panel' onClick={(e) => e.stopPropagation()}>
        <View className='calendar-header'>
          <View className={`nav-btn ${canPrevMonth() ? '' : 'disabled'}`} onClick={handlePrevMonth}>
            <Text className='nav-text'>‹</Text>
          </View>
          <Text className='month-title'>
            {calendarCells.year}年{calendarCells.month + 1}月
          </Text>
          <View className='nav-btn' onClick={handleNextMonth}>
            <Text className='nav-text'>›</Text>
          </View>
        </View>

        <View className='calendar-tabs'>
          <View
            className={`tab ${activeField === 'start' ? 'active' : ''}`}
            onClick={() => setActiveField('start')}
          >
            <Text className='tab-label'>入住</Text>
            <Text className='tab-value'>{formatDisplay(draftStart)}</Text>
          </View>
          <View
            className={`tab ${activeField === 'end' ? 'active' : ''}`}
            onClick={() => setActiveField('end')}
          >
            <Text className='tab-label'>离店</Text>
            <Text className='tab-value'>{formatDisplay(draftEnd)}</Text>
          </View>
        </View>

        <View className='week-row'>
          {['日', '一', '二', '三', '四', '五', '六'].map((label) => (
            <View className='week-cell' key={label}>
              <Text>{label}</Text>
            </View>
          ))}
        </View>

        <View className='calendar-grid'>
          {calendarCells.cells.map((day, index) => {
            if (!day) {
              return <View className='calendar-cell empty' key={`empty-${index}`}></View>
            }
            const dateStr = formatDateStr(new Date(calendarCells.year, calendarCells.month, day))
            const beforeMin = dateStr < minDateStr
            const invalidEnd = activeField === 'end' && dateStr <= draftStart
            const disabled = beforeMin || invalidEnd
            const isStart = dateStr === draftStart
            const isEnd = dateStr === draftEnd
            const inRange = draftStart && draftEnd && dateStr > draftStart && dateStr < draftEnd
            const isToday = dateStr === todayStr
            return (
              <View
                key={dateStr}
                className={`calendar-cell ${disabled ? 'disabled' : ''} ${isStart ? 'start' : ''} ${isEnd ? 'end' : ''} ${inRange ? 'range' : ''}`}
                onClick={() => handleSelectDate(dateStr, disabled)}
              >
                <Text className={`cell-text ${isToday ? 'today' : ''}`}>{day}</Text>
              </View>
            )
          })}
        </View>

        <View className='calendar-footer'>
          <View className='footer-info'>
            <Text>{formatDisplay(draftStart)}</Text>
            <Text className='footer-divider'> - </Text>
            <Text>{formatDisplay(draftEnd)}</Text>
          </View>
          <View className='footer-actions'>
            <View className='footer-btn cancel' onClick={onClose}>取消</View>
            <View className='footer-btn confirm' onClick={handleConfirm}>确定</View>
          </View>
        </View>
      </View>
    </View>
  )
}
