<template>
    <div :class="['M-gridTable', {'fixedPager': !config.noPager && config.fixedPager},{'radioTable':isRadio}]">
        <el-table
            :data="tableData"
            align="center"
            width="100%"
            highlight-current-row
            v-loading="loading"
            :row-key="getRowKeys"
            border
            :height="!isNoTbodyHeight ? (tbodyHeight||'100%') : null"
            ref="gridTable"
            :empty-text="emptyText"
            @selection-change="handleSelectionChange"
            @cell-click="cellClick"
            @sort-change="bindSortChange"
            :cell-class-name="showCellClassName?cellClassName:''"
            :header-cell-style="{color:'#9B9B9B',fontWeight: 'normal'}"
            :row-class-name="tableRowClassName"
        >
            <el-table-column
                :reserve-selection="true"
                type="selection"
                prop="id"
                :selectable="selectable"
                :fixed="config.selectFixed"
                width="50"
                v-if="config.select&&!isRadio&&tableData.length"
            ></el-table-column>
            <el-table-column v-else-if="config.select&&isRadio" width="50" :fixed="config.selectFixed">
                <template slot-scope="param">
                    <label class="" 
                        :class="selectId===param.row[mapSelectKey]?'is-checked':''" v-if="!showRadio">
                        <span class="el-checkbox__input" :class="selectId===param.row[mapSelectKey]?'is-checked':''">
                            <span class="el-checkbox__inner"></span>
                        </span>
                    </label>
                    <label
                        class="el-checkbox radioEnable show-radio"
                        :class="{'is-checked':selectId===param.row[mapSelectKey], 'is-disabled': param.row.disabled}"
                        v-if="showRadio"
                    >
                        <span
                            class="el-checkbox__input"
                            :class="{'is-checked':selectId===param.row[mapSelectKey], 'is-disabled': param.row.disabled}"
                        >
                            <span class="el-checkbox__inner"></span>
                        </span>
                    </label>
                </template>
            </el-table-column>
            <el-table-column
                type="index"
                :label="config.colsIndex"
                :fixed="config.colsIndexFixed"
                align="center"
                width="70"
                v-if="config.colsIndex"
                :index="indexMethod"
            ></el-table-column>
            <template v-if="config&&config.cols">
                <el-table-column
                    v-for="(c,cIndex) in config.cols"
                    :key="cIndex"
                    :prop="c.value"
                    :label="c.text"
                    :width="c.width"
                    :min-width="c.minWidth"
                    :fixed="c.fixed"
                    :align="c.align||'left'"
                    :show-overflow-tooltip="c.showMore ? true : false"
                    :sortable="c.sortable || false"
                    :type="c.type"
                >
                    <template slot-scope="scope">
                        <template v-if="c.render">{{c.render(scope.row)}}</template>
                        <!-- 自定义操作区按钮样式 -->
                        <div v-if="c.type==='ctrl'" :class="config.opeClassName">
                            <el-button
                                v-for="(btn,bIndex) in c.btn"
                                :key="'btn'+bIndex"
                                type="text"
                                @click="beforeHandle(btn,scope.row)"
                                v-show="getFormatDisable(btn.show,scope.row,true)"
                                :disabled="getFormatDisable(btn.disabled,scope.row)"
                                v-html="getFormat(btn.formaterText,btn.text, scope.row)"
                            ></el-button>
                        </div>
                        <template v-if="c.type==='popover'">
                            <div v-if="scope.row[c.value] && scope.row[c.value].trim().length  < 12" class="name-wrapper">
                                <!-- {{ scope.row[c.value] }} -->
                                <span v-if="scope.row[c.value] !== 'null'" v-html="scope.row[c.value]"></span>
                            </div>
                            <el-popover trigger="hover" placement="top" v-else>
                                <div :style="{width:c.width+'px',textAlign:'center'}">{{ scope.row[c.value] }}</div>
                                <div slot="reference" class="name-wrapper" v-if="scope.row[c.value]">
                                    <el-tag size="medium">{{ scope.row[c.value]}}</el-tag>
                                </div>
                            </el-popover>
                        </template>
                        <template v-if="c.type==='tags'">
                            <el-tag
                                size="medium"
                                :type="c.tags[scope.row[c.value]].type"
                                v-if="c.tags[scope.row[c.value]]"
                            >{{c.tags[scope.row[c.value]].text}}</el-tag>
                        </template>
                        <template v-if="c.type==='slot'">
                            <slot :name="c.name" :row="scope.row" :config="c"></slot>
                        </template>
                        <div
                            v-else
                            v-html="getFormat(c.formater,scope.row[c.value], scope.row)"
                            class="single_line_ellipsis"
                            @click="c.handleRow&&c.handleRow(scope.row)"
                        ></div>
                    </template>
                </el-table-column>
            </template>
        </el-table>
        <div class="M-gridPager flex flex-alc" v-if="tableData.length&&((config.ctrl&&config.ctrl.length)||!config.noPager)">
            <div class="flex-item M-gridPagerLeft">
                <template v-if="config.ctrl&&config.ctrl.length">
                    <el-button
                        v-for="(b,bIndex) in config.ctrl"
                        :key="'b'+bIndex"
                        class="M-gridPagerButtonCtrl"
                        :type="!b.btype?'primary':''"
                        :plain="b.plain"
                        @click="b.handle"
                        :disabled="handledisabled(b)"
                    >{{b.text}}</el-button>
                </template>
            </div>
            <div v-if="tableData.length&&!config.noPager" class="M-gridPagerRight">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="defaultConfig.pageSizes"
                    :page-size="pager.size"
                    :layout="defaultConfig.pageLayout"
                    :total="totalElements"
                    :current-page="pager.page+1"
                    border
                    :pager-count="defaultConfig.pagerCount"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { util } from '../common/tools'
