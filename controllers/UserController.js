import User from "../models/UserModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { transporter } from "../index.js";
import generator from "generate-password";
import TopicModel from "../models/TopicModel.js";

export const RegisterController = async (req, res) => {
  const { username, email, password, password2, birthday, gender } = req.body;

  const usernameControl = await User.findOne({ username });

  if (usernameControl) {
    return res
      .status(500)
      .json({ message: "Zaten böyle bir kullanıcı mevcut mevcut!" });
  }

  const emailControl = await User.findOne({ email });

  if (emailControl) {
    return res.status(500).json({ message: "Bu e-mail adresi zaten kayıtlı!" });
  }

  if (password !== password2) {
    return res.status(500).json({ message: "Parolalar eşleşmiyor!" });
  }

  const hashedPassword = await bcryptjs.hash(password, 10);

  const createdUser = await User.create({
    username,
    email,
    password: hashedPassword,
    birthday,
    gender,
  });

  const token = await createToken(createdUser._id);

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Mern Sozluk Hesap Aktivasyonu",
    html: `<h1>Mern Sözlüğe Hoşgeldiniz</h1><br><h3>Hesap onayınızı gerçekleştirmek için aşağıdaki bağlantıya gidin.</h3><br>https://mern-sozluk.vercel.app/activate?key=${token}`,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Şu anda kayıt işleminiz yapılamıyor!" });
  });

  return res.status(201).json({
    message:
      "Kayıt başarılı, mailinize gelen linke tıkladıktan sonra giriş yapabilirsiniz!",
    user: createdUser,
  });
};

export const ActivateController = async (req, res) => {
  try {
    const token = jwt.verify(req.params.token, "SECRET_KEY");

    // const date = new Date().getTime() / 1000;

    const user = await User.findById(token.id);

    if (!user) {
      return res.status(200).json({ message: "Geçersiz bağlantı!", activated: false});
    }

    if (user.confirmed) {
      return res.status(200).json({ message: "Hesabınız çoktan onaylanmış!" , activated: true});
    }

    // if (token.exp < date) {
    //     return res.status(500).json({ message: "Linkin süresi dolmuş!" })
    // }

    const confirmedUser = await User.findByIdAndUpdate(user._id, {
      confirmed: true,
    });

    return res
      .status(200)
      .json({ message: `Hesabınız başarıyla onaylanmıştır!`, activated: true });
  } catch (error) {
    return res.status(200).json({ message: "Geçersiz bağlantı!", activated: false });
  }
};

export const LoginController = async (req, res) => {
  const { email, password } = req.body;

  const userCheck = await User.findOne({ email });

  if (!userCheck) {
    return res.status(500).json({ message: "Kayıtlı e-mail bulunamadı!" });
  }

  if (!userCheck.confirmed) {
    return res.status(500).json({
      message:
        "Hesabınız oluşturuldu, giriş yapabilmek için mailinize gelen linke tıklayın!",
    });
  }

  const passwordCompare = await bcryptjs.compare(password, userCheck.password);

  if (!passwordCompare) {
    return res.status(400).json({ message: "Lütfen parolanızı kontrol edin!" });
  }

  const token = await createToken(userCheck);

  return res.status(200).json({
    message: "Tebrikler, başarıyla giriş yaptınız!",
    token,
    user: { id: userCheck._id, username: userCheck.username },
  });
};

export const ForgotPasswordController = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(500).json({ message: "Kayıtlı e-mail bulunamadı!" });
  }

  const token = await createToken(user._id);

  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: "Parola Sıfırlama",
    html: `<h1>Parolanızı sıfırlamak için aşağıdaki bağlantıyı kullanın;</h1><br>localhost:5000/user/reset-password/${token}`,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return res.status(500).json({
        message:
          "Sıfırlama mailiniz şu anda gönderilemiyor, daha sonra tekrar deneyin!",
      });
    }
  });

  return res
    .status(200)
    .json({ message: "Parola sıfırlama bağlantınız mailinize gönderildi!" });
};

export const ResetPasswordController = async (req, res) => {
  const token = jwt.verify(req.params.token, "SECRET_KEY");

  const date = new Date().getDate() / 1000;

  if (token.exp < date) {
    return res.status(500).json({ message: "Bağlantının süresi dolmuş!" });
  }

  const user = await User.findById(token.userID);

  if (!user) {
    return res.status(500).json({ message: "Böyle bir kullanıcı bulunamadı!" });
  }

  const newPassword = generator.generate({ length: 10, numbers: true });

  const hashedNewPassword = await bcryptjs.hash(newPassword, 10);

  await User.findByIdAndUpdate(user._id, { password: hashedNewPassword });

  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: "Yeni Parolanız",
    html: `<h1>Yeni parolanız aşağıdadır;</h1><br>Yeni Parolanız: ${newPassword}`,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return res.status(500).json({
        message:
          "Sıfırlama mailiniz şu anda gönderilemiyor, daha sonra tekrar deneyin!",
      });
    }
  });

  return res
    .status(200)
    .json({ message: "Yeni parolanız e-mail adresinize gönderildi!" });
};

export const GetUserController = async (req, res) => {
  const { id } = req.body;

  const user = await User.findById(id);

  return res.status(200).json(user);
};

export const GetProfileController = async (req, res) => {
  const { username } = req.body;

  const userProfile = await User.findOne({ username })
    .select("-password")
    .populate({
      path: "entries",
      populate: [
        { path: "topic", model: "Topic" },
        { path: "owner", model: "User" },
      ],
    })
    .populate({
      path: "favorites",
      populate: [
        { path: "topic", model: "Topic" },
        { path: "owner", model: "User" },
      ],
    })
    .sort({ "entries.createdAt": -1 });

  if (!userProfile) {
    return res.status(500).json({ message: "Böyle bir kullanıcı bulunamadı" });
  }

  return res.status(200).json(userProfile);
};

export const SetAvatarController = async (req, res) => {
  const { avatar, user } = req.body;

  await User.findByIdAndUpdate(user, { avatar: avatar });

  return res.status(200).json({ message: "Avatar başarıyla güncellendi!" });
};

const createToken = async (user) => {
  return jwt.sign({ id: user._id, username: user.username }, "SECRET_KEY", {
    expiresIn: "1d",
  });
};
