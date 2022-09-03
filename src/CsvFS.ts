import fs from "fs/promises"
import _ from "lodash"


class CsvFS
{
    dataList!: string[]

    async load(path: string)
    {
        let dataText = await fs.readFile(path,{encoding: "utf-8"})
        this.dataList = dataText.split("\r\n")
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
        // console.log(this.dataList);
        this.dataList[0] = _.replace(this.dataList[0], "KEY,KEY",lzname)
        this.dataList[this.dataList.length-1] = ""
        await fs.writeFile(path, this.dataList.join("\r\n"), {encoding: "utf-8"})
        return this
    }
}

export default CsvFS