import { useState } from 'react' // 1. 关键：引入 useState
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, ScrollView, Image, Picker, Input } from '@tarojs/components'
import { getHotelsByCity } from '../../mockData'
import './index.scss'

export default function List() {
  const router = useRouter()
  const city = router.params.city || '上海'

  const [sortType, setSortType] = useState(0) // 0: 推荐, 1: 价格低到高, 2: 价格高到低
  const [starFilter, setStarFilter] = useState(0) // 0: 全部, 1: 3星, 2: 4星, 3: 5星
  const [priceFilter, setPriceFilter] = useState(0) // 0: 全部, 1: 1500以下, 2: 1500-2500, 3: 2500以上
  const [searchKeyword, setSearchKeyword] = useState('') // 搜索关键词

  const sortOptions = ['推荐排序', '价格低到高', '价格高到低']
  const starOptions = ['全部星级', '3星', '4星', '5星']
  const priceOptions = ['全部价格', '1500以下', '1500-2500', '2500以上']

  // 从 mockData 获取酒店数据
  const rawHotels = getHotelsByCity(city)

  // 过滤逻辑
  let filteredHotels = rawHotels.filter(hotel => {
    // 星级过滤
    const starMatch = starFilter === 0 || hotel.star === (starFilter + 2)

    // 价格过滤
    let priceMatch = true
    if (priceFilter === 1) priceMatch = hotel.price < 1500
    else if (priceFilter === 2) priceMatch = hotel.price >= 1500 && hotel.price <= 2500
    else if (priceFilter === 3) priceMatch = hotel.price > 2500

    // 关键词搜索过滤
    let keywordMatch = true
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase()
      keywordMatch =
        hotel.name.toLowerCase().includes(keyword) ||
        hotel.location.toLowerCase().includes(keyword) ||
        hotel.roomType.toLowerCase().includes(keyword) ||
        hotel.tags.some(tag => tag.toLowerCase().includes(keyword))
    }

    return starMatch && priceMatch && keywordMatch
  })

  // 排序逻辑
  if (sortType === 1) {
    filteredHotels.sort((a, b) => a.price - b.price)
  } else if (sortType === 2) {
    filteredHotels.sort((a, b) => b.price - a.price)
  }

  const handleHotelClick = (hotel) => {
    Taro.navigateTo({
      url: `/pages/detail/index?name=${hotel.name}&price=${hotel.price}&star=${hotel.star}&img=${encodeURIComponent(hotel.img)}`
    })
  }

  const renderStars = (count) => {
    return '⭐'.repeat(count)
  }

  return (
    <View className='list-page'>
      <View className='search-header'>
        <View className='city-select'>
          <Text className='city-name'>{city}</Text>
          <View className='arrow-down'></View>
        </View>
        <View className='search-input-box'>
          <Text className='search-icon'>🔍</Text>
          <Input
            className='search-input'
            type='text'
            placeholder='搜索酒店/地名/关键词'
            placeholderClass='search-placeholder'
            value={searchKeyword}
            onInput={(e) => setSearchKeyword(e.detail.value)}
          />
        </View>
      </View>

      <View className='filter-bar'>
        <Picker mode='selector' range={sortOptions} onChange={e => setSortType(Number(e.detail.value))}>
          <View className='filter-item' style={{ display: 'flex', alignItems: 'center' }}>
            <Text style={{ fontSize: '13px', color: sortType !== 0 ? '#0086F6' : '#333' }}>{sortOptions[sortType]}</Text>
            <View style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid #ccc', marginLeft: '4px' }}></View>
          </View>
        </Picker>

        <Picker mode='selector' range={starOptions} onChange={e => setStarFilter(Number(e.detail.value))}>
          <View className='filter-item' style={{ display: 'flex', alignItems: 'center' }}>
            <Text style={{ fontSize: '13px', color: starFilter !== 0 ? '#0086F6' : '#333' }}>{starOptions[starFilter]}</Text>
            <View style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid #ccc', marginLeft: '4px' }}></View>
          </View>
        </Picker>

        <Picker mode='selector' range={priceOptions} onChange={e => setPriceFilter(Number(e.detail.value))}>
          <View className='filter-item' style={{ display: 'flex', alignItems: 'center' }}>
            <Text style={{ fontSize: '13px', color: priceFilter !== 0 ? '#0086F6' : '#333' }}>{priceOptions[priceFilter]}</Text>
            <View style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid #ccc', marginLeft: '4px' }}></View>
          </View>
        </Picker>
      </View>

      <ScrollView scrollY className='hotel-list' style={{ height: 'calc(100vh - 45px)' }}>
        {filteredHotels.length > 0 ? filteredHotels.map(hotel => (
          <View key={hotel.id} className='hotel-card' onClick={() => handleHotelClick(hotel)}>
            <Image className='hotel-img' src={hotel.img} mode='aspectFill' />
            <View className='hotel-info'>
              <View className='name-row'>
                <Text className='hotel-name'>{hotel.name}</Text>
                <Text className='stars'>{renderStars(hotel.star)}</Text>
              </View>

              <View className='score-row'>
                <Text className='score'>{hotel.score}分</Text>
                <Text className='score-desc'>{hotel.scoreDesc}</Text>
                <Text className='reviews'>{hotel.reviews}条点评</Text>
              </View>

              <View className='location-row'>
                <Text className='location-icon'>📍</Text>
                <Text className='location-text'>{hotel.location}</Text>
              </View>

              <View className='room-info'>
                <Text className='room-type'>{hotel.roomType}</Text>
                <View className='tags'>
                  {hotel.tags.map(tag => <Text key={tag} className='tag'>{tag}</Text>)}
                </View>
              </View>

              <View className='bottom-row'>
                <View className='price-section'>
                  <View className='price-row'>
                    <Text className='currency'>¥</Text>
                    <Text className='price'>{hotel.price}</Text>
                    <Text className='unit'>起</Text>
                  </View>
                  {hotel.count < 3 && (
                    <Text className='room-tip'>🔥 仅剩 {hotel.count} 间</Text>
                  )}
                </View>
                <View className='btn-detail' onClick={(e) => {
                  e.stopPropagation()
                  handleHotelClick(hotel)
                }}>查看详情</View>
              </View>
            </View>
          </View>
        )) : (
          <View style={{ textAlign: 'center', marginTop: '100px', color: '#999' }}>
            没有找到符合条件的酒店
          </View>
        )}
      </ScrollView>
    </View>
  )
}