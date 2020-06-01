const mapStatusToChinese = {
    601: '待审核',
    602: '审核未通过',
    603: '未支付',
    604: '已支付',
    605: '待发货',
    606: '运输中',
    607: '已完成',
}

const mapConfigToPath = {
    0: '/user',
    1: '/admin',
    2: '/super',
}

export default {
    mapConfigToPath,
    mapStatusToChinese,
}