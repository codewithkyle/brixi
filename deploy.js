const ghPages = require("gh-pages");

const NAME = "Kyle Andrews";
const EMAIL = "codingwithkyle@gmail.com";
const USERNAME = "codewithkyle";
const PROJECT = "brixi";

ghPages.publish(
    "public",
    {
        user: {
            name: NAME,
            email: EMAIL,
        },
        repo: "https://" + process.env.ACCESS_TOKEN + "@github.com/" + USERNAME + "/" + PROJECT + ".git",
        silent: true,
    },
    (error) => {
        if (error) {
            console.log(error);
        }
    }
);