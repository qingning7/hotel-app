import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, Image, Button, Swiper, SwiperItem, Picker } from '@tarojs/components'
import { useState } from 'react'
import { getHotelById } from '../../mockData'
import CalendarModal from '../../components/CalendarModal'
import './index.scss'

export default function Detail() {
  const router = useRouter()
  const { name, price, img, star, id, city } = router.params
  const [selectedRoomId, setSelectedRoomId] = useState(null)

  // 日历与人数房间选择
  const formatDateStr = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const getDisplayDate = (dateStr) => {
    const date = new Date(dateStr)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const weekDay = weekDays[date.getDay()]
    return {
      monthDay: `${month}月${day}日`,
      weekDay: weekDay
    }
  }

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const [startDate, setStartDate] = useState(formatDateStr(today))
  const [endDate, setEndDate] = useState(formatDateStr(tomorrow))
  const [guestIndex, setGuestIndex] = useState(0)
  const [roomIndex, setRoomIndex] = useState(0)
  const [calendarVisible, setCalendarVisible] = useState(false)
  const [calendarField, setCalendarField] = useState('start')

  const guestOptions = ['1人', '2人', '3人', '4人', '5人', '6人']
  const roomOptions = ['1间', '2间', '3间', '4间']

  const openCalendar = (field = 'start') => {
    setCalendarField(field)
    setCalendarVisible(true)
  }

  const closeCalendar = () => {
    setCalendarVisible(false)
  }

  const handleCalendarConfirm = (newStart, newEnd) => {
    setStartDate(newStart)
    setEndDate(newEnd)
    setCalendarVisible(false)
  }

  const calcDays = () => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
  }


  const handleGuestChange = (e) => {
    setGuestIndex(Number(e.detail.value))
  }

  const handleRoomChange = (e) => {
    setRoomIndex(Number(e.detail.value))
  }
  
  // 获取当前酒店的完整信息（包含房型数据）
  const hotelId = Number(id)
  const hotelData = getHotelById(hotelId, city || '上海')
  const roomTypes = (hotelData && hotelData.roomTypes) ? hotelData.roomTypes : []
  const hotelNameEn = (hotelData && hotelData.nameEn) ? hotelData.nameEn : ''
  const hotelAddress = (hotelData && hotelData.address) ? hotelData.address : ''
  const hotelRoomType = (hotelData && hotelData.roomType) ? hotelData.roomType : ''
  const hotelOpened = (hotelData && hotelData.opened) ? hotelData.opened : ''
  const hotelDesc = (hotelData && hotelData.desc)
    ? hotelData.desc
    : '这家极具风情的豪华酒店，坐落于城市核心地段，拥有绝佳的视野和一流的服务设施。'
  const fallbackImg = decodeURIComponent(img) || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
  const hotelImages = (hotelData && hotelData.images && hotelData.images.length)
    ? hotelData.images
    : [fallbackImg]

  const renderStars = (count) => {
    return '⭐'.repeat(Number(count) || 0)
  }

  // 处理房型选择
  const handleSelectRoom = (roomId) => {
    setSelectedRoomId(selectedRoomId === roomId ? null : roomId)
  }

  // 处理预订
  const handleBook = () => {
    if (selectedRoomId) {
      const selectedRoom = roomTypes.find(room => room.id === selectedRoomId)
      Taro.showToast({ 
        //title: `预订成功！\n已选择：${selectedRoom.name}`, 
        //上一行显示不全，只能把已选择的删除了
        title: '预订成功!', 
        icon: 'success' 
      })
    } else {
      Taro.showToast({ 
        title: '请先选择房型', 
        icon: 'error',
        mask: true 
      })
    }
  }

  const startDisplay = getDisplayDate(startDate)
  const endDisplay = getDisplayDate(endDate)
  const selectedRoom = roomTypes.find(room => room.id === selectedRoomId)
  const roomCount = roomIndex + 1
  const totalPrice = selectedRoom ? selectedRoom.price * roomCount * calcDays() : 0

  return (
    <View className='detail-page'>
      <Swiper
        className='detail-banner'
        circular
        indicatorDots
        autoplay
        interval={4000}
      >
        {hotelImages.map((src, index) => (
          <SwiperItem key={`${hotelId}-${index}`}>
            <Image className='detail-img' src={src} mode='aspectFill' />
          </SwiperItem>
        ))}
      </Swiper>

      <View className='info-section'>
        <View className='title-row' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <View className='title-block'>
            <Text className='hotel-title' style={{ flex: 1 }}>{name || '酒店详情'}</Text>
            {hotelNameEn && <Text className='hotel-title-en'>{hotelNameEn}</Text>}
          </View>
          <Text style={{ color: '#ff9500', fontSize: '14px', marginLeft: '10px' }}>{renderStars(star)}</Text>
        </View>
        <View className='tags'>
          <Text className='tag'>五星级</Text>
          <Text className='tag'>含早餐</Text>
          <Text className='tag'>免费取消</Text>
        </View>

        <View className='price-box'>
          <Text className='label'>价格：</Text>
          <Text className='price'>¥{price || '---'}</Text>
          <Text className='unit'>/晚起</Text>
        </View>

        <View className='desc'>
          <Text className='desc-title'>酒店简介</Text>
          <Text className='desc-content'>
            {hotelDesc}
          </Text>
          <View className='meta-list'>
            <View className='meta-item'>
              <Text className='meta-label'>酒店地址</Text>
              <Text className='meta-value'>{hotelAddress || '-'}</Text>
            </View>
            <View className='meta-item'>
              <Text className='meta-label'>主力房型</Text>
              <Text className='meta-value'>{hotelRoomType || '-'}</Text>
            </View>
            <View className='meta-item'>
              <Text className='meta-label'>开业时间</Text>
              <Text className='meta-value'>{hotelOpened || '-'}</Text>
            </View>
          </View>
        </View>

        {/* 房型选择区域 */}
        <View className='room-section'>
          <Text className='room-title'>选择房型</Text>
          <View className='calendar-section'>
            <View className='calendar-card'>
              <View className='calendar-row'>
                <View className='date-picker' onClick={() => openCalendar('start')}>
                  <Text className='calendar-label'>入住</Text>
                  <View className='date-display'>
                    <Text className='date-value'>{startDisplay.monthDay}</Text>
                    <Text className='date-week'>{startDisplay.weekDay}</Text>
                  </View>
                </View>
                <View className='calendar-divider'>
                  <Text className='divider-line'>-</Text>
                  <View className='night-count'>{calcDays()}晚</View>
                </View>
                <View className='date-picker' onClick={() => openCalendar('end')}>
                  <Text className='calendar-label'>离店</Text>
                  <View className='date-display'>
                    <Text className='date-value'>{endDisplay.monthDay}</Text>
                    <Text className='date-week'>{endDisplay.weekDay}</Text>
                  </View>
                </View>
              </View>
              <View className='people-row'>
                <Picker mode='selector' range={guestOptions} value={guestIndex} onChange={handleGuestChange}>
                  <View className='people-item'>
                    <Text className='people-label'>人数</Text>
                    <Text className='people-value'>{guestOptions[guestIndex]}</Text>
                  </View>
                </Picker>
                <View className='people-divider'></View>
                <Picker mode='selector' range={roomOptions} value={roomIndex} onChange={handleRoomChange}>
                  <View className='people-item'>
                    <Text className='people-label'>房间</Text>
                    <Text className='people-value'>{roomOptions[roomIndex]}</Text>
                  </View>
                </Picker>
              </View>
            </View>
          </View>
          {roomTypes.map((room) => (
            <View 
              key={room.id} 
              className={`room-card ${selectedRoomId === room.id ? 'active' : ''}`}
              onClick={() => handleSelectRoom(room.id)}
            >
              <Image className='room-img' src={room.img} mode='aspectFill' />
              <View className='room-content'>
                <View className='room-header'>
                  <View className='room-left'>
                    <View className='room-name'>{room.name}</View>
                    <View className='room-meta'>
                      <Text className='meta-item'>{room.area}</Text>
                      <Text className='meta-item'>{room.bed}</Text>
                    </View>
                  </View>
                  <View className='room-right'>
                    <View className='room-price'>¥{room.price}</View>
                    {selectedRoomId === room.id && <Text className='check-icon'>✓</Text>}
                  </View>
                </View>
                <View className='room-features'>
                  {room.features.map((feature, idx) => (
                    <Text key={idx} className='feature-tag'>{feature}</Text>
                  ))}
                </View>
              </View>
              <View className='room-book-tag'>订</View>
            </View>
          ))}
          <View className='room-spacer'></View>
        </View>

      </View>

      <View className='bottom-bar'>
        <Button className='book-btn' onClick={handleBook}>
          <View className='book-btn-content'>
            {selectedRoomId ? (
              <>
                <Text className='book-total'>¥{totalPrice}</Text>
                <Text className='book-text'>立即预订</Text>
              </>
            ) : (
              <Text className='book-text'>请先选择房型</Text>
            )}
          </View>
        </Button>
      </View>

      <CalendarModal
        visible={calendarVisible}
        startDate={startDate}
        endDate={endDate}
        minDate={formatDateStr(today)}
        defaultField={calendarField}
        onClose={closeCalendar}
        onConfirm={handleCalendarConfirm}
      />
    </View>
  )
}
