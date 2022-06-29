<template>
    <div class="fSelect" @mouseenter="isShow = true" @mouseleave="isShow = false" >
        <div v-show="valName" class="valName">
            <div class="el-select" v-show="valName" style="width:220px">
                <div class="el-input el-input--suffix" :class="{'is-disabled':disabled}">
                    <input type="text" readonly class="el-input__inner" :value="valName" :placeholder="placeholder"/>
                    <span class="el-input__suffix">
                        <span class="el-input__suffix-inner">
                            <i class="el-select__caret el-input__icon el-icon-circle-close" v-if="clearable && valName && !disabled && isShow"></i>
                            <i class="el-select__caret el-input__icon el-icon-arrow-up" v-else></i>
                        </span>
                    </span>
                </div>
            </div>
        </div>

        <el-select v-model="realVal"
            :filterable="filterable"
            :reserve-keyword="reserveKeyword"
            :default-first-option="defaultFirstOption"
            @change="changeHandle"
            :disabled="disabled"
            :clearable="clearable"
            :placeholder="placeholder"
            :multiple="multiple"
            style="width:220px"
            :class="{
                'valNameSelect':valName
            }"
        >
            <el-option v-for="(user,index) in items" :key="index"
                :label="user[keyMap.text]"
                :value="user[keyMap.id]"
            >
                <slot name="option" :user="user"></slot>
            </el-option>
        </el-select>
    </div>
</template>
<script>
export default {
    name:"c-select",
    props:{
        val:{},
        valName:{},
        items:{
            type:Array,
            default(){
                return []
            }
        },
        keyMap:{
            type:Object,
            default(){
                return {
                    id:"id",
                    text:"value"
                }
            }

        },
        disabled:{
            type:Boolean,
            default:false
        },
        placeholder:{
            type:String,
            default:"请选择"
        },
        multiple:{
            type:Boolean,
            default:false
        },
        // 多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词
        reserveKeyword:{
            type:Boolean,
            default:false
        },
        // 在输入框按下回车，选择第一个匹配项。需配合 filterable 或 remote 使用
        defaultFirstOption:{
            type:Boolean,
            default:false
        },
        // 是否可搜索
        filterable:{
            type:Boolean,
            default:false
        },
        // 是否可以清空选项
        clearable:{
            type:Boolean,
            default:false
        },
        // 是否为远程搜索
        remote:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return{
            isShow:false
        }
    },
    computed:{
        realVal:{
            get() {
                return this.val;
            },
            // 更新父级的状态
            set(val) {
                this.$emit("update:val", val);
            },
        }
    },
    methods: {
        changeHandle(val){
            this.$nextTick(()=>{
                this.$emit("change",val)
            })
        }
    },
}
</script>
<style lang="less" scoped>
.fSelect{
    position: relative;
    .el-input__inner {
        width: 100%;
    }
}
.valName{
    display: inline-block;

}
.valNameSelect{
    position: absolute;
    opacity: 0;
    left: 0;
    top: 0;
}
</style>
