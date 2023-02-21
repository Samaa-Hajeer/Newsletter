
const express = require("express");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mailchimp.setConfig({
    apiKey: "22c594a6925e36c414579fc20c6f2ccc-us21",
    server: "us21",
});


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", async (req, res) => {
    const { firstName, lastName, pEmail } = req.body;

    if (!firstName || !lastName || !pEmail) {
        res.sendFile(__dirname + "/failure.html");
        return;
    }

    const data = {
        members: [
            {
                email_address: pEmail,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);

    const response = await mailchimp.lists.batchListMembers("b026982e17", jsonData);
    //   console.log(res.status(200).json(response));
    console.log(response.error_count);
    if (response.error_count === 0) {
        if (res.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
            return;
        }
    }
    else {
        res.sendFile(__dirname + "/failure.html");

    }
});


app.post("/failure", function (req, res) {
    res.redirect("/");
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
    console.log("Port 3000");
});

//b026982e17