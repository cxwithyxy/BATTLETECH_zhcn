import {app} from "electron"
import fs from "fs/promises"
import CsvFS from "./CsvFS"
import Translater from "./Translater-google"

app.on("ready", async () => {
    let ttzh = new Translater()
    await ttzh.init("de")
    console.log(`ttzh.init`);
    
    let dictObj = JSON.parse(await fs.readFile(`pre-data/battletech-zh_Hans/battletech/main/BATTLETECH/translation-zh_Hans.json`,{encoding: "utf-8"}))

    let translatedObj:any = {}
    try
    {
        translatedObj = JSON.parse(await fs.readFile(`translatedObj.json`,{encoding: "utf-8"}))
    }catch(e){}
    // console.log(dictObj);
    
    let oldVersionCsv = await new CsvFS().load("pre-data/localization/strings_zh-CN.csv")
    let oldVersionCsvMap = new Map()
    // oldVersionCsv.eachData(async (itemValue, itemKey, index, dataList) =>
    // {
    //     oldVersionCsvMap.set(itemKey, itemValue)
    // })

    let deVersionCsv = await new CsvFS().load("pre-data/localization/strings_de-DE.csv")
    let deVersionCsvMap = new Map()
    deVersionCsv.eachData(async (itemValue, itemKey, index, dataList) =>
    {
        deVersionCsvMap.set(itemKey, itemValue)
    })

    let cannotHandleList:string[] = []
    let devCsv = await new CsvFS().load("pre-data/localization/strings_dev-WWW.csv")
    await devCsv.eachData(async (itemValue, itemKey, index, dataList) =>
    {
        // if(!dictObj[itemKey] && !oldVersionCsvMap.get(itemKey))
        // {
        //     console.log(itemKey, index)
        // }
        let finishWord = dictObj[itemKey] || oldVersionCsvMap.get(itemKey) || translatedObj[itemKey]
        if(!finishWord || finishWord == " ...")
        {
            let waitForTranslate = deVersionCsvMap.get(itemKey)
            if(waitForTranslate && index > 2)
            {
                
                finishWord = await ttzh.translateToZhcn(waitForTranslate)
                console.log("Translate", itemKey, finishWord);
                cannotHandleList.push(itemKey + "," + finishWord)
                translatedObj[itemKey] = finishWord
                await fs.writeFile(`translatedObj.json`, JSON.stringify(translatedObj), {encoding: "utf-8"})
            }
        }
        dataList[index] = itemKey + "," + (finishWord || itemKey)
        // console.log(dataList[index]);
    })
    await devCsv.save("strings_zh-CN.csv")
    await fs.writeFile("cannotHandleMap.txt", cannotHandleList.join("\r\n"), {encoding: "utf-8"})
    console.log("finish");
    
})
