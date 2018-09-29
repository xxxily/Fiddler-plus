/*!
 * Fiddler CustomRules
 * @Version 1.0.4
 * @Author xxxily
 * @home https://github.com/xxxily/Fiddler-plus
 * @bugs https://github.com/xxxily/Fiddler-plus/issues
 */

/**
 * 全局配置项
 * 可配置链接类型的颜色，代理、替换地址等，
 * 默认对象的键【key】为要匹配的规则，值【key】为匹配后的配置
 */
var GLOBAL_SETTING: Object = {
  // 全局开启禁止缓存功能【不建议开启，严重影响上网体验】
  disableCaching: false,
  // 自定义禁止缓存列表【针对性禁止缓存，进行项目调试的时候不影响其它网站的上网体验】
  disableCachingList: [
    "xxxily.com.cn|xxxily.net.cn",
    // 禁止本地所有连接的缓存，包括IP为192段或127段的所有地址
    // "http://localhost|http://192|http://127",
    // "https://localhost|https://192|https://127"
  ],
  // 过滤配置【用于过滤出哪些URL需要显示，哪些需要隐藏】
  Filter: {
    // 只显示URL包含以下字符的连接
    showLinks:[
      // "qq.com",
      // "baidu.com",
      // "youdao.com"
    ],
    // 不能直接吧 :443规则写在 hideLinks 过滤项上，否则大部分的无关链接都会被间接隐藏
    // Tunnel To 影响前端审查，隐藏掉，目前无法彻底隐藏，逻辑待优化
    hideTunnelTo:true,
    // 隐藏URL包含以下字符串的连接 过滤
    hideLinks: [
      /*隐藏静态资源*/
      // ".jpg|.jpeg|.png|.gif",
      // "baidu.com|qzone.qq.com|qq.com",
      /*隐藏热更新时的请求*/
      // "browser-sync|sockjs-node",
      // "192.168",
      // "hm.baidu.com",
      // "google.com|googleapis.com|mail.google|www.google",
    ],
    // 头部字段过滤器,除非您很熟悉或想测试下这部分功能，否则不建议您使用该过滤项
    headerFieldFilter: [
      {
        //可选值 Referer Content-Type|Cookie|User-Agent|Accept-Language|Host 等，只要是头部支持的值都可以
        fieldName:'Referer',
        workAt:'request', // request|response
        display:true,
        filterList:[
          'xxxily.cc'
        ],
        enabled: false
      }
    ],
    // 只显示以下文件类型【注意：是根据header的 Content-Type字段进行匹配的，所以js文件直接写js是不行的,但支持模糊匹配 】
    // 附注：使用ContentType过滤的时候不一定准确，不带 ContentType的连接会被自动隐藏，该过滤选项的逻辑还有待优化和完善
    showContentType: [
      // "image"
      // "css",
      // "html",
      // "javascript"
    ],
    // 隐藏以下文件类型
    hideContentType: [
      // "image"
      // "css",
      // "html",
      // "javascript"
    ]
  },
  // 替换URL【可用于多环境切换、解决跨域、快速调试线上脚本等】
  replace:{
    "http://xxxily.com/":"http://xxxily.cc/",
    "":""
  },
  // 替换URL的高级版，可以实现多个项目区分管理，进行二级匹配等
  replacePlus:[
    {
      describe:"将【xxxily】服务器上的静态资源替换成本地服务器上的资源",
      source:[
        "http://xxxily.net",
        "http://xxxily.org",
        "http://xxxily.ac.cn",
        "http://xxxily.cc"
      ],
      /*Referer限定，方便精确控制*/
      Referer:[
        '\\w*.html'
      ],
      urlContain:"\\.html|\\.css|\\.js|\\.jpeg|\\.jpg|\\.png|\\.gif|\\.mp4|\\.flv|\\.webp",
      replaceWith:"http://localhost:3000",
      enabled:false
    },
    {
      describe:"将【本地】请求的接口替换成某个服务器上的接口内容",
      source:[
        "http://localhost:3000/",
        "http://127.0.0.1:3000/",
        "http://192.168.0.101:3000/"
      ],
      urlContain:"",
      urlUnContain:"\\.html|\\.css|\\.js|\\.jpeg|\\.jpg|\\.png|\\.gif|\\.ico|\\.mp4|\\.flv|\\.webp|/browser-sync/",
      // bgColor:"#2c2c2c",
      color:"#FF0000",
      // bold:"true",
      replaceWith:"http://xxxily.cc/",
      enabled:false
    }
  ],
  
  // 注意：如果匹配的链接过多，很容易导致：数组下标超限/未将对象应用设置到对象实例等错误弹窗提示
  callbackAcion:[
    {
      describe: "回调操作示例代码",
      source:[
        'http://xxxily.cc/dispather-app/dispacher\\?method=dispacher'
      ],
      // exclude:[],
      include:[
        '.html',
        '.jsp'
      ],
      // 可选值有：OnBeforeRequest OnPeekAtResponseHeaders OnBeforeResponse OnDone OnReturningError ，想匹配多个事件可以使用|进行分隔
      onEvent:'OnBeforeRequest',
      callback:function(oSession,eventName){
        var t = this;
        console.log(eventName);

        if(eventName === 'OnBeforeRequest'){
          var Cookie  = oSession.oRequest['Cookie'];
          if(Cookie){
            console.log(Cookie);
          }else {
            console.log('没找到对于的 Cookie');
          }
          console.log('callbackTest:',oSession.fullUrl);
          oSession.oRequest['Cookie'] = "aaa";
        }

      },
      enabled: false
    },
    {
      describe: "篡改登录信息示例",
      source:[
        'https://xxxily.cc/portal/userLoginAction!checkUser.action'
      ],
      onEvent:'OnBeforeRequest',
      callback:function(oSession,eventName){
        var webForms = oSession.GetRequestBodyAsString(),
          strConv = coreApi.strConv,
          webFormsObj = strConv.parse(webForms);

        webFormsObj['username'] = "testUser";
        webFormsObj['password'] = "testPw";

        /*重设请求参数*/
        oSession.utilSetRequestBody(strConv.stringify(webFormsObj));
      },
      enabled: false
    },
    {
      describe: "本地脚本注入示例",
      source:[
        "xxxily.net.cn",
        "xxxily.com.cn"
      ],
      include:[
        '.html',
        '.jsp',
        'vendor.js',
        'commonInjectForDebug'
      ],
      onEvent:'OnBeforeResponse',
      callback:function(oSession,eventName){

        /*给HTML页面注入调试脚本*/
        if ( oSession.oResponse.headers.ExistsAndContains("Content-Type", "text/html") && oSession.utilFindInResponse("</body>", false)>-1 ){

          oSession.utilDecodeResponse();
          var oBody = System.Text.Encoding.UTF8.GetString(oSession.responseBodyBytes);

          /*注入到head标签之前*/
          var oRegEx = /<head>/i,
            scriptList = [
              '<script src="./commonInjectForDebug.js"></script>',
              '\n<head>'
            ];
          oBody = oBody.replace(oRegEx, scriptList.join(''));

          oSession.utilSetResponseBody(oBody);
        }

        /*将注入的脚本地址内容替换成本地文件，实现本地脚本内容注入*/
        if( oSession.fullUrl.indexOf('commonInjectForDebug') > -1 ){
          oSession["x-replywithfile"] ="D:\\work\\debugTools\\commonInject.js";
        }

      },
      enabled: true
    }
  ],

  // 进行字符串查找，如果查找到将在Log面板显示查找结果
  Search: {
    inRequestHeaders: [],
    inResponseHeaders: [],
    inResponseBody: []
  },

  // 界面显示配置【可以对不同链接进行颜色标识，以便快速定位相关链接】
  UI: {
    // 默认文本颜色
    color: "#c0c0c0",//灰白色
    // 默认背景颜色
    bgColor: "#2c2c2c",//浅黑
    bgColor_02: "#2f2f2f",//浅黑【用于做交替背景，可以不设置】
    // bgColor_02:"#4b4a4a",
    // 链接返回报错时的颜色
    onError: {
      // bgColor:"#2c2c2c",
      color: "#FF0000" //错误红
      // ,bold:"true"
    },
    // 不同关键词匹配对应的连接颜色，key 对应的是匹配的关键字，val对应的是匹配的颜色
    linkColor: {
      "^http": "#ccccff",
      "^https": "#ccffff",
      "\\.jpg|\\.png|\\.gif": "#ffccff", //粉紫色
      "\\.js": "#00ff00", //原谅色
      "\\.css": "#ffcc66", //米黄
      "\\.html": "#00d7ff", //蓝色
      "\\.php": "#fff32d", //大黄
      "\\.jsp": "#fd4107" //砖红
    },
    // 根据 contentType 匹配连接颜色
    contentTypeColor: {
      "image": "#ffccff",
      "css": "#ffcc66",
      // html 类型容易跟其他接口数据混淆，无特别明确情况下不建议对其进行特殊标识
      // "html":"#00d7ff",
      "javascript": "#00ff00"
    },
    // 可以为特殊状态码设置不同颜色，方便快速定位一些错误链接，例如404等
    // 注意：这个只是根据responseCode 来匹配的，一些不存在response的链接配置是无效的，例如 502,504状态，应该是在onError里配置的
    statusCode: {
      "404|408|500|502|504": "#FF0000", //错误红
      "304": "#5e5e5e" //浅灰色
    },
    // 高亮，对特殊的链接进行高亮设置，方便跟踪查看链接
    highlight: {
      /*
      ".action": {
        color: "#FF0000", //警告红
        describe: "标红接口，好快速定位接口连接"
      },
      */
      /*
      "positionAjax.json": {
        color: "#FF0000", //警告红
        describe: "标红接口，好快速定位接口连接"
      },
      */
      /*
      "http://localhost|192.168":{
          // bgColor:"#2c2c2c", //浅黑
          color:"#00ff00", //原谅色
          bold:"true",
          describe:"高亮测试"
      },
      "youdao.com":{
          bgColor:"#FF0000", //红色
          color:"#fdf404", //黄色
          bold:"true",
          describe:"高亮测试"
      },
      "google.com|googleapis.com":{
          bgColor:"#00ff00", //原谅色
          color:"#fdf404", //黄色
          bold:"true",
          describe:"高亮测试"
      },
      */
      "": ""
    }
  },
  // 一些实用工具集，先列个可能会开发的工具集，留个坑以后有时间再开发
  Tools: {
    // TODO API 测试工具
    apiTest: {},
    // TODO 重放攻击工具>
    replay: {},
    // TODO 内容注入工具
    contentInject: {},
    // TODO 类似 weinre 这样的注入调试工具
    weinre: {}
  },
  // 多项分隔符号【同一个配置需匹配多项规则时可以通过分隔符进行区分，这样就不用每个规则都要新开一份配置那么繁琐】
  splitStr: "|",
  // 正则匹配的修饰符：i,g,m 默认i，不区分大小写
  regAttr: "i"
};
//全局配置项 END

