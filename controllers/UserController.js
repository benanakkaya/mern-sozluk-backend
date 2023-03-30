import User from "../models/UserModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { transporter } from "../index.js";
import generator from "generate-password"


export const RegisterController = async (req, res) => {
    const { username, email, password, password2, birthday, gender } = req.body;

    const usernameControl = await User.findOne({ email });

    if (usernameControl) {
        return res.status(500).json({ message: "Zaten böyle bir kullanıcı mevcut mevcut!" })
    }

    const emailControl = await User.findOne({ username });

    if (emailControl) {
        return res.status(500).json({ message: "Bu e-mail adresi zaten kayıtlı!" })
    }

    if (password !== password2) {
        return res.status(500).json({ message: "Parolalar eşleşmiyor!" })
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const createdUser = await User.create({
        username,
        email,
        password: hashedPassword,
        birthday,
        gender
    })

    const token = await createToken(createdUser._id);

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Mern Sozluk Email Aktivasyonu",
        html: `<h1>Mern Sözlüğe Hoşgeldiniz</h1><br><h3>Hesap onayınızı gerçekleştirmek için aşağıdaki linke tıklayın.</h3><br>localhost:5000/confirm/${token}`
    }

    transporter.sendMail(mailOptions, (err, data) => {
        if (err) return res.status(500).json({ message: "Şu anda kayıt işleminiz yapılamıyor!" })
    })

    return res.status(201).json({ message: "Kayıt işlemi başarılı!", user: createdUser })

}


export const ConfirmController = async (req, res) => {
    const token = jwt.verify(req.params.token, "SECRET_KEY");

    const date = new Date().getTime() / 1000;

    const user = await User.findById(token.userID);

    if (user.confirmed) {
        return res.status(500).json({ message: "Hesabınız çoktan onaylanmış!" })
    }

    if (token.exp < date) {
        return res.status(500).json({ message: "Linkin süresi dolmuş!" })
    }

    const confirmedUser = await User.findByIdAndUpdate(user._id, { confirmed: true });

    return res.status(200).json({ message: `Hesabınız başarıyla onaylanmıştır!` });
}

export const LoginController = async (req,res) => {
    const {username,password} = req.body;

    const userCheck = await User.findOne({username});

    if(!userCheck){
        return res.status(500).json({message:"Böyle bir kullanıcı bulunamadı!"});
    }

    if(!userCheck.confirmed){
        return res.status(500).json({message:"Hesabınız henüz onaylanmamış, lütfen mail adresinize gelen onay mailine tıklayın!"});
    }

    const passwordCompare = await bcryptjs.compare(password,userCheck.password);

    if(!passwordCompare){
        return res.status(400).json({message:"Lütfen parolanızı kontrol edin!"})
    }

    const token = await createToken(userCheck._id);

    return res.status(200).json({message:"Tebrikler, başarıyla giriş yaptınız!",token});

}

export const ForgotPasswordController = async (req,res) => {
    const {email} = req.body;

    const user = await User.findOne({email});

    if(!user){
        return res.status(500).json({message:"Kayıtlı e-mail bulunamadı!"})
    }

    const token = await createToken(user._id);

    const mailOptions = {
        from:process.env.EMAIL,
        to:user.email,
        subject:"Parola Sıfırlama",
        html: `<h1>Parolanızı sıfırlamak için aşağıdaki bağlantıyı kullanın;</h1><br>localhost:5000/user/reset-password/${token}`
    }

    transporter.sendMail(mailOptions,(err,data) => {
        if(err){
            return res.status(500).json({message:"Sıfırlama mailiniz şu anda gönderilemiyor, daha sonra tekrar deneyin!"})
        }
    })

    return res.status(200).json({message:"Parola sıfırlama bağlantınız mailinize gönderildi!"});
}

export const ResetPasswordController = async (req,res) => {
    const token =  jwt.verify(req.params.token,"SECRET_KEY");

    const date = new Date().getDate()/1000;

    if(token.exp < date){
        return res.status(500).json({message:"Bağlantının süresi dolmuş!"})
    }

    const user = await User.findById(token.userID);

    if(!user){
        return res.status(500).json({message:"Böyle bir kullanıcı bulunamadı!"})
    }

    const newPassword =  generator.generate({length:10,numbers:true});

    const hashedNewPassword = await bcryptjs.hash(newPassword,10);

    await User.findByIdAndUpdate(user._id,{password:hashedNewPassword});

    const mailOptions = {
        from:process.env.EMAIL,
        to:user.email,
        subject:"Yeni Parolanız",
        html: `<h1>Yeni parolanız aşağıdadır;</h1><br>Yeni Parolanız: ${newPassword}`
    }

    transporter.sendMail(mailOptions,(err,data) => {
        if(err){
            return res.status(500).json({message:"Sıfırlama mailiniz şu anda gönderilemiyor, daha sonra tekrar deneyin!"})
        }
    })

    return res.status(200).json({message:"Yeni parolanız e-mail adresinize gönderildi!"});

}


const createToken = async (userID) => {
    return jwt.sign({ userID }, "SECRET_KEY", { expiresIn: "1d" });
}