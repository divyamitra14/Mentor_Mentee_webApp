const express=require("express")
const login=express()
const port=process.env.PORT || 3000
const hbs=require("hbs")
const path=require("path")
const views_path=path.join(__dirname,"../template/views")
const body_parser=require("body-parser")
require("./db/con")
const register=require("./models/reg")
const adminLogin = require("./models/admin");
const multer = require('multer');

login.use(body_parser.json())
login.use(body_parser.urlencoded({extended:false}))

login.use("/image",express.static(path.join(__dirname,"../template/public/assets/image")))


login.set("view engine","hbs")
login.set("views",views_path)

login.listen(port,()=>{
    console.log(`app running in port: ${port}`)
    console.log(views_path);
})

login.get("/login",(req,res)=>{
    res.render("login")
})

login.get("/register",(req,res)=>{
    res.render("register")
})

login.get("/thankyou",(req,res)=>{
    res.render("thankyou")
})

login.use("/upload",express.static(path.join(__dirname,"../upload")));

const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, 'upload/');
    },
    filename: function (req, file, cb) {
        // console.log(file)
        cb(null, Date.now() + path.extname(file.originalname));
    }

});
const upload = multer({storage : storage});

login.post("/save",upload.single("image"),async(req,res)=>{
    try{
        const imagePath=req.file.path
        const studData=new register({
            timestamp:req.body.timestamp,
            user_name:req.body.user_name,
            user_email:req.body.user_email,
            phone:req.body.phone,
            Address:req.body.Address,
            Gender:req.body.Gender,
            roll:req.body.roll,
            branch:req.body.branch,
            section:req.body.section,
            image:req.file.filename,
            FatherName:req.body.FatherName,
            FatherPhone:req.body.FatherPhone,
            FatherEmail:req.body.FatherEmail,
            FatherOcc:req.body.FatherOcc,
            MotherName:req.body.MotherName,
            MotherPhone:req.body.MotherPhone,
            MotherEmail:req.body.MotherEmail,
            MotherOcc:req.body.MotherOcc,
            ParentAddress:req.body.ParentAddress,
            Xth:req.body.Xth,
            XIIth:req.body.XIIth,
            checkbox:req.body.checkbox,
            password:req.body.password
        });
        const data=await studData.save()
        res.render("login", { success: "User created successfully. Please login." });
        // res.send("Data Got saved,Thank you for Your Cooperation !")
    }
    catch (e) {
        console.log(e)
    }
});

login.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    res.sendFile(path.join(__dirname, "uploads", filename));
});


login.get("/admin",async (req,res)=>{
    try {
        const users = await register.find();
        if (users){
            res.status(200).render("admin",{register:users})
        }
        else {
            res.send("No users found in Database")
        }

    }
    catch (e) {
        res.send(e)
    }
})

login.post("/signIn", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await register.findOne({ user_email:email });

        if (!user) {
            return res.status(404).render("login", { error: "User not found" });
            // res.send("User not found")
        }
        if (user.password !== password) {
            return res.status(401).render("login", { error: "Incorrect password" });
            // res.send("Incorrect Password")

        }
        res.redirect("/thankyou")
    }
    catch (error) {
        console.error('Error while logging in:', error);
        res.status(500).send("Error while logging in");
    }
});


login.get("/adminlogin",(req,res)=>{
    res.render("adminlogin")
})


login.post("/adminsave",async(req,res)=>{
    try{
        const userData=new adminLogin({
            username:req.body.username,
            password:req.body.password
        })
        const data=await userData.save()
        res.send("data saved !")
    }
    catch (e){
        console.error(e);
        res.status(500).send("Internal Server Error");
    }
})

login.post("/adminlogin", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await adminLogin.findOne({ username: username });
        if (!user) {
            return res.status(404).render("adminlogin", { error: "User not found" });
        }
        if (user.password !== password) {
            return res.status(401).render("adminlogin", { error: "Incorrect password" });
        }
        res.redirect("/admin");
    } catch (error) {
        console.error('Error while logging in:', error);
        res.status(500).send("Error while logging in");
    }
});


login.post("/update", async (req, res) => {
    const { u_name, u_email, u_phone, u_address, f_name, f_email, f_phone, m_name, m_email, m_phone, p_address, u_10, u_12,date,mentoring_details, id } = req.body;
    console.log(id); // Ensure the ID is correctly received
    try {
        const data = await register.findByIdAndUpdate(id, {
            user_name: u_name,
            user_email: u_email,
            phone: u_phone,
            Address: u_address,
            FatherName: f_name,
            FatherPhone: f_phone,
            FatherEmail: f_email,
            MotherName: m_name,
            MotherPhone: m_phone,
            MotherEmail: m_email,
            ParentAddress: p_address,
            Xth: u_10,
            XIIth: u_12,
            date:date,
            mentoring_details:mentoring_details
        });

        if (!data) {
            return res.status(404).send("Data not found");
        }

        console.log("Data updated successfully:", data);
        // res.send("Data updated successfully!");
        res.redirect("/admin")
    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).send("Internal Server Error");
    }
});