// 调试方法 BEGIN
if (!console) {
  var console = {};
  console.log = function (arg1, arg2, arg3, arg4, arg5, arg6) {
    // 不支持 arguments ，尴尬！
    var args = [arg1, arg2, arg3, arg4, arg5, arg6];
    var argsLen = 0;
    for (var i = 0; i < args.length; i++) {
      var arg = args[i];
      if (typeof arg === "undefined") {
        break;
      }
      argsLen += 1;

      var argType = typeof arg;

      if (argType === "string" || argType === "number") {
        FiddlerObject.log(arg);
      } else if (argType === "boolean") {
        FiddlerObject.log("boolean:" + arg);
      } else if (argType === "object" && arg.toString) {
        FiddlerObject.log(arg.toString());
      } else {
        try {
          FiddlerObject.log("尝试遍历输出：" + argType);
          for (var str = "" in arg) {
            FiddlerObject.log(str + ":" + arg[str]);
          }
        } catch (ex) {
          FiddlerObject.log("遍历输出失败：" + ex);
          FiddlerObject.log(arg);
        }
      }
    }
    if (argsLen > 1) {
      FiddlerObject.log("----------------------------------------------");
    }
  }
}
if (!alert) {
  var alert = FiddlerObject.alert;
}
// 调试方法 END

/*核心API 内置一些常用的方法 BEGIN*/
var coreApi: Object = {
  /*字符串转换器*/
  strConv:{
    /**
     * 把具有某些规则的字符串转换为对象字面量，例如：a=1&b=2&c=3
     * @param regularStr （String） -必选，某个规则的字符串
     * #param splitStr （String） -可选 分隔符，默认&
     */
    parse:function parse (regularStr,splitStr) {
      var str = regularStr || '',
        splitStr = splitStr || '&',
        obj = {},
        arr = str.split(splitStr),
        len = arr.length;

      for(var i = 0 ; i < len ; i++){
        var curArr = arr[i].split('=');
        obj[curArr[0]] = curArr[1];
      }
      if(!str){
        obj = {} ;
      }
      return obj ;
    },
    /**
     * 把使用上面的parse方法转换的对象，重新转换成字符串表达形式
     * @param obj （object） -必选，某个对象
     * #param splitStr （String） -可选 分隔符，默认&
     */
    stringify:function (obj,splitStr) {
      if(!obj){
        return ;
      }
      var splitStr = splitStr || '&',
        strArr = [] ;
      for (var key in obj) {
        var val = obj[key],
          valType = typeof val ;
        if( (valType === 'string' || valType === 'number') && val != "" ){
          strArr.push(key+'='+val);
        }else if(valType === 'object'){
          /*二级对象是不支持的，为了不报错，将二级对象使用[object]进行代替*/
          strArr.push(key+'='+'[object]');
        }
      }
      return strArr.join(splitStr);
    }
  }
};
/*核心常用API 内置一些常用的方法 END*/

/**
 * 自动移除禁止项，减少后续逻辑不必要的循环消耗
 * @param obj 要操作的对象
 */
function removeDisableItem(source) {
  var me = this,
    result = {}
  ;
  if(typeof source != 'object'){
    return source;
  }
  if (Object.prototype.toString.call(source) === '[object Array]') {
    result = [];
  }
  if (Object.prototype.toString.call(source) === '[object Null]') {
    result = null;
  }
  for (var key in source) {
    if(typeof source[key] === 'object'){
      /*跳过enabled为false的项目*/
      if(Object.prototype.toString.call(source[key]) === '[object Object]' && source[key]['enabled'] === false){
        continue;
      }else {
        result[key] = removeDisableItem(source[key])
      }
    }else{
      result[key] = source[key]
    }
  }
  return result;
}

// 实测 GLOBAL_SETTING 每个请求都要加载一次，所以此优化可能出现反效果，后续如果出现很多enabled为false的配置再开启实测下
// GLOBAL_SETTING = removeDisableItem(GLOBAL_SETTING);


// .NET Framework API document
// https://docs.microsoft.com/zh-cn/dotnet/api/index?view=netframework-4.7.2
import System;
import System.Windows.Forms;
import Fiddler;
// INTRODUCTION
//
// Well, hello there!
//
// Don't be scared! :-)
//
// This is the FiddlerScript Rules file, which creates some of the menu commands and
// other features of Fiddler. You can edit this file to modify or add new commands.
//
// The original version of this file is named SampleRules.js and it is in the
// \Program Files\Fiddler\ folder. When Fiddler first runs, it creates a copy named
// CustomRules.js inside your \Documents\Fiddler2\Scripts folder. If you make a
// mistake in editing this file, simply delete the CustomRules.js file and restart
// Fiddler. A fresh copy of the default rules will be created from the original
// sample rules file.

