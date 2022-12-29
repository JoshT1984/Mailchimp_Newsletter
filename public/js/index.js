const express = require("express");
const app = express();
const path = require("path");
const client = require("@mailchimp/mailchimp_marketing");
let chimpAPI = "";
let apiServer = "";
let chimpListID = "";

client.setConfig({
  apiKey: chimpAPI,
  server: apiServer,
});

app.use(express.urlencoded({ extended: true }));

app.use(
  "/images",
  express.static(path.join(__dirname + "../../../public/images"))
);

app.use("/css", express.static(path.join(__dirname + "../../../public/css")));

app.use("/js", express.static(path.join(__dirname + "../../../public/js")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "../../../signup.html"));
});

app.post("/", (req, res) => {
  const firstName = req.body.first;
  const lastName = req.body.last;
  const email = req.body.email;

  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
  };

  const run = async () => {
    const response = await client.lists.addListMember(chimpListID, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName,
      },
    });
    res.sendFile(path.join(__dirname + "../../../success.html"));
  };
  run().catch((e) => {
    res.sendFile(path.join(__dirname + "../../../failure.html"));
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});
