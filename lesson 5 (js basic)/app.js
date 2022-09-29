var currentScrollTop = 1
var minScroll = 1
var currentPage = 1
var totalPages = 9
var extraPage = 1

setPage();

document.body.onscroll = () => {
    let A = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight)
    let B = window.pageYOffset || document.documentElement.scrollTop
    let C = document.documentElement.clientHeight
    let deltaScrollTop = B - currentScrollTop
    currentScrollTop = B
    if (deltaScrollTop > 0)
        if (A === B + C && currentPage < totalPages)
            if (++currentPage !== extraPage)
                ajax(currentPage, true)
    if (deltaScrollTop < 0)
        if (B === 0 && currentPage > 1)
            if (--currentPage !== extraPage)
                ajax(currentPage, false)
}

function ajax(page, direction = undefined) {
    //direction = true если опустились вниз, false если поднялись вверх
    let request = new XMLHttpRequest()
    let url = 'pages/glava' + page + ".html"
    request.open("GET", url, true)
    request.send()
    request.onreadystatechange = function () {
        if (request.readyState === 4)
            if (request.status === 200) {
                let pageText = "<div class='glava' id='glava_" + page + "'>" + request.responseText + "</div>"
                if (direction !== undefined) {
                    let offset = 0
                    if (direction) {
                        extraPage = page - 1
                        document.body.innerHTML += pageText
                        let prev = document.getElementById('glava_' + (page - 1))
                        offset = prev ? (prev.offsetTop + prev.offsetHeight) : 0
                    } else {
                        extraPage = page + 1
                        document.body.innerHTML = pageText + document.body.innerHTML
                        let prev = document.getElementById('glava_' + (page + 1))
                        offset = prev ? prev.offsetTop : 0
                    }
                    /*
                    скролим в начала следующей главы если опускались
                    скролим на конец предыдущей главы если поднимались
                     */
                    window.scrollTo(0, offset)
                    currentScrollTop = offset;
                    /*
                    храним на странице сразу 2 главы
                    если поднимаемся наверх, то сохраняем главу page + 1
                    если движемся вниз, сохраняем главу page - 1
                     */
                    let pages = document.getElementsByClassName('glava')
                    if (pages.length > 2 && direction !== undefined) {
                        let index4delete = direction ? 0 : (pages.length - 1)
                        document.body.removeChild(pages[index4delete])
                        console.log('remove index' + index4delete)
                    }
                } else {
                    document.body.innerHTML = pageText
                }
                console.log(url)
                getPage(page)
            }
    }
}

function getPage(page) {
    let state = {
        'page': page,
    };
    let title = document.getElementsByTagName("title")[0].innerHTML
    let url = window.location.pathname + "?page=" + page
    history.pushState(state, title, url);
}

function setPage() {
    let QueryString = getParam()
    if (typeof QueryString["page"] !== "undefined") {
        currentPage = parseInt(QueryString["page"])
        extraPage = currentPage
    }
    else
        getPage(currentPage)
    ajax(currentPage)
}

function getParam() {
    let s1 = location.search.substring(1, location.search.length).split('&')
    let r = {}
    let s2, i
    for (i = 0; i < s1.length; i += 1) {
        s2 = s1[i].split('=')
        r[decodeURIComponent(s2[0]).toLowerCase()] = decodeURIComponent(s2[1])
    }
    return r;
}
