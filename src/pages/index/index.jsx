import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Picker, Swiper, SwiperItem } from '@tarojs/components'
import { bannerData, getHotelById } from '../../mockData'
import './index.scss'

export default function Index() {
  const [cityName, setCityName] = useState('上海')

  // 从 mockData 获取 banner 数据，并关联酒店信息
  const banners = bannerData.map(banner => ({
    ...banner,
    hotel: getHotelById(banner.hotelId, cityName)
  }))

  const [currentBanner, setCurrentBanner] = useState(0)

  // 处理轮播图切换
  const handleSwiperChange = (e) => {
    setCurrentBanner(e.detail.current)
  }

  // 上一张
  const handlePrevBanner = (e) => {
    e.stopPropagation()
    setCurrentBanner((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
  }

  // 下一张
  const handleNextBanner = (e) => {
    e.stopPropagation()
    setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
  }

  // 辅助函数：获取日期字符串 (YYYY-MM-DD)
  const formatDateStr = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // 辅助函数：格式化显示 (月-日 周几)
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

  // 初始化日期：今天和明天
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const [startDate, setStartDate] = useState(formatDateStr(today))
  const [endDate, setEndDate] = useState(formatDateStr(tomorrow))

  // 计算天数
  const calcDays = () => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
  }

  // 处理入住日期变更
  const handleStartDateChange = (e) => {
    const newStartStr = e.detail.value
    setStartDate(newStartStr)

    // 如果入住日期晚于或等于离店日期，则自动将离店日期设为入住日期后一天
    const newStart = new Date(newStartStr)
    const currentEnd = new Date(endDate)
    if (newStart >= currentEnd) {
      const nextDay = new Date(newStart)
      nextDay.setDate(newStart.getDate() + 1)
      setEndDate(formatDateStr(nextDay))
    }
  }

  // 处理离店日期变更
  const handleEndDateChange = (e) => {
    const newEndStr = e.detail.value
    const newEnd = new Date(newEndStr)
    const currentStart = new Date(startDate)

    if (newEnd <= currentStart) {
      Taro.showToast({
        title: '离店日期需晚于入住日期',
        icon: 'none'
      })
      return
    }
    setEndDate(newEndStr)
  }

  const changeCity = () => {
    Taro.showModal({
      title: '选择目的地',
      editable: true,
      success: (res) => {
        if (res.confirm && res.content) setCityName(res.content)
      }
    })
  }

  const handleSearch = () => {
    Taro.navigateTo({
      url: `/pages/list/index?city=${cityName}&start=${startDate}&end=${endDate}`
    })
  }

  const handleBannerClick = (hotel) => {
    Taro.navigateTo({
      url: `/pages/detail/index?name=${hotel.name}&price=${hotel.price}&star=${hotel.star}&img=${encodeURIComponent(hotel.img)}`
    })
  }

  const startDisplay = getDisplayDate(startDate)
  const endDisplay = getDisplayDate(endDate)

  return (
    <View className='index'>
      {/* 顶部轮播 Banner */}
      <View className='header-section'>
        <Swiper
          className='banner-swiper'
          indicatorColor='rgba(255,255,255,0.5)'
          indicatorActiveColor='#fff'
          circular
          indicatorDots
          autoplay
          interval={5000}
          current={currentBanner}
          onChange={handleSwiperChange}
        >
          {banners.map(banner => (
            <SwiperItem key={banner.id} onClick={() => handleBannerClick(banner.hotel)}>
              <Image className='bg-image' src={banner.img} mode='aspectFill' />
              <View className='header-content'>
                <Text className='slogan'>{banner.title}</Text>
                <Text className='sub-slogan'>{banner.subTitle}</Text>
              </View>
            </SwiperItem>
          ))}
        </Swiper>

        {/* 左右箭头 */}
        <View className='arrow-left' onClick={handlePrevBanner}>
          <Text className='arrow-icon'>‹</Text>
        </View>
        <View className='arrow-right' onClick={handleNextBanner}>
          <Text className='arrow-icon'>›</Text>
        </View>
      </View>

      {/* 核心搜索卡片 */}
      <View className='main-card'>
        {/* 目的地选择 */}
        <View className='location-row' onClick={changeCity} style={{ borderBottom: '1px solid #f5f5f5', paddingBottom: '15px' }}>
          <View className='city-box'>
            <Text className='label'>目的地</Text>
            <Text className='city-name'>{cityName}</Text>
          </View>
          <Text style={{ color: '#999', fontSize: '12px' }}>修改</Text>
        </View>

        {/* 日期选择区 */}
        <View className='date-row' style={{ padding: '15px 0' }}>
          <View className='date-box'>
            <Text className='label'>入住 - 离店</Text>
            <View className='picker-group' style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
              <Picker mode='date' value={startDate} start={formatDateStr(today)} onChange={handleStartDateChange}>
                <View className='date-display'>
                  <Text className='date-val' style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    {startDisplay.monthDay}
                  </Text>
                  <Text className='date-week' style={{ fontSize: '12px', color: '#666', marginLeft: '4px' }}>
                    {startDisplay.weekDay}
                  </Text>
                </View>
              </Picker>
              <View className='date-divider' style={{ margin: '0 10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Text style={{ color: '#ccc', fontSize: '12px' }}>—</Text>
                <View className='day-count' style={{ background: '#f0f7ff', color: '#0086f6', padding: '1px 6px', borderRadius: '10px', fontSize: '10px', marginTop: '2px' }}>
                  {calcDays()}晚
                </View>
              </View>
              <Picker mode='date' value={endDate} start={startDate} onChange={handleEndDateChange}>
                <View className='date-display'>
                  <Text className='date-val' style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    {endDisplay.monthDay}
                  </Text>
                  <Text className='date-week' style={{ fontSize: '12px', color: '#666', marginLeft: '4px' }}>
                    {endDisplay.weekDay}
                  </Text>
                </View>
              </Picker>
            </View>
          </View>
        </View>

        {/* 搜索按钮 */}
        <View className='search-btn' onClick={handleSearch} style={{ marginTop: '10px' }}>
          开始搜索
        </View>
      </View>

      {/* 底部留白，增加呼吸感 */}
      <View style={{ height: '50px' }}></View>
    </View>
  )
}