// The best way to edit this file is to install the FiddlerScript Editor, part of
// the free SyntaxEditing addons. Get it here: http://fiddler2.com/r/?SYNTAXVIEWINSTALL

// GLOBALIZATION NOTE: Save this file using UTF-8 Encoding.

// JScript.NET Reference
// http://fiddler2.com/r/?msdnjsnet
//
// FiddlerScript Reference
// http://fiddler2.com/r/?fiddlerscriptcookbook

class Handlers {
  // *****************
  //
  // This is the Handlers class. Pretty much everything you ever add to FiddlerScript
  // belongs right inside here, or inside one of the already-existing functions below.
  //
  // *****************

  // The following snippet demonstrates a custom-bound column for the Web Sessions list.
  // See http://fiddler2.com/r/?fiddlercolumns for more info
  /*
   public static BindUIColumn("Method", 60)
   function FillMethodColumn(oS: Session): String {
   return oS.RequestMethod;
   }
   */

  // The following snippet demonstrates how to create a custom tab that shows simple text
  /*
   public BindUITab("Flags")
   static function FlagsReport(arrSess: Session[]):String {
   var oSB: System.Text.StringBuilder = new System.Text.StringBuilder();
   for (var i:int = 0; i<arrSess.Length; i++)
   {
   oSB.AppendLine("SESSION FLAGS");
   oSB.AppendFormat("{0}: {1}\n", arrSess[i].id, arrSess[i].fullUrl);
   for(var sFlag in arrSess[i].oFlags)
   {
   oSB.AppendFormat("\t{0}:\t\t{1}\n", sFlag.Key, sFlag.Value);
   }
   }
   return oSB.ToString();
   }
   */

  // You can create a custom menu like so:
  /*
   QuickLinkMenu("&Links")
   QuickLinkItem("IE GeoLoc TestDrive", "http://ie.microsoft.com/testdrive/HTML5/Geolocation/Default.html")
   QuickLinkItem("FiddlerCore", "http://fiddler2.com/fiddlercore")
   public static function DoLinksMenu(sText: String, sAction: String)
   {
   Utilities.LaunchHyperlink(sAction);
   }
   */

  public static RulesOption("Hide 304s")
  BindPref("fiddlerscript.rules.Hide304s")
  var m_Hide304s: boolean = false;

  // Cause Fiddler to override the Accept-Language header with one of the defined values
  public static RulesOption("Request &Japanese Content")
  var m_Japanese: boolean = false;

  // Automatic Authentication
  public static RulesOption("&Automatically Authenticate")

  BindPref("fiddlerscript.rules.AutoAuth")
  var m_AutoAuth: boolean = false;

  // Cause Fiddler to override the User-Agent header with one of the defined values
  // The page http://browserscope2.org/browse?category=selectors&ua=Mobile%20Safari is a good place to find updated versions of these
  RulesString("&User-Agents",true)

  BindPref("fiddlerscript.ephemeral.UserAgentString")

  RulesStringValue(0,"Netscape &3","Mozilla/3.0 (Win95; I)")

  RulesStringValue(1,"WinPhone8.1","Mozilla/5.0 (Mobile; Windows Phone 8.1; Android 4.0; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; Lumia 520) like iPhone OS 7_0_3 Mac OS X AppleWebKit/537 (KHTML, like Gecko) Mobile Safari/537")

  RulesStringValue(2,"&Safari5 (Win7)","Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1")

  RulesStringValue(3,"Safari9 (Mac)","Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11) AppleWebKit/601.1.56 (KHTML, like Gecko) Version/9.0 Safari/601.1.56")

  RulesStringValue(4,"iPad","Mozilla/5.0 (iPad; CPU OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12F5027d Safari/600.1.4")

  RulesStringValue(5,"iPhone6","Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12F70 Safari/600.1.4")

  RulesStringValue(6,"IE &6 (XPSP2)","Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)")

  RulesStringValue(7,"IE &7 (Vista)","Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; SLCC1)")

  RulesStringValue(8,"IE 8 (Win2k3 x64)","Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.2; WOW64; Trident/4.0)")

  RulesStringValue(9,"IE &8 (Win7)","Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0)")

  RulesStringValue(10,"IE 9 (Win7)","Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)")

  RulesStringValue(11,"IE 10 (Win8)","Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; WOW64; Trident/6.0)")

  RulesStringValue(12,"IE 11 (Surface2)","Mozilla/5.0 (Windows NT 6.3; ARM; Trident/7.0; Touch; rv:11.0) like Gecko")

  RulesStringValue(13,"IE 11 (Win8.1)","Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko")

  RulesStringValue(14,"Edge (Win10)","Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.11082")

  RulesStringValue(15,"&Opera","Opera/9.80 (Windows NT 6.2; WOW64) Presto/2.12.388 Version/12.17")

  RulesStringValue(16,"&Firefox 3.6","Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.7) Gecko/20100625 Firefox/3.6.7")

  RulesStringValue(17,"&Firefox 43","Mozilla/5.0 (Windows NT 6.3; WOW64; rv:43.0) Gecko/20100101 Firefox/43.0")

  RulesStringValue(18,"&Firefox Phone","Mozilla/5.0 (Mobile; rv:18.0) Gecko/18.0 Firefox/18.0")

  RulesStringValue(19,"&Firefox (Mac)","Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0")

  RulesStringValue(20,"Chrome (Win)","Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.48 Safari/537.36")

  RulesStringValue(21,"Chrome (Android)","Mozilla/5.0 (Linux; Android 5.1.1; Nexus 5 Build/LMY48B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36")

  RulesStringValue(22,"ChromeBook","Mozilla/5.0 (X11; CrOS x86_64 6680.52.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.74 Safari/537.36")

  RulesStringValue(23,"GoogleBot Crawler","Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)")

  RulesStringValue(24,"Kindle Fire (Silk)","Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_3; en-us; Silk/1.0.22.79_10013310) AppleWebKit/533.16 (KHTML, like Gecko) Version/5.0 Safari/533.16 Silk-Accelerated=true")

  RulesStringValue(25,"&Custom...","%CUSTOM%")
  public static var sUA: String = null;

  // Cause Fiddler to delay HTTP traffic to simulate typical 56k modem conditions
  public static RulesOption("Simulate &Modem Speeds","Per&formance")
  var m_SimulateModem: boolean = false;

  // Removes HTTP-caching related headers and specifies "no-cache" on requests and responses
  public static RulesOption("&Disable Caching","Per&formance")
  // 默认禁止缓存
  var m_DisableCaching: boolean = false;

  public static RulesOption("Cache Always &Fresh","Per&formance")
  var m_AlwaysFresh: boolean = false;

  // Force a manual reload of the script file.  Resets all
  // RulesOption variables to their defaults.
  public static ToolsAction("Reset Script") function DoManualReload() {
    FiddlerObject.ReloadScript();
  }

  public static ContextAction("Decode Selected Sessions") function DoRemoveEncoding(oSessions: Session[]) {
    for (var x: int = 0; x < oSessions.Length; x++) {
      oSessions[x].utilDecodeRequest();
      oSessions[x].utilDecodeResponse();
    }
    UI.actUpdateInspector(true, true);
  }

  // ------------ 通用公共方法 BEGIN ------------

