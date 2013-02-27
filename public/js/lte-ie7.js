/* Use this script if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-globe' : '&#x21;',
			'icon-bill' : '&#x22;',
			'icon-book-alt2' : '&#x23;',
			'icon-stats' : '&#x24;',
			'icon-legal' : '&#x25;',
			'icon-leaf' : '&#x26;',
			'icon-plus-sign' : '&#x27;',
			'icon-layers' : '&#x28;',
			'icon-plus' : '&#x29;',
			'icon-shield' : '&#x2a;',
			'icon-bus' : '&#x2b;',
			'icon-office' : '&#x2c;',
			'icon-vimeo' : '&#x2d;',
			'icon-twitter' : '&#x2e;',
			'icon-github' : '&#x2f;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; i < els.length; i += 1) {
		el = els[i];
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};