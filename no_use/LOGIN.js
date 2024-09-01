const express=require("express")
const login=express()
const port=process.env.PORT || 3000
const hbs=require("hbs")
const path=require("path")
const views_path=path.join(__dirname,"../template/views")
const body_parser=require("body-parser")
require("./db/con")
const register=require("./models/reg")

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


login.post("/save",async(req,res)=>{
    try{
        const studData=new register({
            user_name:req.body.user_name,
            user_email:req.body.user_email,
            phone:req.body.phone,
            Address:req.body.Address,
            Gender:req.body.Gender,
            roll:req.body.roll,
            branch:req.body.branch,
            section:req.body.section,
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
            XIIth:req.body.XIIth
        });
        const data=await studData.save()
        res.send("Data Got saved,Thank you for Your Cooperation !")
    } catch (e) {
        console.log(e)
    }
});


login.get("/admin",async (req,res)=>{
    try {
        const users = await register.find();
        if (users){
            res.status(200).render("admin",{register:users})
        }else {
            res.send("No users found in Database")
        }

    }catch (e) {
        res.send(e)
    }
})


login.get("/adminlogin",(req,res)=>{
    res.render("adminlogin")
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


login.post("/update",async (req,res)=>{
    const u_name=req.body.u_name
    const u_email=req.body.u_email
    const u_phone=req.body.u_phone
    const u_add=req.body.u_address
    const f_name=req.body.f_name
    const f_email=req.body.f_email
    const f_phone=req.body.f_phone
    const m_name=req.body.m_name
    const m_email=req.body.m_email
    const m_phone=req.body.m_phone
    const p_add=req.body.p_address
    const u_10=req.body.u_10
    const u_12=req.body.u_12
    const id=req.body.id
    console.log(id)
    const data=await register.updateOne({_id:id},{$set:{"user_name":u_name,"user_email":u_email,"phone":u_phone,"Address":u_add,"FatherName":f_name,"FatherPhone":f_phone,"FatherEmail":f_email,"MotherName":m_name,"MotherPhone":m_phone,"MotherEmail":m_email,"ParentAddress":p_add,"Xth":u_10,"XIIth":u_12}})

    res.send("updated data displayed in console")

})