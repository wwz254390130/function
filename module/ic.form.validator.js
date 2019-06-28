
/**
 * @desc 工商系统-表单校验相关
 * @author fredwei
 * @date 2018/10/15
 */

var company = {
    englishName: {
        isEmpty: true,
        minLength: 0,
        maxLength: 100
    },
    chineseName: {
        isEmpty: true,
        minLength: 0,
        maxLength: 100
    },
    otherName: {
        isEmpty: true,
        minLength: 0,
        maxLength: 500
    },
    oldName: {
        isEmpty: true,
        minLength: 0,
        maxLength: 100
    },
    // 请输入注册号码
    ciNo: {
        minLength: 0,
        maxLength: 100
    },
    status: {
        isEmpty: false
    },
    // 请选择成立时间
    incorporationDate: {
        isEmpty: false
    },
    // 所在地（国家或地区）
    countryCode: {
        isEmpty: false
    },
    // 注册地址（英文）
    registeredAddressEnglish: {
        isEmpty: true,
        minLength: 0,
        maxLength: 1000
    },
    // 注册地址（中文）
    registeredAddressChinese: {
        isEmpty: true,
        minLength: 0,
        maxLength: 500
    },
    // 所在地（省份或城市）
    city: {
        isEmpty: true,
        minLength: 0,
        maxLength: 100
    },
    exchange: {
        isEmpty: true,
        minLength: 0,
        maxLength: 100
    },
    stockCode: {
        isEmpty: true,
        minLength: 0,
        maxLength: 100
    },
    companyTypeDescription: {
        isEmpty: true,
        minLength: 0,
        maxLength: 100
    },
    descriptionBusinessNatureGeneral: {
        isEmpty: true,
        minLength: 0,
        maxLength: 2000
    },
    descriptionBusinessNaturePermitted: {
        isEmpty: true,
        minLength: 0,
        maxLength: 2000
    },
    registeredCapitalAmount: {
        isEmpty: true,
        minLength: 0,
        maxLength: 20,
        rexType: 'num3'
    },
    paidUpCapitalAmount: {
        isEmpty: true,
        minLength: 0,
        maxLength: 20,
        rexType: 'num3'
    },
    shareNum: {
        isEmpty: true,
        minLength: 0,
        maxLength: 10,
        rexType: 'num3'
    },
    shareRatio: {
        isEmpty: true,
        minLength: 0,
        maxLength: 10,
        rexType: 'num3'
    },
    officerPosition: {
        isEmpty: true,
        minLength: 0,
        maxLength: 500
    },
    documentId: {
        isEmpty: true,
        minLength: 0,
        maxLength: 100
    },
    remark: {
        isEmpty: true,
        minLength: 0,
        maxLength: 2000
    }
};

var officer = {
    englishName: {
        isEmpty: true,
        minLength: 0,
        maxLength: 100
    },
    chineseName: {
        isEmpty: true,
        minLength: 0,
        maxLength: 100
    },
    otherName: {
        isEmpty: true,
        minLength: 0,
        maxLength: 500
    },
    // 所在地（国家或地区）
    countryCode: {
        isEmpty: false
    },
    // 注册地址（英文）
    address: {
        minLength: 0,
        maxLength: 1000
    }
};

var agent = {
    name: {
        minLength: 0,
        maxLength: 100
    },
    contactName: {
        minLength: 0,
        maxLength: 100
    },
    contactPhone: {
        minLength: 0,
        maxLength: 100
    },
    contactEmail: {
        rexType: 'email'
    },
    address: {
        minLength: 0,
        maxLength: 1000
    }
};

var foreCastAdd = {
    ledger:{
        isEmpty: true
    },
    customerName:{
        isEmpty: true
    },
    modelType:{
        isEmpty: true
    },
    partNo:{
        isEmpty: true
    },
    brand:{
        isEmpty: true
    },
    pmName:{
        isEmpty: true
    },
    customerFlag:{
        isEmpty: true
    },
    salePrice:{
        isEmpty: true,
        rexType: 'num3'
    }
    
}

var saleOrder = {
    channel:{
        isEmpty: true 
    },
    taxunitprice:{
        isEmpty: true 
    },
    unitprice:{
        isEmpty: true 
    },
    taxpreprice:{
        isEmpty: true 
    },
    preprice:{
        isEmpty: true 
    },
    partno:{
        isEmpty: true 
    },
    effectstart:{
        isEmpty: true 
    }
}

module.exports = {
    company: company,
    officer: officer,
    agent: agent,
    foreCastAdd:foreCastAdd,
    saleOrder:saleOrder,
    config: {}
}