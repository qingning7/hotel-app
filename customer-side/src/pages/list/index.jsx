import Taro, { useRouter } from '@tarojs/taro'
import { useState, useMemo } from 'react'
import { View, Text, ScrollView, Image, Picker } from '@tarojs/components'
import './index.scss'

export default function List() {
  const router = useRouter()
  const city = router.params.city || '上海'

  // 1. 扩充酒店数据至8个，增加 star 字段
  const allHotels = [
    { id: 1, name: `${city}外滩华尔道夫酒店`, price: 2588, score: 4.8, star: 5, tags: ['奢华酒店', '景观房'], count: 2, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4df85b?w=400' },
    { id: 2, name: `${city}和平饭店`, price: 3200, score: 4.9, star: 5, tags: ['历史建筑', '老克勒风情'], count: 5, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' },
    { id: 3, name: `${city}香格里拉酒店`, price: 1800, score: 4.7, star: 5, tags: ['市中心', '繁华地段'], count: 1, img: 'https://images.unsplash.com/photo-1551882547-ff43c63efe81?w=400' },
    { id: 4, name: `${city}浦东丽思卡尔顿`, price: 2800, score: 4.9, star: 5, tags: ['云端景观', '购物便利'], count: 3, img: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400' },
    { id: 5, name: `${city}W酒店`, price: 2100, score: 4.6, star: 5, tags: ['时尚潮流', '网红打卡'], count: 8, img: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400' },
    { id: 6, name: `${city}新天地安达仕`, price: 1500, score: 4.5, star: 4, tags: ['设计感', '艺术氛围'], count: 4, img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400' },
    { id: 7, name: `${city}静安瑞吉酒店`, price: 1900, score: 4.7, star: 5, tags: ['管家服务', '精致下午茶'], count: 6, img: 'https://images.unsplash.com/photo-1551882547-ff43c63efe81?w=400' }, // Reusing fake image for demo
    { id: 8, name: `${city}快捷假日酒店`, price: 400, score: 4.2, star: 3, tags: ['经济实惠', '交通便利'], count: 12, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' } // Reusing fake image for demo
  ]

  // 状态管理：排序和筛选
  const [sortType, setSortType] = useState('default') // default, priceAsc, priceDesc, starDesc
  const [filterStar, setFilterStar] = useState(0) // 0 表示全部

  // 排序选项
  const sortOptions = [
    { value: 'default', label: '推荐排序' },
    { value: 'priceAsc', label: '价格低→高' },
    { value: 'priceDesc', label: '价格高→低' },
    { value: 'starDesc', label: '星级高→低' }
  ]

  // 星级筛选选项
  const starOptions = [
    { value: 0, label: '全部星级' },
    { value: 5, label: '五星级' },
    { value: 4, label: '四星级' },
    { value: 3, label: '三星级' }
  ]

  // 计算最终显示的酒店列表
  const displayHotels = useMemo(() => {
    let result = [...allHotels]

    // 筛选
    if (filterStar > 0) {
      result = result.filter(h => h.star === filterStar)
    }

    // 排序
    if (sortType === 'priceAsc') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortType === 'priceDesc') {
      result.sort((a, b) => b.price - a.price)
    } else if (sortType === 'starDesc') {
      result.sort((a, b) => b.star - a.star)
    }

    return result
  }, [sortType, filterStar])

  const handleHotelClick = (hotel) => {
    Taro.navigateTo({
      url: `/pages/detail/index?name=${hotel.name}&price=${hotel.price}`
    })
  }

  return (
    <View className='list-page'>
      <View className='filter-bar'>
        <View className='filter-item'>
          <Picker mode='selector' range={sortOptions} rangeKey='label' onChange={e => setSortType(sortOptions[e.detail.value].value)}>
            <Text className={sortType !== 'default' ? 'active' : ''}>
              {sortOptions.find(o => o.value === sortType)?.label || '排序'} ▾
            </Text>
          </Picker>
        </View>
        <View className='filter-item'>
          <Picker mode='selector' range={starOptions} rangeKey='label' onChange={e => setFilterStar(starOptions[e.detail.value].value)}>
             <Text className={filterStar !== 0 ? 'active' : ''}>
              {starOptions.find(o => o.value === filterStar)?.label || '筛选'} ▾
            </Text>
          </Picker>
        </View>
      </View>

      <ScrollView scrollY className='hotel-list'>
        {displayHotels.map(hotel => (
          <View key={hotel.id} className='hotel-card' onClick={() => handleHotelClick(hotel)}>
            <Image className='hotel-img' src={hotel.img} mode='aspectFill' />
            <View className='hotel-info'>
              <Text className='hotel-name'>{hotel.name}</Text>
              
              <View className='score-row'>
                <Text className='score'>{hotel.score}分</Text>
                <Text className='star-badge'>{hotel.star}星</Text>
                {hotel.tags.map(tag => <Text key={tag} className='tag'>{tag}</Text>)}
              </View>

              {hotel.count < 5 && (
                <View className='room-tip'>
                  <Text style={{ color: '#ff4d4f', fontSize: '12px', fontWeight: 'bold' }}>
                    🔥 仅剩 {hotel.count} 间
                  </Text>
                </View>
              )}

              <View className='price-row'>
                <Text className='currency'>¥</Text>
                <Text className='price'>{hotel.price}</Text>
                <Text className='unit'>起</Text>
              </View>
            </View>
          </View>
        ))}
        {displayHotels.length === 0 && (
            <View style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                暂无符合条件的酒店
            </View>
        )}
      </ScrollView>
    </View>
  )
}