import { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Picker } from '@tarojs/components'
import './index.scss'

export default function Index() {
  const [cityName, setCityName] = useState('上海')
  
  // 初始化日期：今天和明天
  const [startDate, setStartDate] = useState('2026-01-30')
  const [endDate, setEndDate] = useState('2026-01-31')

  // 计算天数
  const calcDays = () => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
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

  return (
    <View className='index'>
      {/* 顶部沉浸式背景 */}
      <View className='header-section'>
        <Image className='bg-image' src='https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800' mode='aspectFill' />
        <View className='header-content'>
          <Text className='slogan'>发现世界的美好</Text>
          <Text className='sub-slogan'>找到最适合你的星级酒店</Text>
        </View>
      </View>

      {/* 核心搜索卡片 */}
      <View className='main-card' style={{ marginTop: '-40px' }}>
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
              <Picker mode='date' value={startDate} onChange={e => setStartDate(e.detail.value)}>
                <Text className='date-val' style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  {startDate.split('-').slice(1).join('月')}日
                </Text>
              </Picker>
              <Text style={{ margin: '0 15px', color: '#ccc' }}>—</Text>
              <Picker mode='date' value={endDate} onChange={e => setEndDate(e.detail.value)}>
                <Text className='date-val' style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  {endDate.split('-').slice(1).join('月')}日
                </Text>
              </Picker>
            </View>
          </View>
          <View className='day-count' style={{ background: '#f0f7ff', color: '#0086f6', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
            共{calcDays()}晚
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