import formater from '../common/formater'
import './grid.less'
const DEFAULT_DATA_GRID = {
    page: 0,
    size: 10
}

const DEFAULT_DATA_CONFIG = {
    url: '',
    cols: [],
    pageSizes: [10, 20, 30, 50, 80, 100],
    pageLayout: 'prev, pager, next, sizes, total',
    tableData: [],
    pagerCount: 5
}
export default {
    name: 'c-grid',
    props: {
        query: {
            type: Object,
            default: function () {
                return DEFAULT_DATA_GRID
            }
        },
        config: {
            type: Object,
            default: function () {
                return DEFAULT_DATA_CONFIG
            }
        },
        tbodyHeight: {
            type: String,
            default: null
        },
        selectable: {
            type: Function,
            default() {
                return function () {}
            }
        },
        getRowKeys: {
            type: Function,
            default(row) {
                return row.id
            }
        },
        // 是否展示单元格样式
        showCellClassName: {
            type: Boolean,
            default: false
        },
        // 已经选中的行
        hasSelectDat: {
            type: Array,
            default() {
                return []
            }
        },
        mapSelectKey: {
            type: String,
            default: 'id'
        },
        isExport: {
            type: Boolean,
            default: false
        },
        isRadio: {
            type: Number,
            default: 0
        },
        showRadio: {
            type: Boolean,
            default: false
        },
        emptyText: {
            type: String,
            default: '暂无数据'
        },
        // 是否没有固定高度
        isNoTbodyHeight: {
            type: Boolean,
            default: false
        }
    },
    data() {
        let tpm = JSON.parse(JSON.stringify(DEFAULT_DATA_CONFIG))
        return {
            totalElements: 0,
            tableData: [],
            defaultConfig: util.merge({}, tpm, this.config),
            loading: false,
            selectDat: [],
            pager: {
                page: 0,
                size: 10
            },
            tpmQ: {},
            selectId: ''
        }
    },
    methods: {
        // 获取当前搜索条件
        getSearchData(){
            return {
                tpmQ:this.tpmQ,
            }
        },
        beforeHandle(btn, row) {
            if (btn.handle) {
                btn.handle(row)
            }
        },
        // 设置单行选中状态  row: table 单行数据, selected：选中状态Boolean值, field 对比数据的字段值
        // reset 除了当前其他都清空
        toggleRowSelection(item, selected, field, reset) {
            this.tableData.forEach(row => {
                if (item[field] == row[field]) {
                    this.$refs.gridTable.toggleRowSelection(row, selected)
                } else if (reset) {
                    this.$refs.gridTable.toggleRowSelection(row, false)
                }
            })
        },
        initTableData(tableData) {
            this.tableData = tableData
        },
        clearData() {
            this.tableData = JSON.parse(JSON.stringify([]))
        },
        // type 有值就重置翻页参数， isSetNum有值就是删除后处理请求数据 处理当前页只有一条时页码减一， q请求参数
        getNewData(type, isSetNum, q) {
            if (type) {
                q = q || {}
                let tpmQ = {
                    page: 0,
                    size: 10,
                    ...q
                }
                this.getData(tpmQ)
            } else if (isSetNum) {
                let query = {
                    ...this.query
                }
                for (let q in query) {
                    if (q !== 'page' && q !== 'size') {
                        query[q] = ''
                    }
                }
                if (
                    this.tableData.length === 1 &&
                    this.pager.page !== 0 &&
                    parseInt(this.totalElements / this.pager.size) === this.pager.page
                ) {
                    this.getData({
                        ...query,
                        ...q,
                        page: this.pager.page - 1
                    })
                } else {
                    this.getData({
                        ...query,
                        ...q,
                        page: this.pager.page
                    })
                }
            } else {
                this.getData(q || {})
            }
        },
        getCurData() {
            return this._data
        },
        getData(query) {
            let me = this
            let queryApply = {}
            if (me.config.autoGet) {
                queryApply = {...DEFAULT_DATA_GRID, ...this.tpmQ, ...this.query, ...query}
            } else {
                queryApply = {...DEFAULT_DATA_GRID, ...this.query, ...this.tpmQ, ...query}
            }
            queryApply.rand = Math.random() * 19
            this.pager.page = queryApply.page
            this.pager.size = queryApply.size
            if (!this.config.url) {
                return
            }
            me.loading = true
            this.config.requestDat
                .get({
                    url: this.config.url,
                    config: {
                        params: queryApply
                    }
                })
                .then(
                    res => {
                        if (res) {
                            let datas = []
                            if (this.config.noPager) {
                                datas = res || []
                            } else if (typeof this.config.responseToDataFn === 'function') {
                                datas = this.config.responseToDataFn(res);
                            } else {
                                datas = res.content || []
                            }
                            this.tableData = datas
                            if (me.hasSelectDat && me.hasSelectDat.length) {
                                // me.clearSelect()
                                // me.clearing = true
                                this.selectId = ''
                                me.$nextTick(() => {
                                    datas.forEach(d => {
                                        let selectItem = me.hasSelectDat.filter(s => {
                                            if (d[me.mapSelectKey] === s[me.mapSelectKey]) {
                                                return s
                                            }
                                        })
                                        if (selectItem.length) {
                                            me.toggleRowSelection(selectItem[0], true, me.mapSelectKey)
                                        }
                                    })
                                    if (this.isRadio && me.hasSelectDat.length) {
                                        this.selectId = me.hasSelectDat[0][me.mapSelectKey]
                                    }
                                })
                            } else {
                                this.selectId = ''
                            }
                            this.totalElements = Number(res.totalElements || 0)
                            this.tpmQ = queryApply
                            this.$emit('gridGetDataQuery', queryApply)
                            //拿到datas
                            this.$emit('gridGetData', datas, res)
                            this.$emit('gridGetApiData', datas, res)
                            this.$nextTick(() => {
                                this.$refs.gridTable.doLayout()
                            })
                        }
                        me.loading = false
                    },
                    (err) => {
                        this.$emit('gridGetApiData', [], err)
                        me.loading = false
                    }
                )
        },
        handleCurrentChange(val) {
            this.getData({
                page: val - 1
            })
        },
        handleSizeChange(val) {
            this.getData({
                page: 0,
                size: val
            })
        },
        getFormat(format, val, dat) {
            if ( util.isString(format)) {
                return formater[format](val)
            } else if (util.isFunction(format)) {
                return format(val, dat)
            } else {
                return val
            }
        },
        getFormatDisable(format, val, def) {
            if (util.isFunction(format)) {
                return format(val)
            } else if (def) {
                return def
            } else {
                return format ? true : false
            }
        },
        handleSelectionChange(selection) {
            if (!this.isRadio) {
                let me = this
                let hasSelect = JSON.parse(JSON.stringify(me.hasSelectDat))
                if (selection.length) {
                    let selectIds = []
                    //  当前数据没有在之前有选中 就添加
                    selection.forEach(s => {
                        selectIds.push(s.id)
                        let selectItem = me.hasSelectDat.filter(d => {
                            return d[me.mapSelectKey] === s[me.mapSelectKey]
                        })
                        if (!selectItem.length) {
                            hasSelect.push(s)
                        }
                    })
                    //  之前有选中 当前被取消勾选 就删除
                    this.tableData.forEach(t => {
                        if (selectIds.indexOf(t[me.mapSelectKey]) === -1) {
                            let dIndex = null
                            let selectItem = me.hasSelectDat.filter((d, index) => {
                                if (!dIndex && d[me.mapSelectKey] === t[me.mapSelectKey]) {
                                    dIndex = index
                                }
                                return d[me.mapSelectKey] === t[me.mapSelectKey]
                            })
                            if (selectItem.length) {
                                hasSelect.splice(dIndex, 1)
                            }
                        }
                    })
                } else {
                    let arrSelect = me.hasSelectDat.map(d => {
                        return d[me.mapSelectKey]
                    })
                    //  之前有选中 当前被取消勾选 就删除
                    this.tableData.forEach(s => {
                        let tpmArr = []
                        if (!arrSelect.includes(s[me.mapSelectKey])) {
                            tpmArr.push(s)
                        }
                        hasSelect = tpmArr
                    })
                }

                // 注意 弹窗要v-if  初始化 element 会清除  show时 会出现 没勾上还是勾上了 手动清除还是避免不了清除
                this.selectDat = hasSelect
                this.$emit('selectDat', hasSelect, this.tableData, selection)
            }
        },
        cellClick(row, column, cell, event) {
            if (util.hasGetSelected() || row.disabled) {
                return
            }

            if (column.type !== 'selection' && column.type !== 'ctrl') {
                this.$emit('cellClick', row, column.property, cell, event)
                if (this.isRadio) {
                    this.selectId = row[this.mapSelectKey]
                    this.selectDat = [row]
                    this.$emit('selectDat', this.selectDat, this.tableData)
                }
            }
        },
        bindSortChange(event) {
            this.$emit('bindSortChange', event)
        },
        clearSelect() {
            this.$refs.gridTable.clearSelection()
        },
        handledisabled(b) {
            if (b.conectSelect && !this.selectDat.length) {
                return true
            }
            return false
        },
        indexMethod(index) {
            let tpm = index + 1
            if (util.isFunction(this.config.colsIndexMethod)) {
                tpm = this.config.colsIndexMethod(index, this.tableData)
            }
            return tpm
        },
        // row-class-name 属性来为 Table 中的某一行添加 class 导出置灰 { row, rowIndex }
        tableRowClassName({ row }) {
            let isCheck = this.selectDat.find(v => {
                return this.getRowKeys(v) == this.getRowKeys(row)
            })
            if (isCheck) {
                return 'check-row-class'
            }
            return ''
        },
        // 假期余额，table前三列不能点击 { row, column, rowIndex, columnIndex }
        cellClassName({  columnIndex }) {
            if (columnIndex > 2) {
                return 'handleTypeTextStyle'
            } else {
                return 'gridCellClass'
            }
        }
    },
    mounted() {
        this.tableData = this.defaultConfig.tableData || []
        this.pager.page = this.query.page
        this.pager.size = this.query.size
    },
    watch: {
    }
}
</script>
<style lang="less" scoped>
.show-radio {
    .el-checkbox__inner {
        border-radius: 50%;
        &::after {
            left: 50%;
            top: 50%;
            height: 3px;
            background: #fff;
            transform: translate(-50%, -50%) !important;
            border-radius: 50%;
            overflow: hidden;
        }
    }
}
</style>
