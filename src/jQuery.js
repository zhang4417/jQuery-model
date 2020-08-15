window.$ = window.jQuery = function (selector) {
    let elements
    if (typeof selector === 'string') {
        if (selector[0] === '<') {
            elements = [createElement(selector)]
            //这里加[]，让其变成数组，配合后面elements[i]
        } else {
            elements = document.querySelectorAll(selector)
        }
    } else if (selector instanceof Array) {
        elements = selector
    }
    //定义不同类别的elements

    function createElement(string) {
        const container = document.createElement('template')
        container.innerHTML = string.trim()
        return container.content.firstChild
    }
    //创建新的标签

    const api = Object.create(jQuery.prototype)
    //创建一个api对象，将函数都封装在__proto__(=jQuery.prototype)里面
    Object.assign(api, { oidApi: elements.oldApi, elements: elements, })
    return api
};

jQuery.prototype = {
    constructor: jQuery,
    jquery: true,
    get(index) {
        return this.elements[index]
        //将jQuery.prototype独立出来，所有elements前都要加this.
    },
    print() {
        console.log(this.elements);
    },
    addClass(className) {
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].classList.add(className)
        }
        return this
    },
    find(selector) {
        let array = []
        for (let i = 0; i < this.elements.length; i++) {
            array.push(...this.elements[i].querySelectorAll(selector))
        }
        array.oldApi = this
        return jQuery(array)
    },
    end() {
        return this.oldApi
    },
    each(fn) {
        for (let i = 0; i < this.elements.length; i++) {
            fn.call(null, this.elements[i], i)
        }
    },
    parent() {
        let array = []
        this.each(n => {
            if (array.indexOf(n.parentNode) === -1) {
                array.push(n.parentNode)
            }
        })
        return jQuery(array)
    },
    children() {
        let array = []
        this.each(n => {
            array.push(...n.children)
        })
        return jQuery(array)
    },

    appendTo(node) {
        if (node instanceof Element) {
            this.each(el => node.appendChild(el));
        } else if (node.jquery === true) {
            this.each(el => node.get(0).appendChild(el));
        }
        return this
    },
    append(children) {
        if (children instanceof Element) {
            this.get(0).appendChild(children);
        } else if (children instanceof HTMLCollection) {
            for (let i = 0; i < children.length; i++) {
                this.get(0).appendChild(children[i]);
            }
        } else if (children.jquery === true) {
            children.each(node => this.get(0).appendChild(node));
        }
        return this
    },
    siblings() {
        let parents = []
        this.each(n => {
            if (parents.indexOf(n.parentNode) === -1) {
                parents.push(n.parentNode)
            }
        })
        //console.log(parents)
        let array = []
        for (let i = 0; i < parents.length; i++) {
            array.push(...parents[i].children)
        }
        //得到包含自己的siblings
        for (let i = 0; i < this.elements.length; i++) {
            array = array.filter(n => n !== this.elements[i])
        }

        return this

    },
    prev() {
        let array = []
        // this.each(el=>array.push(el.previousNode))
        for (let i = 0; i < this.elements.length; i++) {
            let x = this.elements[i].previousSibling
            while (x && x.nodeType === 3) {
                x = x.previousSibling
            }
            array.push(x)
        }
        return array
    },
    next() {
        let array = []
        this.each(el => {
            let x = el.nextSibling
            while (x && x.nodeType === 3) {
                x = x.nextSibling
            }
            array.push(x)
        })
        return array
    },
    on(event, elementStr, fn) {
        for (let i = 0; i < this.elements.length; i++) {
            const client = this.elements[i]
            client.addEventListener(event, (e) => {
                let el = e.target
                while (!el.matches(elementStr)) {
                    if (el === client) {
                        el = null
                        break;
                    }
                    el = el.parentNode
                }
                el && fn.call(el, el)
            })
        }
        return this
    }
};


$('#test').find('.child').addClass('red')
$('#test').print()
$('#test').on('click', 'div', function (e) { console.log(e.textContent) })
$('<div>11</div>').appendTo(test2)
$('#test2').append($('<div><strong>22</strong><strong>33</strong></div>')).addClass('red')
$('#hapi').siblings()
console.log($('#test').next())



