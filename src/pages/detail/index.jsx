import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, Image, Button, Swiper, SwiperItem } from '@tarojs/components'
import { useState } from 'react'
import { getHotelById } from '../../mockData'
import './index.scss'

export default function Detail() {
  const router = useRouter()
  const { name, price, img, star, id, city } = router.params
  const [selectedRoomId, setSelectedRoomId] = useState(null)
  
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
            </View>
          ))}
          <View className='room-spacer'></View>
        </View>

        {/* 已选房型详情 */}
        {selectedRoomId && (
          <View className='selected-room-detail'>
            <View className='detail-header'>
              <Text className='detail-label'>已选房型详情</Text>
            </View>
            {(() => {
              const room = roomTypes.find(r => r.id === selectedRoomId)
              return (
                <View className='detail-content'>
                  <View className='detail-row'>
                    <Text className='detail-key'>房型名称</Text>
                    <Text className='detail-value'>{room.name}</Text>
                  </View>
                  <View className='detail-row'>
                    <Text className='detail-key'>房间面积</Text>
                    <Text className='detail-value'>{room.area}</Text>
                  </View>
                  <View className='detail-row'>
                    <Text className='detail-key'>床型配置</Text>
                    <Text className='detail-value'>{room.bed}</Text>
                  </View>
                  <View className='detail-row'>
                    <Text className='detail-key'>房间特色</Text>
                    <Text className='detail-value'>{room.features.join(' · ')}</Text>
                  </View>
                </View>
              )
            })()}
          </View>
        )}
      </View>

      <View className='bottom-bar'>
        <Button className='book-btn' onClick={handleBook}>
          {selectedRoomId ? '立即预订' : '请先选择房型'}
        </Button>
      </View>
    </View>
  )
}
