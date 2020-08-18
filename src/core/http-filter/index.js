import { registerAxiosFilter } from "./axiosFilter";
import { getOptionByUrl } from "../instance/api";
import { setHttpCache,getHttpCacheByKey ,getCacheKey} from "../utils/index"
export const http = {
    lib: null,
    type: ""
}
export const urlLoading = [];

//对axios方法进行扩展封装并返回
export function bindHttp(obj) {
    let type = getObjType(obj);
    if (type === "axios") {
        http.lib = axios;
        http.type = type;
        obj = registerAxiosFilter(obj);
    } 
    console.log("bindHttp",obj)
    console.log("bindHttp",typeof obj)
    return obj;
}

/**
 * 统一请求拦截，
 * 对axios,ajax等之类的请求处理统一方法
 * 返回四个状态，没有配置项，接口正在执行，没有缓存，有缓存
 * @param {*} cacheKeyOpt {type:请求类型,url:请求路径（get请求路径不带参数，需要去除）,params:参数}
 */
export function commonRequestFilter(cacheKeyOpt) {
    const { url } = cacheKeyOpt;
    const option = getOptionByUrl(url);
    if (!option) {
        return "no option";
    }
    const cacheKey = getCacheKey(cacheKeyOpt);
    const response = getHttpCacheByKey(cacheKey);
    //接口正在执行，不进行再次请求
    if (urlLoading.includes(cacheKey)) {
        return "loading";
    } else if (!response) {
        //没有缓存，请求接口
        urlLoading.push(cacheKey);
        return "normal";
    } else {
        //有缓存，返回缓存
        return response;
    }
}
/**
 * 统一响应拦截，
 * 对axios,ajax等之类的响应处理统一方法
 * @param {*} cacheKeyOpt {type:请求类型,url:请求路径（get请求路径不带参数，需要去除）,params:参数}
 * @param {*} response 需要存储的返回值
 */
export function commonResponseFilter(cacheKeyOpt,response) {
    const cacheKey = getCacheKey(cacheKeyOpt);
    if (urlLoading.includes(cacheKey)) {
        setHttpCache(cacheKey, response);
        urlLoading.splice(urlLoading.indexOf(cacheKey), 1);
    };
}



//获取需要绑定的对象类型
function getObjType(obj) {
    if (!!obj.interceptors) {
        return "axios"
    }
}