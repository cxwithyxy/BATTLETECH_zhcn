import fetch from "node-fetch"
import chrome from "selenium-webdriver/chrome"
import {Builder, By, ThenableWebDriver} from 'selenium-webdriver'
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
        
        await this.driver.get(`https://cn.bing.com/translator?ref=TThis&text=&from=${fromLagulig}&to=zh-Hans`)
        await sleep(3e3)
    }

    async translateToZhcn(text: string)
    {
        try
        {
            let tta_clearEle = await this.driver.findElement(By.id(('tta_clear')))
            await tta_clearEle.click()
        }catch(e){}
        let textInputEle = await this.driver.findElement(By.id('tta_input_ta'))
        await textInputEle.sendKeys(text)
        await sleep(1e3)
        let tta_output_taEle = await this.driver.findElement(By.id(('tta_output_ta')))
        let returnWord = ""
        for(;;)
        {
            returnWord = await tta_output_taEle.getAttribute("value")
            if(returnWord != " ...")
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