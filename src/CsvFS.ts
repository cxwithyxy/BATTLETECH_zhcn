import fs from "fs/promises"
import _ from "lodash"


class CsvFS
{
    topDataList: string[] = []
    dataList!: string[]

    async load(path: string)
    {
        let dataText = _.trim(await fs.readFile(path,{encoding: "utf-8"}))
        this.dataList = dataText.split("\n")
        this.topDataList.push(<string>this.dataList.shift())
        this.topDataList.push(<string>this.dataList.shift())
        this.topDataList.push(<string>this.dataList.shift())
        return this
    }

    async eachData(handler: (itemValue: string, itemKey: string, index: number, dataList: string[]) => Promise<void>)
    {
        for(let i = 0; i < this.dataList.length; i++)
        {
            let item = this.dataList[i]
            let textList = item.split(",")
            let itemKey = textList.shift() || ""
            let itemValue = textList.join(",") || ""
            await handler(itemValue, itemKey, i, this.dataList)
        }
    }

    async save(path: string, lzname: string = "KEY,zh-CN")
    {
        let writeDataList = _.concat(this.topDataList, this.dataList)
        writeDataList[0] = lzname
        await fs.writeFile(path, writeDataList.join("\n") + "\n", {encoding: "utf-8"})
        return this
    }
}

export default CsvFS