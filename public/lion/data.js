export const sources={
 south:{name:'中国非遗网 · 广东醒狮',url:'https://www.ihchina.cn/project_details/12870'},
 north:{name:'中国非遗网 · 徐水舞狮',url:'https://www.ihchina.cn/project_details/12866.html'},
 green:{name:'中国非遗网 · 青狮',url:'https://www.ihchina.cn/project_details/12882.html'},
 teng:{name:'中国非遗网 · 藤县狮舞',url:'https://www.ihchina.cn/project_details/12883.html'},
 style:{name:'香港非遗资料库 · 舞狮',url:'https://www.hkichdb.gov.hk/zht/item.html?6fd6198d-db4e-467c-aa9a-fb882d641985='},
 craft:{name:'香港非遗资料库 · 狮头扎作技艺',url:'https://www.hkichdb.gov.hk/zhs/item.html?3b1ef5b5-f9d7-4298-a8e1-e0a1f1d65dbe='},
 mask:{name:'新华社 · 扎狮头 传技艺',url:'https://www.xinhuanet.com/politics/2017-02/10/c_1120444738.htm'},
 caiqing:{name:'中国社会科学网 · 广东醒狮彰显岭南精神',url:'https://www.cssn.cn/ztzl/jzz/rwln/xwpl/sdbd/202209/t20220923_5540905.shtml'}
};
export const regions=[
 {id:'foshan',name:'佛山醒狮',place:'广东 · 佛山',en:'FOSHAN',kind:'南狮',color:'#b94131',accent:'#eac878',style:'south',summary:'雄健的神态，藏在眉眼与阔嘴之间。',features:['面型与嘴部较阔','造型富于装饰性','舞动注重稳重与气势'],body:'佛山装是南狮的一种造型样式。认识狮头时，宜综合看面型、嘴部及整体结构；配色本身不能确定它的产地或传承支系。',source:'style'},
 {id:'heshan',name:'鹤山狮',place:'广东 · 鹤山',en:'HESHAN',kind:'南狮',color:'#ead6a0',accent:'#328571',style:'duck',summary:'轻盈的步法，让狮子多了几分灵动。',features:['嘴形较似鸭嘴','步法表现轻盈','与佛山装及佛鹤装可作对照'],body:'鹤山装的嘴形是辨认时值得观察的线索。现代狮头也可能混合不同造型特点，照片不足时应保留判断。',source:'style'},
 {id:'xushui',name:'徐水舞狮',place:'河北 · 徐水',en:'XUSHUI',kind:'北狮',color:'#cd8a3f',accent:'#eee1b7',style:'north',summary:'圆大的狮头，披着蓬松的毛饰。',features:['头部圆大、形象夸张','毛饰突出动物形态','引狮郎与狮子配合表演'],body:'徐水舞狮以太狮、少狮及引狮郎配合演出。既模仿狮子的行走、跳跃、抖毛等姿态，也包含技巧表演。北狮不能简单理解成只会嬉戏。',source:'north'},
 {id:'jieyang',name:'揭阳青狮',place:'广东 · 揭阳',en:'JIEYANG',kind:'地方狮舞',color:'#2d7262',accent:'#edddae',style:'green',summary:'青狮白目眉，潮汕的一抹鲜明神采。',features:['额部突出、鼻孔较大','白目眉与长须','有地方性的表演套路'],body:'揭阳青狮又称开口狮，具有潮汕地方特色。它既有多种传统表演套路，也有高青、地青等采青形式。',source:'green'},
 {id:'tengxian',name:'藤县狮舞',place:'广西 · 藤县',en:'TENGXIAN',kind:'南狮表演传统',color:'#dda94b',accent:'#b94437',style:'south',summary:'地面的情节，高桩上的身法。',features:['采青狮侧重地面技艺','高桩狮侧重桩上技艺','地域身份不能只靠狮头颜色判断'],body:'藤县狮舞包含采青狮与高桩狮。它体现的是当地表演传统，示意配色不构成产地识别标准。',source:'teng'}
];
export const craftSteps=[
 {id:'frame',word:'扎',name:'竹篾立骨',material:'竹篾 · 绑扎',detail:'先以竹篾构建轮廓和支撑，形成额、眼、鼻、嘴的立体结构。骨架决定狮头的基本比例。',tip:'沿着骨架的线条，观察狮头的立体轮廓。'},
 {id:'paper',word:'扑',name:'纱纸成形',material:'纱纸 · 裱糊',detail:'在骨架外覆上纸或纱等材料，逐渐形成连续的外表面。不同作坊的材料与工序会有差别。',tip:'拖动进度，让竹骨慢慢披上纸衣。'},
 {id:'paint',word:'写',name:'落笔传神',material:'颜料 · 纹饰',detail:'在成形的表面绘饰，组织眉眼、鼻纹与面部装饰。部分传统狮头借鉴戏曲人物脸谱。',tip:'选择配色，创作你的数字狮头。'},
 {id:'finish',word:'装',name:'装饰成狮',material:'毛饰 · 镜饰 · 活动部件',detail:'装配须眉、毛饰和相关部件，使狮头具有完整外观。图中的分层是教学示意，不代表所有作坊的统一步骤。',tip:'完成四道工序，保存你的狮头图。'}
];
export const ritualSteps=[
 {id:'seek',name:'寻青',motion:'walk',text:'狮子进入场景，寻找“青”的位置。',hint:'随着节拍，缓缓向前。'},
 {id:'see',name:'见青',motion:'look',text:'发现目标，以抬头、凝视表现好奇。',hint:'让狮子抬头，看见前方的青。'},
 {id:'probe',name:'探青',motion:'shake',text:'试探周围环境，展现疑、惊、喜等神态。',hint:'轻摇狮头，观察再靠近。'},
 {id:'take',name:'采青',motion:'jump',text:'接近并采下“青”，形成表演的高潮。',hint:'按下采青，让狮子跃起。'},
 {id:'eat',name:'食青',motion:'mouth',text:'以口部动作表现食青，延续表演情节。',hint:'开合狮口，演出食青的神态。'},
 {id:'offer',name:'吐青',motion:'bow',text:'吐青并向观众致意，传递祈福意愿。',hint:'低头行礼，完成这一段体验。'}
];
// Original learning rhythms: not attributed to a traditional troupe or lineage.
export const rhythms=[
 {id:'explore',name:'探寻',label:'舒缓 · 80 BPM',bpm:80,mood:'留出停顿，听清每次落点。',beats:['D','','','C','','','D','','G','','','C','','','',''],motion:'look'},
 {id:'walk',name:'行进',label:'稳健 · 104 BPM',bpm:104,mood:'均匀的重拍，感受稳定前行。',beats:['D','','C','','D','','C','','D','','C','','G','','C',''],motion:'walk'},
 {id:'celebrate',name:'欢腾',label:'明快 · 128 BPM',bpm:128,mood:'密集的击打，感受节奏张力。',beats:['D','D','C','','D','C','D','','G','','C','D','D','C','D','C'],motion:'jump'}
];
export const timeline=[
 {era:'唐宋',title:'文献中的狮舞',text:'唐宋诗文留下狮舞的描写。历史介绍依据现有文献，起源传说与可考记录应分别理解。',source:'south'},
 {era:'地方传承',title:'一方水土，一方狮艺',text:'不同地区逐渐发展出各具特色的造型与表演。南狮、北狮是常见分类，地方传统仍有丰富差异。',source:'south'},
 {era:'节庆生活',title:'从街巷到庆典',text:'舞狮常见于年节与喜庆活动，寄托求吉纳福的愿望，也凝聚社区之间的联系。',source:'south'},
 {era:'2006',title:'列入国家级非遗名录',text:'广东醒狮、徐水舞狮等狮舞项目列入第一批国家级非物质文化遗产名录。',source:'south'},
 {era:'今天',title:'在变化中延续',text:'工艺、表演与数字展示可以相遇。本站以可追溯资料和交互体验，帮助更多人走近狮艺。',source:null}
];
export const knowledge=[
 {id:'south',title:'醒狮与南北狮',tags:'历史 南狮 北狮 差异 区别 醒狮 武术',text:'广东醒狮属于南狮，融合武术、舞蹈和音乐。舞狮具有南北及地方差异，不能将所有表演简化为同一种样式。',source:'south'},
 {id:'north',title:'徐水北狮',tags:'北狮 徐水 河北 毛发 圆头 绣球',text:'徐水舞狮头部圆大、外形夸张，有太狮、少狮与引狮郎配合，既有动物神态模仿，也有高难技巧。',source:'north'},
 {id:'styles',title:'佛山装、鹤山装与混合样式',tags:'识别 图片 狮头 流派 佛山 鹤山 佛鹤 嘴 鸭嘴',text:'佛山装面型和嘴部较阔，舞动讲求稳重；鹤山装嘴部较似鸭嘴，舞动着重轻盈。另有佛鹤装。照片可支持形态比较，不能证明师承、制作者或产地。',source:'style'},
 {id:'craft',title:'狮头扎作',tags:'制作 工艺 材料 竹 扎 扑 写 装 纸 骨架',text:'传统狮头常用竹篾与纱纸制作，常见工序为扎作、扑纸、写色和装饰。仅凭外观不能确认具体狮头内部材料。',source:'craft'},
 {id:'mask',title:'脸谱与创作原型',tags:'脸谱 寓意 颜色 红 黄 黑 关公 刘备 张飞 三国',text:'新华社对佛山黎家狮的报道记载，其狮头以包括刘备、关公、张飞在内的戏曲人物脸谱为创作原型。此描述有具体传承背景，不能推广为所有颜色与人物的一一对应规则。',source:'mask'},
 {id:'green',title:'揭阳青狮',tags:'青狮 揭阳 潮汕 绿色 白目眉 开口狮',text:'揭阳青狮又称开口狮，具有地方特色，前额突出、鼻孔较大，有长须与白目眉特征，表演也包括高青和地青。绿色本身不足以确定为揭阳青狮。',source:'green'},
 {id:'teng',title:'藤县狮舞',tags:'广西 藤县 高桩 采青 狮舞',text:'藤县狮舞有侧重地面技艺的采青狮和侧重桩上技艺的高桩狮。照片中的狮头造型不能独立证明表演来自藤县。',source:'teng'},
 {id:'caiqing',title:'采青的情节',tags:'采青 是什么 寻青 见青 探青 食青 吐青 生菜 流程 寓意',text:'广东醒狮采青可通过寻青、见青、探青、采青、食青、吐青表达不同神态，寄托吉庆愿望。实际套路随地区、阵式和表演变化，本站六段是教学示范。',source:'caiqing'},
 {id:'music',title:'锣鼓与动作',tags:'鼓点 节奏 鼓 锣 钹 音乐 区别 节拍 播放',text:'醒狮由锣鼓音乐伴随表演。本站探寻、行进、欢腾为原创合成教学节奏，用于比较速度、疏密、重拍与停顿；不是传统狮队实录，不能据此判断真实鼓点流派。',source:'south'}
];
