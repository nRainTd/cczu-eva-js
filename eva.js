// ==UserScript==
// @name         吊大一键评价
// @namespace    http://tampermonkey.net/
// @version      2024-12-06
// @description  吊大一键评价
// @author       lliiooll
// @match        http://202.195.102.53/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=102.53
// @grant        none
// ==/UserScript==



(function() {
	'use strict';
	// 总体评价内容的值，很好，较好，一般，较差
	let global = '很好'
	// 其他项得分，100,80,60,0
	let itemScore = '100'
	// 意见建议的内容
	let globalContent = '无'



	let path = window.location.pathname
	if (path.endsWith('jxpj_xspj_kcxz.aspx')) {
		let items = document.getElementsByClassName('dg1-item')
		var index = window.sessionStorage.getItem('now')
		if (index == null) {
			index = 0
		}
		console.log('评价 ' + index)
		__doPostBack('GVpjkc', 'Select$' + index)
		if (index < items.length) {
			index++
			window.sessionStorage.setItem('now', index)
		} else {
			window.sessionStorage.removeItem('now')
			alert('评价完毕!!')
		}
	} else if (path.endsWith('jxpj_xspj_kcpj.aspx')) {
		// 保存按钮
		let save = document.getElementById('Button2')
		save.setAttribute('onclick', '')
		// 寻找意见建议
		let textarea = document.getElementById('Txtyjjy')
		// 寻找总体评价
		let select = document.getElementById('DDztpj')
		textarea.innerHTML = globalContent // 意见建议内容
		// 总体评价内容
		let options = select.getElementsByTagName('option')
		for (let i = 0; i < options.length; i++) {
			if (options[i].getAttribute('value') == global) {
				options[i].setAttribute('selected', 'selected')
			} else {
				options[i].removeAttribute('selected')
			}
		}
		// 单个评分内容
		for (let i = 2; i < 8; i++) {
			let item = 'GVpjzb_ctl0' + i + '_RaBxz'
			for (let ic = 0; ic < 4; ic++) {
				let check = document.getElementById(item + '_' + ic)
				if (check.getAttribute('value') == itemScore) {
					check.setAttribute('checked', 'checked')
				} else {
					check.removeAttribute('checked')
				}
			}
		}
		window.alert = function() {
			return 1
		}
		window.confirm = function() {
			return 1
		}
		window.prompt = function() {
			return 1
		}
		save.click()
		window.parent.postMessage('push', '*')
	} else {
		window.addEventListener('message', function(e) {
			if (e.data == 'push') { // 子页面要父页面传递消息
				setTimeout(() => {
					let refresh = document.getElementById('btsximg')
					refresh.click()
				}, 1000)

			}
		})
	}
})();
