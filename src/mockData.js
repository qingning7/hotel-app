// 酒店基础数据模板（不包含城市名称）
export const hotelTemplates = [
    {
        id: 1,
        nameTemplate: '皇廷大酒店',
        price: 2588,
        score: '4.8',
        scoreDesc: '极佳',
        reviews: '1.2k+',
        location: '浦东新区 · 陆家嘴金融区',
        roomType: '行政豪华房',
        star: 5,
        tags: ['奢华酒店', '景观房', '免费WiFi'],
        count: 2,
        img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400'
    },
    {
        id: 2,
        nameTemplate: '半岛丽呈精品酒店',
        price: 1200,
        score: '4.6',
        scoreDesc: '超棒',
        reviews: '850',
        location: '黄浦区 · 外滩核心区',
        roomType: '精品时尚大床房',
        star: 4,
        tags: ['精品设计', '交通便利', '免费取消'],
        count: 5,
        img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400'
    },
    {
        id: 3,
        nameTemplate: '金茂君悦云端酒店',
        price: 3200,
        score: '4.9',
        scoreDesc: '完美',
        reviews: '2.1k+',
        location: '浦东新区 · 世纪大道',
        roomType: '云端景观房',
        star: 5,
        tags: ['云端视野', '地标建筑', '行政待遇'],
        count: 3,
        img: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400'
    },
    {
        id: 4,
        nameTemplate: '希尔顿逸林酒店',
        price: 1580,
        score: '4.7',
        scoreDesc: '出色',
        reviews: '1.5k+',
        location: '静安区 · 南京西路',
        roomType: '高级商务大床房',
        star: 4,
        tags: ['商务首选', '优质服务', '大堂吧'],
        count: 8,
        img: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400'
    },
    {
        id: 5,
        nameTemplate: '瑞吉全季大酒店',
        price: 2100,
        score: '4.8',
        scoreDesc: '极佳',
        reviews: '620',
        location: '徐汇区 · 衡山路',
        roomType: '优雅私享套房',
        star: 5,
        tags: ['优雅庄园', '管家服务', '下午茶'],
        count: 2,
        img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400'
    },
    {
        id: 6,
        nameTemplate: '万豪行政公寓',
        price: 1350,
        score: '4.5',
        scoreDesc: '很好',
        reviews: '430',
        location: '长宁区 · 虹桥商圈',
        roomType: '家庭式双卧公寓',
        star: 4,
        tags: ['家庭出游', '配套齐全', '有厨房'],
        count: 4,
        img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'
    },
    {
        id: 7,
        nameTemplate: '铂尔曼大酒店',
        price: 1750,
        score: '4.7',
        scoreDesc: '出色',
        reviews: '980',
        location: '普陀区 · 苏州河畔',
        roomType: '艺术格调高级房',
        star: 4,
        tags: ['设计感强', '艺术氛围', '健身房'],
        count: 1,
        img: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400'
    },
    {
        id: 8,
        nameTemplate: '凯悦尚萃酒店',
        price: 1900,
        score: '4.6',
        scoreDesc: '超棒',
        reviews: '1.1k+',
        location: '杨浦区 · 五角场',
        roomType: '都市活力景观房',
        star: 4,
        tags: ['都市风尚', '时尚地标', '屋顶泳池'],
        count: 6,
        img: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400'
    }
]

// 根据城市名称生成酒店列表
export const getHotelsByCity = (city = '上海') => {
    return hotelTemplates.map(template => ({
        ...template,
        name: `${city}${template.nameTemplate}`
    }))
}

// Banner 数据
export const bannerData = [
    {
        id: 1,
        img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
        title: '上海皇廷大酒店',
        subTitle: '找到最适合你的星级酒店',
        hotelId: 1
    },
    {
        id: 2,
        img: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
        title: '上海金茂君悦云端酒店',
        subTitle: '全城高空美景尽在掌握',
        hotelId: 3
    },
    {
        id: 3,
        img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        title: '上海瑞吉全季大酒店',
        subTitle: '精选精品酒店，解锁城市新玩法',
        hotelId: 5
    }
]

// 根据 hotelId 获取酒店详情
export const getHotelById = (hotelId, city = '上海') => {
    const template = hotelTemplates.find(h => h.id === hotelId)
    if (!template) return null
    return {
        ...template,
        name: `${city}${template.nameTemplate}`
    }
}