  /**
   * 准确地获取对象的具体类型 参见：https://www.talkingcoder.com/article/6333557442705696719
   * @param obj { all } -必选 要判断的对象
   * @returns {*} 返回判断的具体类型
   */
  public static function getType(obj) {
    if (obj == null) {
      return String(obj);
    }
    return typeof obj === 'object' || typeof obj === 'function' ?
      obj.constructor && obj.constructor.name && obj.constructor.name.toLowerCase() ||
      /function\s(.+?)\(/.exec(obj.constructor)[1].toLowerCase() :
      typeof obj;
  }

  /**
   * 判断某个字符串是否和另外一个字符串相匹配，是对 System.Text.RegularExpressions.Regex.IsMatch 的简单封装
   * @param s_str (String) -必选 源字符串
   * @param m_str (String) -必选 需要匹配的字符串
   */
  public static function isMatch(s_str, m_str) {
    return System.Text.RegularExpressions.Regex.IsMatch(s_str, m_str);
  }

  /**
   * 根据字符串创建一个正则表达式
   * @param str (String) -必选 正则字符串
   * @param attributes (String) -可选 匹配修饰符，i,g,m, 默认不添加任何修饰符
   */
  static function createPattern(str, attributes) {
    try {
      var att = attributes || GLOBAL_SETTING.regAttr || "";
      return new RegExp(str, att);
    } catch (ex) {
      console.log(ex.toString());
      return false;
    }
  }

  /**
   * 判断某个字符串是否存在另外一个字符串里面，如果存在则进行相关回调操作，不存在则忽略
   * @param s_str (String) -必选 源字符串
   * @param m_str (String) -必选 需要匹配的字符串
   * @param callback (Function) -必选 匹配成功的回调操作，回调中返回匹配到的字符串、源字符串、需匹配的字符串
   * @param splitStr (String) -可选 多项分隔符，默认为|,
   * @param attributes (String) -可选 匹配修饰符，i,g,m, 默认不添加任何修饰符
   */
  public static function matchPlus(s_str, m_str, callback, splitStr, attributes) {
    if (!s_str || !m_str || typeof callback !== "function") {
      return false;
    }
    var spStr = splitStr || GLOBAL_SETTING.splitStr || ",",
      att = attributes || GLOBAL_SETTING.regAttr || "",
      regArr = m_str.split(spStr),
      len = regArr.length,
      i = 0,
      canBreak = false;
    for (i; i < len; i++) {
      var regStr = regArr[i];
      // var patt = new RegExp(regStr,att);
      var patt = createPattern(regStr, attributes);
      if (!patt) {
        canBreak = callback(null);
      } else if (patt.test(s_str)) {
        canBreak = callback(regStr);
      } else {
        continue;
      }
      if (canBreak === true) {
        break;
      }
    }
  }

  /**
   * 根据配置项 匹配 oSession里面的url对象，进行相关处理，注意：为了方便查看，配置项使用"|"进行多项分隔，所以如果写复杂的正则也包含|时会存在匹配冲突
   * 故有特殊需要的可以改变下面代码中的分隔符，使其能进行更复杂的正则匹配（配置项注意使用跟如下一致的分隔符）
   * @param str (String) -必选 要进行匹配判断的字符串（例如url）
   * @param settingItem (Object|Array) -必选 GLOBAL_SETTING 下的某个配置项，可以是对象，也可以是数组
   * @param callback (Function) -必选 如果存在跟配置项匹配的选项则进行相关回调处理
   * @param errorMsg (String) -可选 出错时提示信息，方便快速定位问题
   */
  public static function settingMatch(str, settingItem, callback, errorMsg) {

    var settingItemType = getType(settingItem);

    if (!str || !settingItem || (settingItemType === "array" && settingItem.length === 0)) {
      return -1;
    }

    var canBreak = false; // 是否可以终止循环，停掉没必要的循环，减少资源消耗
    var errorMsg = errorMsg || "url匹配时出现错误，请检查您的配置";
    // 为了节省代码类型为object 和 array的其实可以合并一起处理，这里为了区分对待，暂时不打算合并
    if (settingItemType === "object") {
      // 对象类的配置是包含匹配项和下级配置项的，所以要进行特殊处理
      for (var itemKw = "" in settingItem) {
        matchPlus(str, itemKw, function (matchStr) {
          if (!matchStr) {
            console.log(str, errorMsg);
          } else {
            canBreak = callback(settingItem[itemKw], matchStr);
            return canBreak;
          }
        }, null, null);
        if (canBreak === true) {
          break;
        }
      }
    } else if (settingItemType === "array") {
      // 数组类的配置项其实和字符串类的配置项一样，只是为了进行多项配置时查看更方便
      var tmLen = settingItem.length;
      for (var i = 0; i < tmLen; i++) {
        matchPlus(str, settingItem[i], function (matchStr) {
          if (!matchStr) {
            console.log(str, errorMsg);
          } else {
            canBreak = callback(settingItem[i], matchStr);
            return canBreak;
          }
        }, null, null);
        if (canBreak === true) {
          break;
        }
      }
    } else if (settingItemType === "string") {
      // 字符串类的配置，只关注是否匹配成功，不存在下级配置项
      matchPlus(str, settingItem, function (matchStr) {
        if (!matchStr) {
          console.log(str, errorMsg);
        } else {
          canBreak = callback(settingItem, matchStr);
          return canBreak;
        }
      }, null, null);
    } else {
      return false;
    }
  }

  /**
   * 所有参数和settingMatch一致，唯一区别是，在不匹配时进行回调，回调里不带任何参数
   */
  public static function settingUnMatch(str, settingItem, callback, errorMsg) {
    var isMatch = false;
    var result = settingMatch(str, settingItem, function (conf, matchStr) {
      isMatch = true;
      return true;
    }, errorMsg);
    if (!isMatch && result !== -1) {
      callback();
    }
  }

  // 用于背景做交替显示的记号
  public static var showLinkCount = 0;

  /**
   * 隐藏连接，为了确保程序没错误隐藏连接，固写成统一的方法，方便快速调试
   * @param oSession (Session) -必选，Session 对象
   */
  public static function hideLink(oSession) {
    // console.log("以下连接已被隐藏：",oSession.fullUrl);
    showLinkCount -= 1;
    oSession["ui-hide"] = "true";
    oSession.Ignore();
  }

  /**
   * 隐藏连接，TunnelTo 一堆无用连接
   * @param oSession (Session) -必选，Session 对象
   */
  public static function hideTunnelToLink(oSession) {
    // TODO 过滤 tunnel to 连接 待优化
    var hideTunnelTo = GLOBAL_SETTING.Filter.hideTunnelTo;
    if(hideTunnelTo){
      settingMatch(oSession.fullUrl, [':443'], function () {
        hideLink(oSession);
      }, "【hideTunnelTo】配置出错，请检查你的配置");
    }
  }

  /**
   * 每个匹配链接的回调操作对象
   * @param oSession (Session) -必选，Session 对象
   * @param eventName (String) -必选，回调事件名称 可选值有：OnBeforeRequest OnPeekAtResponseHeaders OnBeforeResponse OnDone OnReturningError
   */
  public static function sessionCallback(oSession,eventName) {
    if(!oSession || !eventName || !settingMatch){
      // console.log('出现【未将对象引用设置到对象实例】的错误~');
      return false;
    }

    var callbackAcion = GLOBAL_SETTING.callbackAcion;
    if (callbackAcion && callbackAcion.length > 0) {
      var len = callbackAcion.length;
      for (var i = 0; i < len; i++) {
        var settingItem = callbackAcion[i];

        /*指定要匹配的事件，减少不必要的回调操作*/
        var eventPatt = createPattern(settingItem['onEvent'],'i');
        if (settingItem.enabled && eventPatt.test(eventName)) {
          settingMatch(oSession.fullUrl, settingItem.source, function (conf, matchStr) {

            if(settingItem.include){
              settingMatch(oSession.fullUrl,settingItem.include,function (conf,matchStr) {
                settingItem.callback(oSession,eventName);
              },"【callbackAcion_include】配置出错，请检查你的配置")
            }else if(settingItem.exclude) {
              settingUnMatch(oSession.fullUrl,settingItem.include,function (matchStr) {
                settingItem.callback(oSession,eventName);
              },"【callbackAcion_exclude】配置出错，请检查你的配置")
            }else {
              settingItem.callback(oSession,eventName);
            }

            return true;
          }, "【callbackAcion】配置出错，请检查你的配置");
        }
      }
    }
  }

  /**
   * 设置 Session 的界面呈现
   * @param oSession (Session) -必选，Session 对象
   * @param conf (Object) -可选，要设置 Session 呈现的界面配置，形如：{bgColor:"#2c2c2c",color:"#FF0000",bold:true}
   */
  public static function setSessionDisplay(oSession, conf) {
    conf.bgColor ? oSession["ui-backcolor"] = conf.bgColor : "";
    conf.color ? oSession["ui-color"] = conf.color : "";
    conf.bold ? oSession["ui-bold"] = "true" : "";
  }

  public static function oSessionCore(oSession, opt) {
    if (!oSession) {
      return false;
    }
    // 核心方法
    var core = {
      /**
       * 设置 Session 的界面呈现
       * @param oSession (Session) -必选，Session 对象
       * @param conf (Object) -可选，要设置 Session 呈现的界面配置，形如：{bgColor:"#2c2c2c",color:"#FF0000",bold:true}
       */
      setDisplay: function (conf) {
        conf.bgColor ? oSession["ui-backcolor"] = conf.bgColor : "";
        conf.color ? oSession["ui-color"] = conf.color : "";
        conf.bold ? oSession["ui-bold"] = "true" : "";
      }
    };
    // if(opt instanceof Object && opt["run"] && core[] )
  }

  // ------------ 通用公共方法 END ------------

  // 参考文档 http://docs.telerik.com/fiddler/KnowledgeBase/FiddlerScript/ModifyRequestOrResponse
  static function OnBeforeRequest(oSession: Session) {

    showLinkCount += 1;

    /*Fiddler有时候会掉链子，所以必须加强判断，才能减少callbackAcion功能的报错提示*/
    if(settingMatch && settingUnMatch && oSession){
      sessionCallback && sessionCallback(oSession,'OnBeforeRequest');

      // 过滤出需要显示或隐藏的连接 BEGIN

      var showLinks = GLOBAL_SETTING.Filter.showLinks,
        hideLinks = GLOBAL_SETTING.Filter.hideLinks;
      // 过滤出要显示的连接，把不在显示列表里的连接隐藏掉
      settingUnMatch(oSession.fullUrl, showLinks, function () {
        hideLink(oSession);
      }, "【showLinks】配置出错，请检查你的配置");

      // 过滤出要隐藏的连接，把在隐藏列表里的连接隐藏掉
      settingMatch(oSession.fullUrl, hideLinks, function (conf, matchStr) {
        hideLink(oSession);
        return true;
      }, "【hideLinks】配置出错，请检查你的配置");

      // 过滤出需要显示或隐藏的连接 END

      // 根据头部字段过滤出需要显示或隐藏的连接 BEGIN
      var headerFilter = GLOBAL_SETTING.Filter.headerFieldFilter;
      if (headerFilter && headerFilter.length > 0) {
        var hfLen = headerFilter.length;
        for (var i = 0; i < hfLen; i++) {
          var settingItem = headerFilter[i];
          if (settingItem.enabled === true && settingItem.workAt === 'request' && settingItem.fieldName) {
            if(settingItem.display === true ){
              // 过滤出要显示的连接，把不在显示列表里的连接隐藏掉
              if(oSession.oRequest[settingItem.fieldName]){
                settingUnMatch(oSession.oRequest[settingItem.fieldName], settingItem.filterList, function () {
                  hideLink(oSession);
                }, "【headerFieldFilter_show】配置出错，请检查你的配置");
              }else {
                /*不存在对于header属值的，不能直接隐藏，只能后续操作，否则会把其关联的链接也一并隐藏，最后就会导致无任何链接可显示*/
                // hideLink(oSession);
                // console.log('以下链接本该隐藏的，但是由于具有关联性，不能将其马上隐藏：',oSession.fullUrl);
                oSession['hide-me'] = 'true';
              }
            }else {
              // 过滤出要隐藏的连接，把在隐藏列表里的连接隐藏掉
              settingMatch(oSession.oRequest[settingItem.fieldName], settingItem.filterList, function (conf, matchStr) {
                hideLink(oSession);
                return true;
              }, "【headerFieldFilter_hide】配置出错，请检查你的配置");
            }
          }
        }
      }
      // 根据头部字段过滤出需要显示或隐藏的连接 END

      // 过滤出要禁止缓存的连接
      var disableCachingList = GLOBAL_SETTING.disableCachingList;
      settingMatch(oSession.fullUrl, disableCachingList, function (conf, matchStr) {
        oSession["disableCaching"] = true;
        return true;
      }, "【disableCachingList】配置出错，请检查你的配置");


      // 标注隐藏443链接
      if(GLOBAL_SETTING.Filter.hideTunnelTo){
        settingMatch(oSession.fullUrl, [':443'], function () {
          oSession['hide-me'] = 'true';
        }, "【hideTunnelTo】配置出错，请检查你的配置");
      }

      // 配色 BEGIN

      if (!oSession["ui-hide"] && GLOBAL_SETTING.UI) {
        // 默认背景【存在 bgColor_02 时进行交替显示】 注：因为http请求的无序特性，所以不能确保百分百准确交替，待深入优化
        if (GLOBAL_SETTING.UI.bgColor_02 && (showLinkCount % 2 === 0)) {
          oSession["ui-backcolor"] = GLOBAL_SETTING.UI.bgColor_02;
        } else {
          oSession["ui-backcolor"] = GLOBAL_SETTING.UI.bgColor || "#2c2c2c";
        }

        // 默认文本颜色
        oSession["ui-color"] = GLOBAL_SETTING.UI.color;

        // 根据关键词设置连接渲染的颜色
        settingMatch(oSession.fullUrl, GLOBAL_SETTING.UI.linkColor, function (conf, matchStr) {
          conf ? oSession["ui-color"] = conf : "";
        }, "【linkColor】配置出错，请检查你的配置");

        // 高亮特殊连接
        settingMatch(oSession.fullUrl, GLOBAL_SETTING.UI.highlight, function (conf, matchStr) {
          setSessionDisplay(oSession, conf);
        }, "【highlight】配置出错，请检查你的配置");
      }

      if (!oSession["ui-hide"] && GLOBAL_SETTING.skin) {
        var skins = GLOBAL_SETTING.skin,
          skLen = skins.length;
        for (var i = 0; i < skLen; i++) {
          var skin = skins[i];
          if (skin.enable === true) {
            //
          }
        }
      }

      // 配色 END

      // 接管替换URL BEGIN

      // 简单替换
      settingMatch(oSession.fullUrl, GLOBAL_SETTING.replace, function (conf, matchStr) {
        // System.Text.RegularExpressions.Regex.IsMatch(oSession.fullUrl, "https://" );
        oSession.fullUrl = System.Text.RegularExpressions.Regex.Replace(oSession.fullUrl, matchStr, conf);
      }, "【replace】配置出错，请检查你的配置");

      // 高级替换
      var replacePlus = GLOBAL_SETTING.replacePlus;
      if (replacePlus && replacePlus.length > 0) {
        var rpLen = replacePlus.length;
        for (var i = 0; i < rpLen; i++) {
          var rpSettingItem = replacePlus[i];
          if (rpSettingItem.enabled === true && rpSettingItem.replaceWith) {
            settingMatch(oSession.fullUrl, rpSettingItem.source, function (conf, matchStr) {
              // 执行替换操作
              var execReplace = function () {
                var newUrl = System.Text.RegularExpressions.Regex.Replace(oSession.fullUrl, matchStr, rpSettingItem.replaceWith);
                oSession.fullUrl = newUrl;
                setSessionDisplay(oSession, rpSettingItem);
                rpSettingItem.disableCaching ? oSession["disableCaching"] = true : "";

              };

              var hasPassCheck = true ;

              // Referer限定
              if(hasPassCheck && rpSettingItem.Referer && rpSettingItem.Referer.length > 0){

                if(!oSession.oRequest['Referer']){
                  hasPassCheck = false;
                }

                settingUnMatch(oSession.oRequest['Referer'], rpSettingItem.Referer, function (matchStr02) {
                  hasPassCheck = false;
                }, "【replacePlus里面的Referer】配置出错，请检查你的配置");

                /*让请求页面通过限定，才能往下玩*/
                settingMatch(oSession.fullUrl, rpSettingItem.Referer, function (matchStr02) {
                  hasPassCheck = true;
                }, "【replacePlus里面的Referer】配置出错，请检查你的配置");

              }

              // urlContain限定
              if(hasPassCheck && rpSettingItem.urlContain && rpSettingItem.urlContain.length > 0){
                settingUnMatch(oSession.fullUrl, rpSettingItem.urlContain, function (matchStr02) {
                  hasPassCheck = false;
                }, "【replacePlus里面的urlContain】配置出错，请检查你的配置");
              }

              // urlUnContain限定
              if(hasPassCheck && rpSettingItem.urlUnContain && rpSettingItem.urlUnContain.length > 0){
                settingMatch(oSession.fullUrl, rpSettingItem.urlUnContain, function (matchStr02) {
                  hasPassCheck = false;
                }, "【replacePlus里面的urlContain】配置出错，请检查你的配置");
              }

              if(hasPassCheck){
                execReplace();
              }

            }, "【replacePlus】配置出错，请检查你的配置");
          }
        }
      }

      // 接管替换URL END

      // 根据关键字进行搜索查找 BEGIN
      var searchInRequestHeaders = GLOBAL_SETTING.Search.inRequestHeaders,
        searchStrCount = searchInRequestHeaders.length;
      for (var i = 0; i < searchStrCount; i++) {
        var skw = searchInRequestHeaders[i];
        try {
          var reqHeaders = oSession.RequestHeaders;
          if (reqHeaders) {
            for (var key = "" in reqHeaders) {

              var result01 = isMatch(reqHeaders[key], skw);
              var result02 = isMatch(key, skw);
              if (result01 || result02) {
                console.log(oSession.fullUrl, "进行RequestHeaders搜索查找时找到匹配的字符串：" + skw, key + ":" + reqHeaders[key]);
              }
            }
          }
        } catch (ex) {
          console.log("进行RequestHeaders遍历搜索时出错,当前搜索关键词为：" + skw);
        }
      }
      // 根据关键字进行搜索查找 END
    }

    // Sample Rule: Color ASPX requests in RED
    // if (oSession.uriContains(".aspx")) {	oSession["ui-color"] = "red";	}

    // Sample Rule: Flag POSTs to fiddler2.com in italics
    // if (oSession.HostnameIs("www.fiddler2.com") && oSession.HTTPMethodIs("POST")) {	oSession["ui-italic"] = "yup";	}

    // Sample Rule: Break requests for URLs containing "/sandbox/"
    // if (oSession.uriContains("/sandbox/")) {
    //     oSession.oFlags["x-breakrequest"] = "yup";	// Existence of the x-breakrequest flag creates a breakpoint; the "yup" value is unimportant.
    // }

    // 通过QuickExec 输入字符串来筛选出要高亮的url
    if ((null != filter_and_highlight_url) && oSession.uriContains(filter_and_highlight_url)) {
      oSession["ui-color"] = "#FF0000";
      oSession["ui-bold"] = "true";
    }

    if ((null != gs_ReplaceToken) && (oSession.fullUrl.indexOf(gs_ReplaceToken) > -1)) {   // Case sensitive
      oSession.fullUrl = oSession.fullUrl.Replace(gs_ReplaceToken, gs_ReplaceTokenWith);
    }
    if ((null != gs_OverridenHost) && (oSession.host.toLowerCase() == gs_OverridenHost)) {
      oSession["x-overridehost"] = gs_OverrideHostWith;
    }

    if ((null != bpRequestURI) && oSession.uriContains(bpRequestURI)) {
      oSession["x-breakrequest"] = "uri";
    }

    if ((null != bpMethod) && (oSession.HTTPMethodIs(bpMethod))) {
      oSession["x-breakrequest"] = "method";
    }

    if ((null != uiBoldURI) && oSession.uriContains(uiBoldURI)) {
      oSession["ui-bold"] = "QuickExec";
    }

    if (m_SimulateModem) {
      // Delay sends by 300ms per KB uploaded.
      oSession["request-trickle-delay"] = "300";
      // Delay receives by 150ms per KB downloaded.
      oSession["response-trickle-delay"] = "150";
    }

    if (m_DisableCaching || GLOBAL_SETTING.disableCaching || oSession["disableCaching"]) {
      oSession.oRequest.headers.Remove("If-None-Match");
      oSession.oRequest.headers.Remove("If-Modified-Since");
      oSession.oRequest["Pragma"] = "no-cache";
    }

    // User-Agent Overrides
    if (null != sUA) {
      oSession.oRequest["User-Agent"] = sUA;
    }

    if (m_Japanese) {
      oSession.oRequest["Accept-Language"] = "ja";
    }

    if (m_AutoAuth) {
      // Automatically respond to any authentication challenges using the
      // current Fiddler user's credentials. You can change (default)
      // to a domain\\username:password string if preferred.
      //
      // WARNING: This setting poses a security risk if remote
      // connections are permitted!
      oSession["X-AutoAuth"] = "(default)";
    }

    if (m_AlwaysFresh && (oSession.oRequest.headers.Exists("If-Modified-Since") || oSession.oRequest.headers.Exists("If-None-Match"))) {
      oSession.utilCreateResponseAndBypassServer();
      oSession.responseCode = 304;
      oSession["ui-backcolor"] = "Lavender";
    }
  }

  //OnBeforeRequest END

  // This function is called immediately after a set of request headers has
  // been read from the client. This is typically too early to do much useful
  // work, since the body hasn't yet been read, but sometimes it may be useful.
  //
  // For instance, see
  // http://blogs.msdn.com/b/fiddler/archive/2011/11/05/http-expect-continue-delays-transmitting-post-bodies-by-up-to-350-milliseconds.aspx
  // for one useful thing you can do with this handler.
  //
  // Note: oSession.requestBodyBytes is not available within this function!
  /*
   static function OnPeekAtRequestHeaders(oSession: Session) {
   var sProc = ("" + oSession["x-ProcessInfo"]).ToLower();
   if (!sProc.StartsWith("mylowercaseappname")) oSession["ui-hide"] = "NotMyApp";
   }
   */

  //
  // If a given session has response streaming enabled, then the OnBeforeResponse function
  // is actually called AFTER the response was returned to the client.
  //
  // In contrast, this OnPeekAtResponseHeaders function is called before the response headers are
  // sent to the client (and before the body is read from the server).  Hence this is an opportune time
  // to disable streaming (oSession.bBufferResponse = true) if there is something in the response headers
  // which suggests that tampering with the response body is necessary.
  //
  // Note: oSession.responseBodyBytes is not available within this function!
  //
  static function OnPeekAtResponseHeaders(oSession: Session) {

    if(settingMatch && settingUnMatch && oSession){
      sessionCallback && sessionCallback(oSession,'OnPeekAtResponseHeaders');
    }

    //FiddlerApplication.Log.LogFormat("Session {0}: Response header peek shows status is {1}", oSession.id, oSession.responseCode);
    if (m_DisableCaching || GLOBAL_SETTING.disableCaching || oSession["disableCaching"]) {
      oSession.oResponse.headers.Remove("Expires");
      oSession.oResponse["Cache-Control"] = "no-cache";
    }

    if ((bpStatus > 0) && (oSession.responseCode == bpStatus)) {
      oSession["x-breakresponse"] = "status";
      oSession.bBufferResponse = true;
    }

    if ((null != bpResponseURI) && oSession.uriContains(bpResponseURI)) {
      oSession["x-breakresponse"] = "uri";
      oSession.bBufferResponse = true;
    }

  }

  static function OnBeforeResponse(oSession: Session) {

    if(settingMatch && settingUnMatch && oSession){
      sessionCallback && sessionCallback(oSession,'OnBeforeResponse');

      // 根据头部字段过滤出需要显示或隐藏的连接 BEGIN
      var headerFilter = GLOBAL_SETTING.Filter.headerFieldFilter;
      if (headerFilter && headerFilter.length > 0) {
        var hfLen = headerFilter.length;
        for (var i = 0; i < hfLen; i++) {
          var settingItem = headerFilter[i];
          if (settingItem.enabled === true && settingItem.workAt === 'response' && settingItem.fieldName) {
            if(settingItem.display === true ){
              // 过滤出要显示的连接，把不在显示列表里的连接隐藏掉
              if(oSession.oRequest[settingItem.fieldName]){
                settingUnMatch(oSession.oResponse[settingItem.fieldName], settingItem.filterList, function () {
                  hideLink(oSession);
                }, "【headerFieldFilter_show】配置出错，请检查你的配置");
              }else {
                /*不存在对于header属值的，不能直接隐藏，只能后续操作，否则会把其关联的链接也一并隐藏，最后就会导致无任何链接可显示*/
                // hideLink(oSession);
                // console.log('以下链接本该隐藏的，但是由于具有关联性，不能将其马上隐藏：',oSession.fullUrl);
                oSession['hide-me'] = 'true';
              }
            }else {
              // 过滤出要隐藏的连接，把在隐藏列表里的连接隐藏掉
              settingMatch(oSession.oResponse[settingItem.fieldName], settingItem.filterList, function (conf, matchStr) {
                hideLink(oSession);
                return true;
              }, "【headerFieldFilter_hide】配置出错，请检查你的配置");
            }
          }
        }
      }
      // 根据头部字段过滤出需要显示或隐藏的连接 END

      // 过滤出需要显示或隐藏的连接 BEGIN

      var contentType = oSession.oResponse["Content-Type"],
        showContentType = GLOBAL_SETTING.Filter.showContentType,
        hideContentType = GLOBAL_SETTING.Filter.hideContentType;

      //开启了 ContentType 过滤的时候， 把不带 Content-Type 全部过滤掉
      if (!contentType && showContentType.length > 0) {
        console.log("隐藏不带 ContentType 的连接");
        hideLink(oSession);
      }

      // 过滤出要显示的连接，把不在显示列表里的连接隐藏掉
      settingUnMatch(contentType, showContentType, function () {
        hideLink(oSession);
      }, "【showContentType】配置出错，请检查你的配置");

      // 过滤出要隐藏的连接，把在隐藏列表里的连接隐藏掉
      settingMatch(contentType, hideContentType, function (conf, matchStr) {
        hideLink(oSession);
        return true;
      }, "【hideContentType】配置出错，请检查你的配置");

      // 过滤出需要显示或隐藏的连接 END

      // 根据contentType显示连接颜色
      var contentTypeColor = GLOBAL_SETTING.UI.contentTypeColor;
      if (oSession.responseCode > 100 && oSession.responseCode < 300) {
        settingMatch(contentType, contentTypeColor, function (conf, matchStr) {
          conf ? oSession["ui-color"] = conf : "";
          return true;
        }, "【contentTypeColor】配置出错，请检查你的配置");
      }

      // 根据不同状态码设置链接颜色
      var statusCode = GLOBAL_SETTING.UI.statusCode;
      settingMatch(oSession.responseCode, statusCode, function (conf, matchStr) {
        oSession["ui-color"] = GLOBAL_SETTING.UI.color;
        conf ? oSession["ui-color"] = conf : "";
        return true;
      }, "【statusCode】配置出错，请检查你的配置");
    }

    if (m_Hide304s && oSession.responseCode == 304) {
      oSession["ui-hide"] = "true";
    }

  }

  //OnBeforeResponse END

  // 请求完成时的回调
  static function OnDone(oSession: Session) {

    if(settingMatch && settingUnMatch && oSession){
      sessionCallback && sessionCallback(oSession,'OnDone');

      // 隐藏被标注要隐藏的链接
      if(oSession['hide-me']){
        hideLink(oSession);
      }

      // 根据关键字进行搜索查找 BEGIN

      // 查找ResponseHeaders
      var searchInResponseHeaders = GLOBAL_SETTING.Search.inResponseHeaders,
        searchStrCount = searchInResponseHeaders.length;
      for (var i = 0; i < searchStrCount; i++) {
        var skw = searchInResponseHeaders[i];
        try {
          var resHeaders = oSession.ResponseHeaders;
          if (resHeaders) {
            for (var key = "" in resHeaders) {

              var result01 = isMatch(resHeaders[key], skw);
              var result02 = isMatch(key, skw);
              if (result01 || result02) {
                console.log(oSession.fullUrl, "进行ResponseHeaders搜索查找时找到匹配的字符串：" + skw, key + ":" + resHeaders[key]);
              }
            }
          }
        } catch (ex) {
          console.log("进行ResponseHeaders遍历搜索时出错,当前搜索关键词为：" + skw);
        }
      }

      // 查找ResponseBody
      var searchInResponseBody = GLOBAL_SETTING.Search.inResponseBody,
        searchStrCount = searchInResponseBody.length;
      if (searchStrCount > 0) {
        var resBody = oSession.GetResponseBodyAsString();
        for (var i = 0; i < searchStrCount; i++) {
          var skw = searchInResponseBody[i];
          try {
            if (isMatch(resBody, skw)) {
              console.log(oSession.fullUrl, "进行ResponseBody搜索查找时找到匹配的字符串：" + skw);
            }
          } catch (ex) {
            console.log("进行ResponseBody遍历搜索时出错,当前搜索关键词为：" + skw);
          }
        }
      }

      // 根据关键字进行搜索查找 END
    }

    // 通过QuickExec 输入字符串来筛选出要高亮的url
    if ((null != filter_and_highlight_url) && isMatch(oSession.GetResponseBodyAsString(), filter_and_highlight_url)) {
      oSession["ui-color"] = "#FF0000";
      oSession["ui-bold"] = "false";
      console.log(oSession.fullUrl, "发现匹配的内容：", filter_and_highlight_url);
    }
  }

  /**
   * 链接返回出错时的回调方法
   */
  static function OnReturningError(oSession: Session) {

    if(settingMatch && settingUnMatch && oSession){
      sessionCallback && sessionCallback(oSession,'OnReturningError');

      hideTunnelToLink(oSession);
    }

    // 出错时的颜色配置
    var onErrorConf = GLOBAL_SETTING.UI.onError;
    !onErrorConf.bgColor ? onErrorConf.bgColor = GLOBAL_SETTING.UI.bgColor : "";
    setSessionDisplay(oSession, onErrorConf);
  }

  /*
   // This function executes just before Fiddler returns an error that it has
   // itself generated (e.g. "DNS Lookup failure") to the client application.
   // These responses will not run through the OnBeforeResponse function above.
   static function OnReturningError(oSession: Session) {
   }
   */
  /*
   // This function executes after Fiddler finishes processing a Session, regardless
   // of whether it succeeded or failed. Note that this typically runs AFTER the last
   // update of the Web Sessions UI listitem, so you must manually refresh the Session's
   // UI if you intend to change it.
   static function OnDone(oSession: Session) {
   }
   */

  /*
   static function OnBoot() {
   MessageBox.Show("Fiddler has finished booting");
   System.Diagnostics.Process.Start("iexplore.exe");

   UI.ActivateRequestInspector("HEADERS");
   UI.ActivateResponseInspector("HEADERS");
   }
   */

  /*
   static function OnBeforeShutdown(): Boolean {
   // Return false to cancel shutdown.
   return ((0 == FiddlerApplication.UI.lvSessions.TotalItemCount()) ||
   (DialogResult.Yes == MessageBox.Show("Allow Fiddler to exit?", "Go Bye-bye?",
   MessageBoxButtons.YesNo, MessageBoxIcon.Question, MessageBoxDefaultButton.Button2)));
   }
   */

  /*
   static function OnShutdown() {
   MessageBox.Show("Fiddler has shutdown");
   }
   */

  /*
   static function OnAttach() {
   MessageBox.Show("Fiddler is now the system proxy");
   }
   */

  /*
   static function OnDetach() {
   MessageBox.Show("Fiddler is no longer the system proxy");
   }
   */

  // The Main() function runs everytime your FiddlerScript compiles
  static function Main() {

    var today: Date = new Date();
    FiddlerObject.StatusText = " CustomRules.js was loaded at: " + today;

    // Uncomment to add a "Server" column containing the response "Server" header, if present
    // UI.lvSessions.AddBoundColumn("Server", 50, "@response.server");

    // Uncomment to add a global hotkey (Win+G) that invokes the ExecAction method below...
    // UI.RegisterCustomHotkey(HotkeyModifiers.Windows, Keys.G, "screenshot");
  }

  // These static variables are used for simple breakpointing & other QuickExec rules
  BindPref("fiddlerscript.ephemeral.bpRequestURI")
  public static var bpRequestURI: String = null;

  BindPref("fiddlerscript.ephemeral.bpResponseURI")
  public static var bpResponseURI: String = null;

  BindPref("fiddlerscript.ephemeral.bpMethod")
  public static var bpMethod: String = null;

  static var bpStatus: int = -1;
  static var uiBoldURI: String = null;
  static var gs_ReplaceToken: String = null;
  static var gs_ReplaceTokenWith: String = null;
  static var gs_OverridenHost: String = null;
  static var gs_OverrideHostWith: String = null;
  static var filter_and_highlight_url: String = null; //根据匹配的字符来高亮筛选出的url

  // The OnExecAction function is called by either the QuickExec box in the Fiddler window,
  // or by the ExecAction.exe command line utility.
  static function OnExecAction(sParams: String[]): Boolean {

    FiddlerObject.StatusText = "ExecAction: " + sParams[0];

    var sAction = sParams[0].toLowerCase();
    switch (sAction) {
      case "bold":
        if (sParams.Length < 2) {
          uiBoldURI = null;
          FiddlerObject.StatusText = "Bolding cleared";
          return false;
        }
        uiBoldURI = sParams[1];
        FiddlerObject.StatusText = "Bolding requests for " + uiBoldURI;
        return true;
      case "bp":
        FiddlerObject.alert("bpu = breakpoint request for uri\nbpm = breakpoint request method\nbps=breakpoint response status\nbpafter = breakpoint response for URI");
        return true;
      case "bps":
        if (sParams.Length < 2) {
          bpStatus = -1;
          FiddlerObject.StatusText = "Response Status breakpoint cleared";
          return false;
        }
        bpStatus = parseInt(sParams[1]);
        FiddlerObject.StatusText = "Response status breakpoint for " + sParams[1];
        return true;
      case "bpv":
      case "bpm":
        if (sParams.Length < 2) {
          bpMethod = null;
          FiddlerObject.StatusText = "Request Method breakpoint cleared";
          return false;
        }
        bpMethod = sParams[1].toUpperCase();
        FiddlerObject.StatusText = "Request Method breakpoint for " + bpMethod;
        return true;
      case "bpu":
        if (sParams.Length < 2) {
          bpRequestURI = null;
          FiddlerObject.StatusText = "RequestURI breakpoint cleared";
          return false;
        }
        bpRequestURI = sParams[1];
        FiddlerObject.StatusText = "RequestURI breakpoint for " + sParams[1];
        return true;
      case "bpa":
      case "bpafter":
        if (sParams.Length < 2) {
          bpResponseURI = null;
          FiddlerObject.StatusText = "ResponseURI breakpoint cleared";
          return false;
        }
        bpResponseURI = sParams[1];
        FiddlerObject.StatusText = "ResponseURI breakpoint for " + sParams[1];
        return true;
      case "overridehost":
        if (sParams.Length < 3) {
          gs_OverridenHost = null;
          FiddlerObject.StatusText = "Host Override cleared";
          return false;
        }
        gs_OverridenHost = sParams[1].toLowerCase();
        gs_OverrideHostWith = sParams[2];
        FiddlerObject.StatusText = "Connecting to [" + gs_OverrideHostWith + "] for requests to [" + gs_OverridenHost + "]";
        return true;
      case "urlreplace":
        if (sParams.Length < 3) {
          gs_ReplaceToken = null;
          FiddlerObject.StatusText = "URL Replacement cleared";
          return false;
        }
        gs_ReplaceToken = sParams[1];
        gs_ReplaceTokenWith = sParams[2].Replace(" ", "%20");  // Simple helper
        FiddlerObject.StatusText = "Replacing [" + gs_ReplaceToken + "] in URIs with [" + gs_ReplaceTokenWith + "]";
        return true;
      case "allbut":
      case "keeponly":
        if (sParams.Length < 2) {
          FiddlerObject.StatusText = "Please specify Content-Type to retain during wipe.";
          return false;
        }
        UI.actSelectSessionsWithResponseHeaderValue("Content-Type", sParams[1]);
        UI.actRemoveUnselectedSessions();
        UI.lvSessions.SelectedItems.Clear();
        FiddlerObject.StatusText = "Removed all but Content-Type: " + sParams[1];
        return true;
      case "stop":
        UI.actDetachProxy();
        return true;
      case "start":
        UI.actAttachProxy();
        return true;
      case "cls":
      case "clear":
        UI.actRemoveAllSessions();
        return true;
      case "g":
      case "go":
        UI.actResumeAllSessions();
        return true;
      case "goto":
        if (sParams.Length != 2) return false;
        Utilities.LaunchHyperlink("http://www.google.com/search?hl=en&btnI=I%27m+Feeling+Lucky&q=" + Utilities.UrlEncode(sParams[1]));
        return true;
      case "help":
        Utilities.LaunchHyperlink("http://fiddler2.com/r/?quickexec");
        return true;
      case "hide":
        UI.actMinimizeToTray();
        return true;
      case "log":
        FiddlerApplication.Log.LogString((sParams.Length < 2) ? "User couldn't think of anything to say..." : sParams[1]);
        return true;
      case "nuke":
        UI.actClearWinINETCache();
        UI.actClearWinINETCookies();
        return true;
      case "screenshot":
        UI.actCaptureScreenshot(false);
        return true;
      case "show":
        UI.actRestoreWindow();
        return true;
      case "tail":
        if (sParams.Length < 2) {
          FiddlerObject.StatusText = "Please specify # of sessions to trim the session list to.";
          return false;
        }
        UI.TrimSessionList(int.Parse(sParams[1]));
        return true;
      case "quit":
        UI.actExit();
        return true;
      case "dump":
        UI.actSelectAll();
        UI.actSaveSessionsToZip(CONFIG.GetPath("Captures") + "dump.saz");
        UI.actRemoveAllSessions();
        FiddlerObject.StatusText = "Dumped all sessions to " + CONFIG.GetPath("Captures") + "dump.saz";
        return true;

      default:
        if (sAction.StartsWith("http") || sAction.StartsWith("www.")) {
          System.Diagnostics.Process.Start(sParams[0]);
          return true;
        } else if (sParams[0] === "*") {
          filter_and_highlight_url = null;
          FiddlerObject.StatusText = "取消URL高亮";
        } else {
          filter_and_highlight_url = sParams[0];
          FiddlerObject.StatusText = "将为你高亮包含【" + filter_and_highlight_url + "】的url";
          // FiddlerObject.StatusText = "Requested ExecAction: '" + sAction + "' not found. Type HELP to learn more.";
          return true;
        }
    }
  }
}





