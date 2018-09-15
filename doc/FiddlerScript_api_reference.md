# FiddlerScript api 参考文档

主要是修改CustomRules时个人摘抄自 Fiddler scriptEditor 里面的API说明  
有些翻译不一定准确，请自行辨别


## Seesion对象
* m_clientIP:System.String  当前连接使用客户机的IP
* m_clientPort:System.Int32  当前连接使用客户机的端口
* oFlags:System.Collections.Specialized.StringDictionary
* oRequest:Fiddler.ClientChatter HTTP的Request对象
* oResponse:Fiddler.ServerChatter HTTP的Response对象
* requestBodyBytes:System.Byte[] request body 包含的字节内容
* responseBodyBytes:System.Byte[] response body 包含的字节内容
* ViewItem:System.Windows.Forms.ListViewItem ListViewItem object associated with this session in the Session list
* bHasResponse:System.Boolean 如果存在response时则返回true
* bHasWebSocketMessages:System.Boolean
* BitFlags:Fiddler.SessionFlags
* bypassGateway:System.Boolean 如果在OnBeforeRequest中将该参数设置为true，则请求将绕过网关
* clientIP:System.String 返回客户端通过Fidder的地址
* clientPort:System.Int32 返回客户端通过Fidder的端口
* fullUrl:System.String 返回完整的URL地址
* host:System.String 设置或返回请求的host，包括端口
* hostname:System.String 设置或返回请求的host名称，不包括端口
* id:System.Int32 返回请求的序号
* isFTP:System.Boolean 返回使用的是否为ftp协议
* isHTTPS:System.Boolean 返回使用的是否为https协议
* isTunnel:System.Boolean 返回使用的是否为tunnel隧道协议
* Item:System.String Indexer property into session flags, collection oSession["Flagname"] return string value (or null if missing)
* Item:System.String Indexer property into SESSION flags,REQUEST headers.and RESPONSE headers e.g. oSession["Requst","Host"]
* LocalProcess:System.String
* LocalProcessID:System.Int32
* PathAndQuery:System.String 返回url的路径以及查询部分字符串
* port:System.Int32 返回请求的主机端口
* RequestBody:System.Byte[] 以字节的形式设置或获取请求的内容
* RequestHeaders:Fiddler.HTTPRequestHeaders 获取请求的头部信息，如果不存在则返回空
* RequestMethod:System.String 设置或返回请求的方法，例如：get、post等
* ResponseBody:System.Byte[] 以字节的形式设置或获取response的内容
* responseCode:System.Int32 设置或获取response的状态码
* ResponseHeaders:Fiddler.HTTPResponseHeaders 获取回应的头部信息，如果不存在则返回空 eg:oSession.ResponseHeaders.Item("Content-Type")
* state:Fiddler.SessionStates 枚举当前session的状态
* SuggestedFilename:System.String 建议使用的进行文件保存时的名称
* TunnelEgressByteCount:System.Int64
* TunnelIngressByteCount:System.Int64
* TunnelIsOpen:System.Boolean
* url:System.String 在请求之前获取或设置URL(不包括端口)
* actInspectInNewWindow(sActiveTab ) 对当前session新开一个审计窗口，指定tab的title
* GetRequestBodyAsString() 获取request body 的字符串
* GetRequestBodyEncoding() 获取request body 编码形式
* GetResponseBodyAsString() 获取response body 的字符串
* GetResponseBodyEncoding() 获取response body 编码形式
* GetResponseBodyHash(sHashAlg ) 获取ResponseBody内容的一个md5/sha1/sha256/sha384/sha512的hash值
* GetResponseBodyHashAsBase64(sHashAlgorithm )
* HostnameIs(sTestHost ) 判断是否存在某个host，不包含端口
* HTTPMethodIs(sTestFor ) 判断HTTP请求使用的方法
* Ignore() 忽略session
* LoadRequestBodyFromFile(sFilename) 使用指定的文件替换掉当前session请求的headers和body内容
* LoadResponseFromFile(sFilename) 使用指定的文件替换掉当前session返回的headers和body内容
* RefreshUI() 更新当前session的显示界面
* SaveRequestBody(sFilename ) 保存request body到本地
* SaveResponseBody() 保存HTTP response body 到Fiddler 的捉包文件夹
* SaveResponseBody(sFilename ) 保存HTTP response body 到本地
* uriContains(sLookfor ) 当uri包含指定字符串时返回true
* utilAssignResponse(oFromSession ) 绕开未就绪的连接请求，复制一个已存在的session response 到当前session
* utilAssignResponse(oRH arrBody )
* utilBZIP2Response() 使用BZIP2 对 response body进行压缩. 抛出异常到caller
* utilChunkResponse(iSuggestedChunkCount )
* utilCreateResponseAndBypassServer() call inside OnBeforeRequest to create a Response object an bypass the server
* utilDecodeRequest() 移除当前请求的chunking 和 HTTP Compression ,添加或更新hader的Content-Length字段
* utilDecodeResponse()
* utilDeflateResponse() 使用DEFLATE 压缩response. 抛出异常到caller
* utilFindInRequest(sSearchFor bCaseSensitive ) 在request body进行字符串搜索，返回当前索引或-1
* utilFindInResponse(sSearchFor bCaseSensitive )
* utilGZIPRequest() 使用GZIP压缩请求内容。抛出异常到caller
* utilGZIPResponse() 使用GZIP压缩response。抛出异常到caller
* utilPrependToResponseBody(sString ) 将字符串插入到response body 前，更新header的Content-Length字段.注意：utilDecodeResponse
* utilReplaceInRequest(sSearchFor sReplaceWith ) 替换请求的内容【区分大小写】（不是url内容），并自动更新header的Content-Length字段，如果替换成功则返回true
* utilReplaceInResponse(sSearchFor sReplaceWith ) 替换返回的内容【区分大小写】，并自动更新header的Content-Length字段，如果替换成功则返回true，注意：使用该方法前应先调用utilDecodeResponse
* utilReplaceOnceInResponse(sSearchFor sReplaceWith bCaseSensitive )
* utilReplaceRegexInResponse(sSearchForRegEx sReplaceWithExpression )
* utilSetRequestBody(sString ) 用字符串替换掉原来的请求内容，并自动更新header的Content-Length字段，移除Transfer-Encoding/Content-Encoding
* utilSetResponseBody(sString ) 用字符串替换掉原来的返回内容，并自动更新header的Content-Length字段，移除Transfer-Encoding/Content-Encoding
* WriteToStream(oFS bHeadersOnly ) 将session或session的header写入指定流里
* FiddlerObject.log( "当前测试字段："+oSession.GetResponseBodyEncoding() );



