import fetch from "node-fetch"
import chrome from "selenium-webdriver/chrome"
import {Builder, By, ThenableWebDriver, WebElement} from 'selenium-webdriver'
import sleep from "sleep-promise"

class Translater
{
    driver!: ThenableWebDriver

    async init(fromLagulig: string)
    {
        let service = new chrome.ServiceBuilder('node_modules/electron-chromedriver/bin/chromedriver.exe');
        this.driver = new Builder()
        .withCapabilities({
            'goog:chromeOptions': {
            binary: 'node_modules/electron/dist/electron.exe'
            }
        })
        .forBrowser('chrome')
        .setChromeService(service)
        .build();
        
        await this.driver.get(`https://translate.google.cn/?sl=${fromLagulig}&tl=zh-CN`)
        await sleep(3e3)
    }

    async keepGetElement(css: string)
    {
        let ele: WebElement
        for(;;)
        {
            try
            {
                ele = await this.driver.findElement(By.css(css))
                break
            }
            catch(e)
            {
                console.log("not found", css);
                
                await sleep(500)
            }
        }
        return ele
    }

    async translateToZhcn(text: string)
    {
        let textInputEle = await this.driver.findElement(By.className('er8xn'))
        if((await textInputEle.getAttribute("value")).length > 0)
        {
            let tta_clearEle = await this.keepGetElement('.DVHrxd')
            await tta_clearEle.click()
        }
        await sleep(1e3)
        textInputEle = await this.driver.findElement(By.className('er8xn'))
        await textInputEle.sendKeys(text)
        await sleep(1e3)
        let tta_output_taEle = await this.keepGetElement('.J0lOec')
        let returnWord = ""
        for(;;)
        {
            returnWord = await tta_output_taEle.getText()
            if(!returnWord.includes("正在翻译"))
            {
                break
            }
            else{
                await sleep(1e3)
            }
        }
        return returnWord
    }

}

export default Translater