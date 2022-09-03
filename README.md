# BattleTech 翻译

#### 开发

基于 pre-data/localization/strings_dev-WWW.csv

读取 pre-data/localization/strings_zh-CN.csv 和 
读取 pre-data/battletech-zh_Hans/battletech/main/BATTLETECH/translation-zh_Hans.json 
两个基础文件进行翻译

遇到基础文件没有的词汇
调用 Translater 类进行翻译, 翻译是基于 pre-data/localization/strings_de-DE.csv 进行的, 其中翻译后的内容会保存成 translatedObj.json 进行缓存, 可以可以编辑这个缓存修改翻译内容

最后处理后的文件会生成在主目录下
strings_zh-CN.csv
