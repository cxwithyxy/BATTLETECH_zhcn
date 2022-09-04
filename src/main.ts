import {app} from "electron"
import fs from "fs/promises"
import _ from "lodash"
import CsvFS from "./CsvFS"
import Translater from "./Translater-google"

app.on("ready", async () => {
    
    let ttzh = new Translater("de")
    
    let dictObj = JSON.parse(await fs.readFile(`pre-data/battletech-zh_Hans/battletech/main/BATTLETECH/translation-zh_Hans.json`,{encoding: "utf-8"}))

    let translatedObj:any = {}
    try
    {
        translatedObj = JSON.parse(await fs.readFile(`translatedObj.json`,{encoding: "utf-8"}))
    }catch(e){}
    // console.log(dictObj);
    
    let oldVersionCsv = await new CsvFS().load("pre-data/localization/strings_zh-CN.csv")
    let oldVersionCsvMap = new Map()
    oldVersionCsv.eachData(async (itemValue, itemKey, index, dataList) =>
    {
        oldVersionCsvMap.set(itemKey, itemValue)
    })

    let deVersionCsv = await new CsvFS().load("pre-data/localization/strings_de-DE.csv")
    let deVersionCsvMap = new Map()
    deVersionCsv.eachData(async (itemValue, itemKey, index, dataList) =>
    {
        deVersionCsvMap.set(itemKey, itemValue)
    })

    let cannotHandleList:string[] = []
    let devCsv = await new CsvFS().load("pre-data/localization/strings_dev-WWW.csv")
    console.log("行数", devCsv.dataList.length)
    await devCsv.eachData(async (itemValue, itemKey, index, dataList) =>
    {
        let finishWord:string = dictObj[itemKey] || oldVersionCsvMap.get(itemKey) || translatedObj[itemKey]
        if((!finishWord || finishWord == " ..."))
        {
            let waitForTranslate = deVersionCsvMap.get(itemKey)
            
            if(_.trim(waitForTranslate) && index > 2)
            {
                console.log("---Translate s---", itemKey, waitForTranslate);
                finishWord = await ttzh.translateToZhcn(waitForTranslate)
                console.log("---Translate e---", finishWord);
                cannotHandleList.push(itemKey + "," + finishWord)
                translatedObj[itemKey] = finishWord
                await fs.writeFile(`translatedObj.json`, JSON.stringify(translatedObj), {encoding: "utf-8"})
            }
        }
        finishWord = _.replace(finishWord, /\n/g, "\\n")
        dataList[index] = itemKey + "," + (finishWord || itemKey)
    })
    console.log("行数", devCsv.dataList.length)
    await devCsv.save("strings_de-DE.csv", "KEY,de-DE")
    await fs.writeFile("cannotHandleMap.txt", cannotHandleList.join("\r\n"), {encoding: "utf-8"})
    console.log("finish");
    
})
