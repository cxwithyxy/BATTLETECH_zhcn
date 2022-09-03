import fs from "fs/promises"
import CsvFS from "./CsvFS"

(async () => {
    let dictObj = JSON.parse(await fs.readFile(`pre-data/battletech-zh_Hans/battletech/main/BATTLETECH/translation-zh_Hans.json`,{encoding: "utf-8"}))
    // console.log(dictObj);
    
    let oldVersionCsv = await new CsvFS().load("pre-data/localization/strings_zh-CN.csv")
    let oldVersionCsvMap = new Map()
    oldVersionCsv.eachData(async (itemValue, itemKey, index, dataList) =>
    {
        oldVersionCsvMap.set(itemKey, itemValue)
    })

    let devCsv = await new CsvFS().load("pre-data/localization/strings_dev-WWW.csv")
    await devCsv.eachData(async (itemValue, itemKey, index, dataList) =>
    {
        // if(!dictObj[itemKey] && !oldVersionCsvMap.get(itemKey))
        // {
        //     console.log(itemKey, index)
        // }
        let finishWord = dictObj[itemKey] || oldVersionCsvMap.get(itemKey) || itemKey
        
        dataList[index] = itemKey + "," + finishWord
        // console.log(dataList[index]);
    })
    await devCsv.save("strings_zh-CN.csv")
})()
