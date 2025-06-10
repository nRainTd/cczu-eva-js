// ==UserScript==
// @name         吊大一键评价
// @namespace    http://tampermonkey.net/
// @version      2025-06-10
// @description  吊大一键评价
// @author       lliiooll
// @match        http://202.195.102.53/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=102.53
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  /**总体评价内容的值，很好，较好，一般，较差 */
  const overallEva = '很好';
  /**意见建议的内容 */
  const suggestion = '无';
  /**
   * 分项评分的评价值可能情况，可以取 100,80,60,0
   * @description
   * 由于每一项都选一样的评价值会提示结果雷同，所以采用 score = scoreArr[i % len] 的方式取值
   */
  const itemScoreArr = ['100', '80'];
  /**
   * url 的路径部分
   * @description
   * 评价系统的页面是使用 iframe 标签嵌入的，这里获取的是 iframe 里 document 的路径；而浏览器地址栏显示的路径是不变的
   */
  const path = window.location.pathname;

  if (path.endsWith('jxpj_xspj_kcxz.aspx')) {
    /**评价系统列出的所有课程的列表 */
    const items = document.getElementsByClassName('dg1-item');
    /**课程索引 */
    let index = window.sessionStorage.getItem('now');
    if (index == null) {
      index = 0;
    }
    console.log('评价 ' + index);
    __doPostBack('GVpjkc', 'Select$' + index);
    if (index < items.length) {
      index++;
      window.sessionStorage.setItem('now', index);
    } else {
      window.sessionStorage.removeItem('now');
      alert('评价完毕!!');
    }
  } else if (path.endsWith('jxpj_xspj_kcpj.aspx')) {
    /**保存按钮 */
    const save = document.getElementById('Button2');
    save.setAttribute('onclick', '');

    /**意见建议的文本框 */
    const suggestionTextarea = document.getElementById('Txtyjjy');
    suggestionTextarea.innerHTML = suggestion; // 意见建议内容

    /**总体评价的选择框 */
    const overallEvaSelect = document.getElementById('DDztpj');
    /**总体评价的选项列表 */
    const overallEvaOptions = overallEvaSelect.getElementsByTagName('option');
    for (let i = 0; i < overallEvaOptions.length; i++) {
      if (overallEvaOptions[i].getAttribute('value') == overallEva) {
        overallEvaOptions[i].setAttribute('selected', 'selected');
      } else {
        overallEvaOptions[i].removeAttribute('selected');
      }
    }

    // 单个评分内容
    for (let i = 2; i < 8; i++) {
      /**其中一项评分内容对应单选列表的 id 前缀 */
      const item = 'GVpjzb_ctl0' + i + '_RaBxz';
      for (let ic = 0; ic < 4; ic++) {
        /**评价单选按钮 */
        const check = document.getElementById(item + '_' + ic);
        if (
          check.getAttribute('value') == itemScoreArr[i % itemScoreArr.length]
        ) {
          check.setAttribute('checked', 'checked');
        } else {
          check.removeAttribute('checked');
        }
      }
    }

    window.alert = function () {
      return 1;
    };
    window.confirm = function () {
      return 1;
    };
    window.prompt = function () {
      return 1;
    };

    save.click();
    window.parent.postMessage('push', '*');
  } else {
    window.addEventListener('message', function (e) {
      if (e.data == 'push') {
        // 子页面要父页面传递消息
        setTimeout(() => {
          const refresh = document.getElementById('btsximg');
          refresh.click();
        }, 1000);
      }
    });
  }
})();
