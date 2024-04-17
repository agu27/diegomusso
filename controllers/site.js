'use strict'

const files = require('../models/index').files;

const articles = require('../models/index').articles;

const users = require ('../models/index').users;


async function home (req, h) {
    return h.view('index', {
        title: 'Home',
        user: req.state.user
    });
}

function register (req, h) {
    if (!req.state.user.admin) {
        return h.redirect('/')
    }
    return h.view('register', {
        title: 'Registro',
        user: req.state.user
    });
}

async function countable (req, h) {

    let articleList;
    let reverseArticleList = [];
    
    try {
        articleList = await articles.getFiles();

        if (!articleList) {
            return notFound(req, h);
        }

        for (let i = articleList.length - 1; i >= 0; i--) {
            reverseArticleList.push(articleList[i]);
        }

    } catch (error) {
        console.error(error);
    }

    if (req.state.user) {
        let data;
        try {
            data = await users.getIdWithEmail (req.state.user.email);
            if (!data) {
                return notFound (req, h)
            }
                return h.view('countable', {
                    user: req.state.user,
                    id: data,
                    reverseArticleList: reverseArticleList,
                });
        } catch (error) {
            console.error(error);
        }
    }

    else {
        return h.view('countable', {
            title: 'Contable',
            reverseArticleList: reverseArticleList,
        });
    }
}

async function countableNews (req, h) {

    let articleList;
    let reverseArticleList = [];

    try {
        articleList = await articles.getFiles();

        if (!articleList) {
            return notFound(req, h);
        }

        for (let i = articleList.length - 1; i >= 0; i--) {
            reverseArticleList.push(articleList[i]);
        }

    } catch (error) {
        console.error(error);
    }

    if (req.state.user) {
        return h.view('countable-news', {
            user: req.state.user,
            title: 'Noticias',
            reverseArticleList: reverseArticleList,
        });
    }

    else {
        return h.view('countable-news', {
            title: 'Noticias',
            reverseArticleList: reverseArticleList,
        });
    }
}

async function singleNew (req, h) {
    let article;
    let pos = req.params.id;
    let id;

    id = await articles.getIdWithPos (pos);

    article = await articles.getOne (id);

    if (req.state.user) {
        return h.view('countable-new', {
            user: req.state.user,
            title: 'Noticia',
            article: article,
            id: id,
        });
    }

    else {
        return h.view('countable-new', {
            title: 'Noticias',
            article: article,
            id: id,
        });
    }
}

async function clients (req, h) {
    if (!req.state.user.admin) {
        return h.redirect('/')
    }

    let userList;

    try {
        userList = await users.getUsers();

        if (!userList) {
            return notFound(req, h);
        }

    } catch (error) {
        console.error(error);
    }

    return h.view('clients', {
        title: 'Clientes',
        user: req.state.user,
        userList: userList
    });
}

function login (req, h) {
    if (req.state.user) {
        return h.redirect('/')
    }
    return h.view('login', {
        title: 'LogIn',
        user: req.state.user,
    });
}

function insurance (req, h) {
    if (req.state.user) {
        return h.view('insurance', {
            title: 'Insurance',
            user: req.state.user,
        });
    }

    else {
        return h.view('insurance', {
            title: 'Insurance',
        });
    }
}

function capacitation (req, h) {
    return h.view('capacitations', {
        title: 'Capacitation',
    });
}

async function viewUser (req, h) {
    let data;
    try {
        data = await users.getUserById (req.params.id);
        if (!data) {
            return notFound (req, h)
        }
        const str1 = data.email;
        const str2 = req.state.user.email;
        
        if (req.state.user.admin || str1 === str2) {
            const filesList = await files.getFiles();
            const userId= req.params.id;
            return h.view('client', {
                title: 'LogIn',
                user: req.state.user,
                id: userId,
                userOwner: data,
                filesList: filesList,
            });
        } else {
            return h.redirect('/');
        }
    } catch (error) {
    console.error(error);
    }
}

function notFound (req, h) {
    return h.redirect('/');
}

function fileNotFound (req, h) {
    const response = req.response;
    if (!req.path.startsWith('/api') && response.isBoom && response.output.statusCode === 404) {
        return h.view('404', null, {layout: '404'}).code(404)
    } 

    return h.continue
}

module.exports = {
    home,
    countable,
    register,
    login,
    notFound,
    fileNotFound,
    clients,
    viewUser,
    countableNews,
    singleNew,
    insurance,
    capacitation
}