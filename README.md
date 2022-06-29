# c-common

##  main.js  
```
import cCommon from 'c-common'

Vue.use(cCommon);
```
###表格使用
### 模板   
```
<c-grid  ref="getData" :config="config"></c-grid>
```

### data 定义列表展示格式
```
data() {
    const me = this
    return {
        holidayTypeConf: {
            requestDat:requestDat, //请求
            cols: [
                {
                    text: '名称',
                    align: "left",
                    value: 'name'
                },
                {
                    text: '单位',
                    value: 'unitType',
                    formater: function (val, row) {
                        return row.unitType === 'DAY' ? '按天' : '按小时'
                    }
                },
                {
                    text: '时长计算',
                    value: 'durationType'
                },
                {
                    text: '余额规则',
                    value: 'ruleText'
                },
                {
                    text:'操作',
                    type:'ctrl',
                    align:"left",
                    width:"120px",
                    btn:[{
                        text:'编辑',
                        handle: function(v) {
                        }
                    },{
                        text:'删除',
                        handle:function(v) {
                        }
                    }]
                }
            ],
            "url": "/getHolidayType",//可以域名加链接
            noPager: true
        }
    }
}
```

### mounted 请求数据
```
mounted(){
    this.$refs.getData.getData()
},
```

