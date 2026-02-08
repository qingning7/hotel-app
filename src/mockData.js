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
        img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
        roomTypes: [
            { id: 1, name: '豪华单人间', price: 1988, area: '30㎡', bed: '1张单床', features: ['市景', 'WiFi', '浴缸'], img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=90' },
            { id: 2, name: '商务大床房', price: 2288, area: '35㎡', bed: '1张大床', features: ['景观房', 'WiFi', '办公区'], img: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=90' },
            { id: 3, name: '标准双床房', price: 2388, area: '38㎡', bed: '2张单床', features: ['市景', 'WiFi', '淋浴间'], img: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=90' },
            { id: 4, name: '行政豪华房', price: 2588, area: '45㎡', bed: '1张大床', features: ['行政酒廊', '免费饮品', '景观阳台'], img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=90' },
            { id: 5, name: '总统套房', price: 3888, area: '80㎡', bed: '1张大床+客厅', features: ['私人阳台', '独立客厅', '奢华浴室'], img: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=90' }
        ]
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
        img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400',
        roomTypes: [
            { id: 1, name: '精品单人房', price: 799, area: '24㎡', bed: '1张单床', features: ['时尚设计', '免费WiFi', '独立卫浴'], img: 'https://images.unsplash.com/photo-1555939594-58d7cb561404?w=400' },
            { id: 2, name: '精品大床房', price: 1099, area: '28㎡', bed: '1张大床', features: ['景观窗', '艺术装饰', '淋浴房'], img: 'https://images.unsplash.com/photo-1631049307038-da0ec9d70304?w=400' },
            { id: 3, name: '时尚双床房', price: 1199, area: '32㎡', bed: '2张单床', features: ['现代风格', '分离卫浴', '工作台'], img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' },
            { id: 4, name: '豪华大床房', price: 1399, area: '40㎡', bed: '1张大床', features: ['浴缸淋浴', '独立客厅', 'VIP待遇'], img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400' },
            { id: 5, name: '精品套房', price: 1899, area: '55㎡', bed: '1张大床+沙发', features: ['超大客厅', '景观浴室', '迷你吧'], img: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400' }
        ]
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
        img: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400',
        roomTypes: [
            { id: 1, name: '云端景观单间', price: 2688, area: '32㎡', bed: '1张单床', features: ['超高层景观', '全景窗', '智能系统'], img: 'https://images.unsplash.com/photo-1555939594-58d7cb561404?w=400' },
            { id: 2, name: '云端大床房', price: 2988, area: '40㎡', bed: '1张大床', features: ['270度景观', '落地窗', 'WiFi6'], img: 'https://images.unsplash.com/photo-1631049307038-da0ec9d70304?w=400' },
            { id: 3, name: '云端双床房', price: 3288, area: '45㎡', bed: '2张单床', features: ['云端视野', '景观卫浴', '黄浦江景'], img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' },
            { id: 4, name: '云端豪华房', price: 3688, area: '55㎡', bed: '1张大床', features: ['行政服务', '独家服务', '顶级配置'], img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400' },
            { id: 5, name: '云端皇璢套房', price: 5288, area: '120㎡', bed: '1张大床+大客厅', features: ['私人管家', '独占一角景观', '顶级奢华'], img: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400' }
        ]
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
        img: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400',
        roomTypes: [
            { id: 1, name: '商务单人间', price: 999, area: '26㎡', bed: '1张单床', features: ['工作台', '免费WiFi', '商务级设施'], img: 'https://images.unsplash.com/photo-1555939594-58d7cb561404?w=400' },
            { id: 2, name: '商务大床房', price: 1199, area: '32㎡', bed: '1张大床', features: ['办公区', '24h服务', '高速WiFi'], img: 'https://images.unsplash.com/photo-1631049307038-da0ec9d70304?w=400' },
            { id: 3, name: '商务双床房', price: 1399, area: '36㎡', bed: '2张单床', features: ['双工作台', '会议设施', '优质床品'], img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' },
            { id: 4, name: '高级商务房', price: 1580, area: '42㎡', bed: '1张大床', features: ['客厅区', '行政大堂', '高端配置'], img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400' },
            { id: 5, name: '商务套房', price: 2199, area: '65㎡', bed: '1张大床+客厅', features: ['会议室', '独立厨房', '总经理级'], img: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400' }
        ]
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
        img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
        roomTypes: [
            { id: 1, name: '优雅小床房', price: 1688, area: '28㎡', bed: '1张单床', features: ['精致设计', '管家服务', '私密空间'], img: 'https://images.unsplash.com/photo-1555939594-58d7cb561404?w=400' },
            { id: 2, name: '优雅大床房', price: 1988, area: '36㎡', bed: '1张大床', features: ['庄园风格', '免费WiFi', '高级寝具'], img: 'https://images.unsplash.com/photo-1631049307038-da0ec9d70304?w=400' },
            { id: 3, name: '优雅双床房', price: 2188, area: '40㎡', bed: '2张单床', features: ['花园景观', '共享酒廊', '下午茶'], img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' },
            { id: 4, name: '私享豪华房', price: 2400, area: '48㎡', bed: '1张大床', features: ['管家服务', '私人酒廊', '优先权'], img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400' },
            { id: 5, name: '私享套房', price: 3588, area: '72㎡', bed: '1张大床+客厅', features: ['私人管家', '专属酒廊', '奢侈体验'], img: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400' }
        ]
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
        img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        roomTypes: [
            { id: 1, name: '单间公寓', price: 899, area: '35㎡', bed: '1张大床', features: ['厨房', '洗衣机', '长住优惠'], img: 'https://images.unsplash.com/photo-1555939594-58d7cb561404?w=400' },
            { id: 2, name: '一居室公寓', price: 1199, area: '45㎡', bed: '1张大床', features: ['独立厨房', '餐厅', '客厅'], img: 'https://images.unsplash.com/photo-1631049307038-da0ec9d70304?w=400' },
            { id: 3, name: '家庭一居室', price: 1399, area: '52㎡', bed: '1张大床+1张单床', features: ['完整厨房', '洗衣房', '儿童区'], img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' },
            { id: 4, name: '双卧家庭公寓', price: 1649, area: '65㎡', bed: '2张大床', features: ['开放厨房', '餐厅', '充裕空间'], img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400' },
            { id: 5, name: '豪华三居公寓', price: 2299, area: '90㎡', bed: '3张大床+客厅', features: ['全配厨房', '洗衣房', '家庭首选'], img: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400' }
        ]
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
        img: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400',
        roomTypes: [
            { id: 1, name: '艺术单人间', price: 1099, area: '28㎡', bed: '1张单床', features: ['艺术装置', '河畔景观', '美学设计'], img: 'https://images.unsplash.com/photo-1555939594-58d7cb561404?w=400' },
            { id: 2, name: '艺术大床房', price: 1399, area: '35㎡', bed: '1张大床', features: ['创意装饰', '设计感强', '河景'], img: 'https://images.unsplash.com/photo-1631049307038-da0ec9d70304?w=400' },
            { id: 3, name: '艺术双床房', price: 1599, area: '40㎡', bed: '2张单床', features: ['装置艺术', '现代风格', '采光好'], img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' },
            { id: 4, name: '格调豪华房', price: 1799, area: '48㎡', bed: '1张大床', features: ['私人美术馆', '设计师房', '顶级美学'], img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400' },
            { id: 5, name: '设计师套房', price: 2699, area: '70㎡', bed: '1张大床+客厅', features: ['艺术收藏', '创意客厅', '河畔景观'], img: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400' }
        ]
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
        img: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400',
        roomTypes: [
            { id: 1, name: '都市便利间', price: 1199, area: '26㎡', bed: '1张单床', features: ['高效设计', '免费WiFi', '快速入住'], img: 'https://images.unsplash.com/photo-1555939594-58d7cb561404?w=400' },
            { id: 2, name: '都市大床房', price: 1499, area: '32㎡', bed: '1张大床', features: ['市景', '现代装修', '便利设施'], img: 'https://images.unsplash.com/photo-1631049307038-da0ec9d70304?w=400' },
            { id: 3, name: '活力双床房', price: 1699, area: '36㎡', bed: '2张单床', features: ['城市景观', '年轻风格', '社交空间'], img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' },
            { id: 4, name: '景观高级房', price: 1999, area: '44㎡', bed: '1张大床', features: ['屋顶泳池景', '泳池通道', '时尚设计'], img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400' },
            { id: 5, name: '时尚景观套房', price: 2899, area: '68㎡', bed: '1张大床+客厅', features: ['全景阳台', '泳池景观', '尊享服务'], img: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400' }
        ]
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
