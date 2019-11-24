window.$ = window.jQuery = function (selector) {
    let elements
    if (typeof selector === 'string') {
        if (selector[0] === '<') {
            elements = createElement(selector)
        } else {
            elements = [document.querySelectorAll(selector)]
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

    return {
        oidApi: elements.oldApi,
        elements: elements,
        jquery: true,
        addClass(className) {
            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.add(className)
            }
            return this
        },
        //所有elements前都要加this.
        find(selector) {
            let array = []
            for (let i = 0; i < elements.length; i++) {
                array.push(...elements[i].querySelectorAll(selector))
            }
            array.oldApi = this
            return jQuery(array)
        },
        each(fn) {
            for (let i = 0; i < elements.length; i++) {
                fn.call(null, elements[i], i)
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
        get(index) {
            return elements[index]
        },
        print() {
            console.log(this.elements);
        },
        appendTo(node) {
            if (node instanceof Element) {
                this.each(el => node.appendChild(el));
            } else if (node.jquery === true) {
                this.each(el => node.get(0).appendChild(el));
            }
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
        },
        end() {
            return this.oldApi
        }
    }
    //创建一个api对象，将函数都封装在__proto__(=jQuery.prototype)里面
};



$('#test').find('.child').addClass('red')


$('#test').print()
$('<div>11</div>').appendTo(test)



