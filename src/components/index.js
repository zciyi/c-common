/*
 * @lastTime: 2022-06-29 09:32:46
 * @LastAuthor: ciyi
 * @message: 
 */
import cGrid from './grid/grid'
import cSelect from './c-select/c-select'
let plugins = {}
const componentsArr = [cGrid,cSelect]
const install = function(Vue){
    if(plugins.install)return
    plugins.install = true
    componentsArr.forEach((item)=>{
        Vue.component(item.name,item)
        if (typeof window !== 'undefined' && window.Vue) {
            install(window.Vue)
        }
    
    })
}
export default install