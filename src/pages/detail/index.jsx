import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import './index.scss'

export default function Detail() {
  const router = useRouter()
  const { name, price, img, star } = router.params // 接收从列表页传来的酒店名、价格、图片和星级

  const renderStars = (count) => {
    return '⭐'.repeat(Number(count) || 0)
  }

  return (
    <View className='detail-page'>
      <Image className='detail-img' src={decodeURIComponent(img) || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'} mode='aspectFill' />

      <View className='info-section'>
        <View className='title-row' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text className='hotel-title' style={{ flex: 1 }}>{name || '酒店详情'}</Text>
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
            这家极具风情的豪华酒店，坐落于城市核心地段，拥有绝佳的视野和一流的服务设施。无论是商务出差还是休闲旅游，都是您的不二之选。
          </Text>
        </View>
      </View>

      <View className='bottom-bar'>
        <Button className='book-btn' onClick={() => Taro.showToast({ title: '预订成功！', icon: 'success' })}>
          立即预订
        </Button>
      </View>
    </View>
  )
}