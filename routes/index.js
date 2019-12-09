var express = require('express');
var router = express.Router();
var axios = require('axios');
var url = require('url');

/* GET home page. */
router.get('/', async (req, res) => {
    res.render('index');
});

/* GET Repos */
router.post('/', async (req, res) => {

    try {
        const repoUrl = req.body.repo_url;
        const parsedUrl = url.parse(repoUrl);

        if (!parsedUrl.host) {
            res.render('index', {
                error: 'Invalid Url'
            });
        } else {
            const apiUrl = `${parsedUrl.protocol}//api.${parsedUrl.host}/repos${parsedUrl.path}/pulls`
            const response = await axios(apiUrl)
            const result = response.data;

            if (result.message) {
                res.render('index', {
                    error: 'Error occurred processing your request'
                });
            }
            if (result.length > 0) {
                let promisses = [];
                result.forEach(item => {
                    if (item.state === "open") {
                        let repoUrl = `${apiUrl}/${item.number}`;
                        promisses.push(
                            axios(repoUrl)
                        )
                    }
                });
                let pulls = [];
                Promise.all(promisses)
                    .then(response => {
                        response.forEach(result => {
                            item = result.data;
                            pulls.push({
                                number: item.number,
                                login: item.head.repo.owner.login,
                                title: item.title,
                                state: item.state,
                                commits_count: item.commits,
                                comments_count: item.comments,
                                review_comments_count: item.review_comments
                            });
                        })
                        res.render('index', {
                            pulls: pulls
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.render('index', {
                            error: 'Error occurred processing your request'
                        });
                    })
            }
        }
    } catch (err) {
        res.render('index', {
            error: 'Error occurred processing your request'
        });
    }
});

module.exports = router;
