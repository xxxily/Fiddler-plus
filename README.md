# Fiddler plus 【高效调试分析利器】

Fiddler是一个功能强大的HTTP抓包调试工具！但用起来却不是那么的顺手，界面繁杂、配置复杂，非常不符合高效程序猿的使用习惯...   
Fiddler plus 重新定义了Fiddler的CustomRules.js，从而使Fiddler拥有了更加简单、灵活、丰富的配置方式，高逼格的显示界面，让你用起来不再羞(gan)涩(ga)。

## 开发进度说明：
  ~~最后面提到的开发计划，现已基本开发完，但最近在写说明文档，所以还需过一段时间才会发布新版本~~ 
  <br>
  ~~ps:文档比代码难写多了！有木有。。。~~ 


## 特点
* 自定义皮肤，通过简单配置即可拥有跟你喜爱的编辑器一样的界面风格
* 高亮特殊链接，一眼便可定位后台接口、快速区分前端各类静态资源
* 快速切换运行环境，无需重启、即刻生效，环境再多也不凌乱
* 简单配置即可彻底解决跨域开发的窘境
* 强大的过滤功能，轻松过滤无关链接


## 优点&目标
	功能强大、配置简单
	
## 界面截图
![运行截图](https://raw.githubusercontent.com/xxxily/Fiddler-plus/master/assets/screenshot/screenshot01.png "运行截图")     

![运行截图](https://raw.githubusercontent.com/xxxily/Fiddler-plus/master/assets/screenshot/screenshot02.png "运行截图")

## 使用方式

下载当前的 CustomRules.js ，替换掉Fiddler自带的 CustomRules.js 。  
正常情况下文件的所在目录为：  

	%USERPROFILE%\Documents\Fiddler2\Scripts

你也可以通过Fiddle菜单栏下的 Rules》Customize Rules...   即可打开编辑CustomRules

## 全局配置项一览
```javascript
/**
 * 全局配置项
 * 可配置链接类型的颜色，代理、替换地址等，
 * 默认对象的键【key】为要匹配的规则，值【key】为匹配后的配置
 */
var GLOBAL_SETTING:Object = {
    // 开启或禁止缓存
    disableCaching:true,
    // 过滤配置【用于过滤出哪些URL需要显示，哪些需要隐藏】
    Filter:{
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
        hideLinks:[
            // "baidu.com|qzone.qq.com|qq.com",
            "hm.baidu.com",
            "google.com|googleapis.com"
        ],
        // 只显示以下文件类型【注意：是根据header的 Content-Type字段进行匹配的，所以js文件直接写js是不行的,但支持模糊匹配 】
        // 附注：使用ContentType过滤的时候不一定准确，不带 ContentType的连接会被自动隐藏，该过滤选项的逻辑还有待优化和完善
        showContentType:[
            // "image"
            // "css",
            // "html",
            // "javascript"
        ],
        // 隐藏以下文件类型
        hideContentType:[]
    },
    // 替换URL【可用于多环境切换、解决跨域、快速调试线上脚本等】
    replace:{
        "http://xxxily.com/":"http://xxxily.cc/",
        /*替换成本地某个对应目录下的文件*/
        "http://xxxily.com/m":"D:\\work\\"
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
                console.log('没找到对应的 Cookie');
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
    UI:{
        // 默认文本颜色
        color:"#c0c0c0",//灰白色
        // 默认背景颜色
        bgColor:"#2c2c2c",//浅黑
        bgColor_02:"#2f2f2f",//浅黑【用于做交替背景，可以不设置】
        // bgColor_02:"#4b4a4a",
        // 链接返回报错时的颜色
        onError:{
            // bgColor:"#2c2c2c",
            color:"#FF0000" //错误红
            // ,bold:"true"
        },
        // 不同关键词匹配对应的连接颜色，key 对应的是匹配的关键字，val对应的是匹配的颜色
        linkColor:{
            "\\.jpg|\\.png|\\.gif":"#ffccff", //粉紫色
            "\\.js":"#00ff00", //原谅色
            "\\.css":"#ffcc66", //米黄
            "\\.html":"#00d7ff", //蓝色
            "\\.php":"#fff32d", //大黄
            "\\.jsp":"#fd4107" //砖红
        },
        // 可以为特殊状态码设置不同颜色，方便快速定位一些错误链接，例如404等
        // 注意：这个只是根据responseCode 来匹配的，一些不存在response的链接配置是无效的，例如 502,504状态，应该是在onError里配置的
        statusCode:{
            "404|408|500|502|504":"#FF0000", //错误红
            "304":"#5e5e5e" //浅灰色
        },
        // 高亮，对特殊的链接进行高亮设置，方便跟踪查看链接
        highlight:{
            "http://localhost|192.168":{
                // bgColor:"#2c2c2c", //浅黑
                color:"#00ff00", //原谅色
                bold:"true",
                describe:"高亮测试"
            },
            "hm.baidu.com":{
                bgColor:"#FF0000", //红色
                color:"#fdf404", //黄色
                bold:"true",
                describe:"高亮测试"
            },
            "":""
        }
    },
    // 一些实用工具集，先列个可能会开发的工具集，留个坑以后有时间再开发
    Tools:{
        // TODO API 测试工具
        apiTest:{},
        // TODO 重放攻击工具
        replay:{},
        // TODO 内容注入工具
        contentInject:{},
        // TODO 类似 weinre 这样的注入调试工具
        weinre:{}
    },
    // 多项分隔符号【同一个配置需匹配多项规则时可以通过分隔符进行区分，这样就不用每个规则都要新开一份配置那么繁琐】
    splitStr:"|",
    // 正则匹配的修饰符：i,g,m 默认i，不区分大小写
    regAttr:"i"
};
//全局配置项 END
```
特别说明：Fiddler 的 CustomRules.js 修改配置保存后是会自动立即生效的，无需重启    
所以做服务器代理转发、切换开发环境的时候，写好配置后，只需打开或注释掉某行配置，然后保存即可实现实时切换
  
	
	目前主要实现了：代理、替换、过滤、UI(skin)等功能；已经可满足绝大部分开发需求了，后续将继续完善
	
	暂时先这样，后续等代码完善好了再补充说明文档...

## 开发计划：
	1、完善替换功能，实现替换本地文件
	2、完善搜索查找功能
	2、实现搜索替换和注入等功能
  ~~1、UI(skin)后续打算实现成多套可选的形式，然后可以针对域名指定不同的配色方案，这样就不用隐藏连接也可以快速区分哪些是当前需要关注的连接。~~
  <br>
  ~~2、全局禁止缓存感觉很蠢，严重影响正常上网体验，所以缓存也计划加入到 replacePlus 配置项里，针对性禁止缓存~~

	
