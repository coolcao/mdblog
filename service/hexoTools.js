'use strict';

let tools = {
    parseHead: function parseHead(md_text) {
        if (!md_text || Object.prototype.toString.call(md_text) !== '[object String]') {
            throw new Error(`参数md_text不能为空，且必须为字符串`);
        }
        let reg = /---\stitle.*\sdate.*\stags.*\scategories.*\s(-.*\s)*---/;
        let titleReg = /title:\s+.+\s/;
        let dateReg = /date:\s+.+\s/;
        let tagReg = /tags:\s+.+\s/;
        let headObj = md_text.match(reg);
        let head = headObj && headObj[0];
        if(head){
            let titleObj = head.match(titleReg);
            let title = titleObj && titleObj[0];
            title = title && title.replace('title:','').replace(' ','').replace(/\n/g,'');
            let dateObj = head.match(dateReg);
            let date = dateObj && dateObj[0];
            date = date && date.replace('date:','').replace(' ','').replace(/\n/g,'');;
            let tags = head.match(tagReg)[0].replace(/\n/g,'').replace(/ /g,'').replace('[','').replace(']','').replace('tags:','').split(',');
            return {head:head,title:title,date:date,tags:tags};
        }else{
            return null;
        }
    }
}

module.exports = tools;