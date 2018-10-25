const puppeteer = require('puppeteer')

function requestList (url) {
  if (!url) {
    throw new Error('Url must be specified.')
  }
  return puppeteer.launch().then(async browser => {
    let requests = []
    const page = await browser.newPage()
    await page.setRequestInterception(true)
    page.on('request', req => {
      requests.push(req.url())
      req.continue()
    })
    await page.goto(url)
    await browser.close()
    return requests
  })
}

exports.requestList = requestList
