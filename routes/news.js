const express = require('express');
const router = express.Router();
const Forum = require('../schema/Forum.module');

const URL = 'http://daotao.sict.udn.vn';

const axios = require('axios');
const cheerio = require('cheerio');

router.get('/', async (req, res) => {
    try {
        const response = await axios.get(URL);
        let $ = await cheerio.load(response.data);
        const arr = [];
        $('.block>.panel-body>div>.item-list>ul>li').each((index, element) => {
            const item = $(element).find('a');
            const itemDate = $(element).find('span');
            const title = item.text().trim();
            const link = item.attr('href').trim();
            const category = link.split('/')[1];
            const datePre = itemDate.text().split(' ')[2];
            const dateArr = datePre.split('/');
            let date = "";
            for (let i = dateArr.length - 1; i >= 0; i--) {
                date += dateArr[i];
                i === 0 ? date += "" : date += '/';
            }

            const object = {
                title: title,
                url: link,
                category: category,
                date: date,
            };
            arr.push(object);
        });

        await res.json({
            news: arr
        });
    } catch (e) {
        console.log(e);
        throw e;
    }
});

module.exports = router;