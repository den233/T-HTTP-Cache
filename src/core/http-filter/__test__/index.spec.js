import {
  urlLoading,
  http,
  dealCacheKeyOption,
  commonRequestFilter,
  commonResponseFilter,
  hasUrl,
  removeUrlLoading,
} from "../index";
import { setOptions, getOptionByUrl } from "../../option/index";
import { setHttpCache } from "../../cache/index";
import { options } from "../../option/__test__/data";
import { cacheKeys } from "../../cache/__test__/data";


describe('test http-filter api', () => {

  it("测试commonRequestFilter and commonResponseFilter loading状态", () => {
    setOptions(options);
    //http.debug = true
    cacheKeys.forEach((cacheKey) => {
      let {type} =  commonRequestFilter(cacheKey.param);
      if(type==="no option"){
        return
      }
      expect(type).toEqual("normal");
      let {type:t,promise} = commonRequestFilter(cacheKey.param);
      expect(t).toEqual("loading");
      promise(res=>res).then(res=>{
        expect(res).toEqual(cacheKey.response);
      })
      
      removeUrlLoading(cacheKey.cacheKey);
    });
  });
  
  it("测试removeUrlLoading", () => {
    setOptions(options);
    cacheKeys.forEach((cacheKey) => {
      urlLoading[cacheKey.cacheKey]=[];
      removeUrlLoading(cacheKey.cacheKey);
      expect(hasUrl(cacheKey.cacheKey)).toEqual(false);
    });
  });
  
  it("测试commonRequestFilter and commonResponseFilter", () => {
    setOptions(options);
    Object.keys(urlLoading).forEach(key=>{
      delete urlLoading[key]
    });
  
    //http.debug = true
    cacheKeys.forEach((cacheKey) => {
      let {type} = commonRequestFilter(cacheKey.param);
      let ret =  commonResponseFilter(cacheKey.param, cacheKey.response);
      let option = getOptionByUrl(cacheKey.param)
      expect(["normal","no option","loading"].includes(type)).toEqual(true);
      if(ret.msg!=="no option"&&option.keepTime!==-1){
        expect(ret.res).toEqual(cacheKey.response);
        expect(commonRequestFilter(cacheKey.param).response).toEqual(cacheKey.response);
      }
      
    });
  });

})


