import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem, ScrollView } from '@tarojs/components'
import { getBannersByCity, getHotelById, getHotelsByCity } from '../../mockData'
import CalendarModal from '../../components/CalendarModal'
import './index.scss'

const GEO_KEY = __TENCENT_MAP_KEY__

const normalizeCityName = (name = '') => name.trim().replace(/市$/, '')

export default function Index() {
  const [cityName, setCityName] = useState('上海')
  const [locating, setLocating] = useState(false)
  const hotCities = ['上海', '北京', '广州', '深圳', '成都', '杭州', '重庆', '三亚']
  const [recommendCity, setRecommendCity] = useState(hotCities[0])
  const hotCityCards = [
    { city: '上海', img: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=800&q=80' },
    { city: '北京', img: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80' },
    { city: '广州', img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80' },
    { city: '深圳', img: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80' },
    { city: '成都', img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80' },
    { city: '杭州', img: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80' },
    { city: '重庆', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80' },
    { city: '三亚', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' }
  ]

  // 从 mockData 获取 banner 数据，并关联酒店信息
  const banners = getBannersByCity(cityName).map(banner => ({
    ...banner,
    hotel: getHotelById(banner.hotelId, cityName)
  }))

  const [currentBanner, setCurrentBanner] = useState(0)

  useEffect(() => {
    if (hotCities.includes(cityName)) {
      setRecommendCity(cityName)
    }
  }, [cityName])

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
  const [calendarVisible, setCalendarVisible] = useState(false)
  const [calendarField, setCalendarField] = useState('start')

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

  // 计算天数
  const calcDays = () => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
  }

  // 处理入住日期变更

  const handleLocate = async (options = {}) => {
    const { silent = false } = options
    if (locating) return
    if (!GEO_KEY) {
      if (!silent) {
        Taro.showToast({
          title: '请配置定位服务 Key',
          icon: 'none'
        })
      }
      return
    }

    setLocating(true)
    try {
      const { latitude, longitude } = await Taro.getLocation({ type: 'gcj02' })
      const { data } = await Taro.request({
        url: 'https://apis.map.qq.com/ws/geocoder/v1/',
        data: {
          location: `${latitude},${longitude}`,
          key: GEO_KEY
        }
      })
      const status = data && typeof data.status !== 'undefined' ? Number(data.status) : -1
      if (status !== 0) {
        if (!silent) {
          Taro.showToast({
            title: (data && data.message) ? data.message : '定位服务异常',
            icon: 'none'
          })
        }
        return
      }

      const addressComponent = data && data.result && data.result.address_component
        ? data.result.address_component
        : null
      const city = addressComponent
        ? (addressComponent.city || addressComponent.province || addressComponent.district)
        : undefined
      if (city) {
        setCityName(normalizeCityName(city))
      } else {
        if (!silent) {
          Taro.showToast({
            title: '未获取到城市信息',
            icon: 'none'
          })
        }
      }
    } catch (error) {
      if (!silent) {
        Taro.showToast({
          title: '定位失败，可手动修改',
          icon: 'none'
        })
      }
    } finally {
      setLocating(false)
    }
  }

  useEffect(() => {
    handleLocate({ silent: true })
  }, [])

  const changeCity = () => {
    Taro.showModal({
      title: '选择目的地',
      editable: true,
      success: (res) => {
        if (res.confirm && res.content) {
          setCityName(normalizeCityName(res.content))
        }
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
      url: `/pages/detail/index?id=${hotel.id}&name=${hotel.name}&price=${hotel.price}&star=${hotel.star}&img=${encodeURIComponent(hotel.img)}&city=${cityName}`
    })
  }

  const handleHotCityClick = (city) => {
    setCityName(city)
  }

  const handleRecommendTab = (tab) => {
    setRecommendCity(tab)
  }

  const handleRecommendClick = (hotel) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${hotel.id}&name=${hotel.name}&price=${hotel.price}&star=${hotel.star}&img=${encodeURIComponent(hotel.img)}&city=${recommendCity}`
    })
  }

  const rotateHotels = (items, offset) => {
    if (!items.length) return items
    const shift = ((offset % items.length) + items.length) % items.length
    return items.slice(shift).concat(items.slice(0, shift))
  }

  const startDisplay = getDisplayDate(startDate)
  const endDisplay = getDisplayDate(endDate)
  const recommendIndex = hotCities.indexOf(recommendCity)
  const recommendHotels = rotateHotels(
    getHotelsByCity(recommendCity),
    recommendIndex === -1 ? 0 : recommendIndex
  ).slice(0, 4)
  const recommendTabs = hotCities

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
        <View className='location-row' style={{ borderBottom: '1px solid #f5f5f5', paddingBottom: '15px' }}>
          <View className='city-box'>
            <Text className='label'>目的地</Text>
            <Text className='city-name'>{cityName}</Text>
          </View>
          <View className='location-actions'>
            <Text className='gps-text' onClick={handleLocate}>{locating ? '定位中...' : '定位'}</Text>
            <Text className='edit-text' onClick={changeCity}>修改</Text>
          </View>
        </View>

        {/* 日期选择区 */}
        <View className='date-row' style={{ padding: '15px 0' }}>
          <View className='date-box'>
            <Text className='label'>入住 - 离店</Text>
            <View className='picker-group' style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
              <View className='date-display' onClick={() => openCalendar('start')}>
                <Text className='date-val' style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  {startDisplay.monthDay}
                </Text>
                <Text className='date-week' style={{ fontSize: '12px', color: '#666', marginLeft: '4px' }}>
                  {startDisplay.weekDay}
                </Text>
              </View>
              <View className='date-divider' style={{ margin: '0 10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Text style={{ color: '#ccc', fontSize: '12px' }}>—</Text>
                <View className='day-count' style={{ background: '#f0f7ff', color: '#0086f6', padding: '1px 6px', borderRadius: '10px', fontSize: '10px', marginTop: '2px' }}>
                  {calcDays()}晚
                </View>
              </View>
              <View className='date-display' onClick={() => openCalendar('end')}>
                <Text className='date-val' style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  {endDisplay.monthDay}
                </Text>
                <Text className='date-week' style={{ fontSize: '12px', color: '#666', marginLeft: '4px' }}>
                  {endDisplay.weekDay}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 搜索按钮 */}
        <View className='search-btn' onClick={handleSearch} style={{ marginTop: '10px' }}>
          开始搜索
        </View>
      </View>

      <View className='hot-city-section'>
        <View className='hot-city-header'>
          <Text className='hot-city-title'>热门城市</Text>
          <Text className='hot-city-sub'>精选目的地</Text>
        </View>
        <View className='hot-city-grid'>
          {hotCityCards.map((item) => (
            <View
              key={item.city}
              className='hot-city-card'
              onClick={() => handleHotCityClick(item.city)}
            >
              <Image className='hot-city-img' src={item.img} mode='aspectFill' />
              <View className='hot-city-overlay'></View>
              <View className='hot-city-info'>
                <Text className='hot-city-name'>{item.city}</Text>
                <Text className='hot-city-tag'>立即出发</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className='recommend-section'>
        <View className='recommend-header'>
          <Text className='recommend-title'>酒店推荐</Text>
          <Text className='recommend-tip'>热门城市</Text>
        </View>
        <ScrollView className='recommend-tabs' scrollX showScrollbar={false}>
          <View className='recommend-tab-track'>
            {recommendTabs.map((tab) => (
              <View
                key={tab}
                className={`recommend-tab ${recommendCity === tab ? 'active' : ''}`}
                onClick={() => handleRecommendTab(tab)}
              >
                {tab}
              </View>
            ))}
          </View>
        </ScrollView>
        <ScrollView className='recommend-list' scrollX showScrollbar={false}>
          <View className='recommend-track'>
            {recommendHotels.map((hotel) => (
              <View
                key={`${recommendCity}-${hotel.id}`}
                className='recommend-card'
                onClick={() => handleRecommendClick(hotel)}
              >
                <Image className='recommend-img' src={hotel.img} mode='aspectFill' />
                <View className='recommend-body'>
                  <Text className='recommend-name'>{hotel.name}</Text>
                  <View className='recommend-score'>
                    <Text className='score-badge'>{hotel.score}</Text>
                    <Text className='score-text'>{hotel.scoreDesc}</Text>
                    <Text className='score-reviews'>{hotel.reviews}条点评</Text>
                  </View>
                  <View className='recommend-price'>
                    <Text className='price-symbol'>¥</Text>
                    <Text className='price-value'>{hotel.price}</Text>
                    <Text className='price-unit'>/晚起</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={{ height: '50px' }}></View>

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
