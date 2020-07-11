const admin = require("firebase-admin");
//MODEL
const Notification = require("../model/Notification");
const Token = require("../model/Token");
const User = require("../model/User");
const Reply = require("../model/Reply");

const controller = {};

//GET NOTIFICATION OF USER
controller.getNotificationById = async (req, res, next) => {
  const { user } = req;
  try {
    const notifications = await Notification.find({ uid: user._id });
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};
//-----------ADMIN----------------
//---------------

//GET ALL NOTIFICATIONS
controller.getAllNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

//DELETE ALL NOTIFICATIONS
controller.deleteAllNotifications = async (req, res, next) => {
  try {
    await Notification.deleteMany();
    res.json("Deleted all notifications");
  } catch (error) {
    next(error);
  }
};
//-----------ALERT------------------
//----------------
// like reply => alert to owner of reply
// reply cái thread => alert to owner, subcribers và quoted user

// WHEN LIKE YOUR REPLY
controller.alertLikeReply = async (req, res) => {
  const { user: liker, reply } = req;
  //check if the reply has already been liked by liker
  if (reply.beLiked > -1) {
    return;
  }
  try {
    const owner = await User.findById(reply.uid);
    const token = await Token.findOne({ uid: owner._id });
    //Check if it is owned by your
    if (liker._id == owner._id) {
      return;
    }
    const message = {
      data: {
        uid: liker._id.toString(),
        userDisplayName: liker.displayName,
        title: "messageLike",
        content: reply.content,
        photoURL: liker.photoURL
      },
      token: token.tokenFCM,
    };
    const newNotification = {
      uid: owner._id,
      message,
    };

    //save to DB
    await Notification.create(newNotification);
    //Send message
    await admin.messaging().send(message);
  } catch (error) {
    console.log(error);
  }
};

//WHEN REPLY ON THREAD
/*
 TH1: ko có quoted
  - rep != owner => sub/rep; owner 
  - rep == owner => sub/rep
 TH2: quoted
  - rep == owner 
      + quotedUser == owner => sub/rep 
    ===> owner tự quoted bình luận của mình
      + quotedUser != owner => quotedUser; sub/rep+quotedUser 
    ===> owner quoted bình luận của user

  - rep != owner
      + quotedUser == owner => owner; sub/rep 
    ===> rep quoted bình luận của owner
      + quotedUser != owner 
          _ quotedUser == rep => owner;sub/rep 
    ===> rep tự quoted bình luận của mình
          _ quotedUser != rep =>  owner; quotedUser; sub/rep+quotedUser
    ===> rep quoted bình luận của user  
*/

controller.alertReplyOnThread = async (req, res) => {
  const { user: replier, thread, newReply } = req;
  try {
    const owner = await User.findById(thread.uid);
    const tokenOfOwner = await Token.findOne({ uid: owner._id });
    const subcribersFilter = (() => {
      const subcribers = [];
      //Chỉ gửi notification đến subcribers ngoại trừ replier
      thread.subcribers.forEach((subcriber) => {
        if (subcriber.uid != replier._id.toString()) {
          subcribers.push(subcriber.uid);
        }
      });
      return subcribers;
    })();
    const tokenOfAllSubcribers = await Token.find({
      uid: {
        $in: subcribersFilter,
      },
    });
    const messageToOwner = {
      data: {
        uid: replier._id.toString(),
        userDisplayName: replier.displayName,
        title: "messageToOwner",
        content: newReply.content,
        photoURL: liker.photoURL
      },
      token: tokenOfOwner.tokenFCM,
    };
    //TH1: ko có quoted
    if (!newReply.quoted.replyId) {
      //rep != owner
      if (replier._id.toString() != owner._id.toString()) {
        admin.messaging().send(messageToOwner);
        await Notification.create({
          uid: owner._id,
          message: messageToOwner,
        });
      }
    }

    //TH2: có quoted
    if (newReply.quoted.replyId) {
      const quotedReply = await Reply.findById(newReply.quoted.replyId);
      const quotedUser = await User.findById(quotedReply.uid);
      const tokenOfQuotedUser = await Token.findOne({
        uid: quotedUser._id,
      });
      const messageToQuotedUser = {
        data: {
          uid: replier._id.toString(),
          userDisplayName: replier.displayName,
          title: "messageToQuotedUser",
          content: quotedReply.content,
          photoURL: liker.photoURL
        },
        token: tokenOfQuotedUser.tokenFCM,
      };

      //rep == owner
      if (replier._id.toString() == owner._id.toString()) {
        // quoted user != owner
        if (quotedUser._id.toString() != owner._id.toString()) {
          admin.messaging().send(messageToQuotedUser);
          const removedSubciber = tokenOfAllSubcribers.findIndex(
            (token) => token.uid == quotedUser._id.toString()
          );
          tokenOfAllSubcribers.splice(removedSubciber, 1);
          await Notification.create({
            uid: owner._id,
            message: messageToQuotedUser,
          });
        }
      }

      // rep !=  owner
      if (replier._id.toString() != owner._id.toString()) {
        //quotedUser != owner
        if (owner._id.toString() != quotedUser._id.toString()) {
          admin.messaging().send(messageToOwner);
          await Notification.create({
            uid: owner._id,
            message: messageToOwner,
          });
          //quotedUser != rep
          if (replier._id.toString() != quotedUser._id.toString()) {
            admin.messaging().send(messageToQuotedUser);

            //quotedUser sẽ chỉ nhận thông báo quoted của mình, ko bị ảnh hưởng khi gửi tới all subcribers
            const removedSubciber = tokenOfAllSubcribers.findIndex(
              (token) => token.uid == quotedUser._id.toString()
            );
            tokenOfAllSubcribers.splice(removedSubciber, 1);
            await Notification.create({
              uid: quotedUser._id,
              message: messageToQuotedUser,
            });
          }
          //quotedUser == owner
        } else {
          const messageToOwnerCustom = {
            data: {
              uid: replier._id.toString(),
              userDisplayName: replier.displayName,
              title: "messageToOwnerCustom",
              content: quotedReply.content,
              photoURL: liker.photoURL
            },
            token: tokenOfOwner.tokenFCM,
          };
          admin.messaging().send(messageToOwnerCustom);
          await Notification.create({
            uid: owner._id,
            message: messageToOwnerCustom,
          });
        }
      }
    }
    //Check if don't have any subcribers
    if (tokenOfAllSubcribers.length == 0) {
      return;
    }
    //Notificate to all subcribers
    const messageToAllSubribers = {
      data: {
        uid: replier._id.toString(),
        userDisplayName: replier.displayName,
        title: "messageToAllSubscribers",
        content: thread.title,
        photoURL: liker.photoURL
      },
      tokens: tokenOfAllSubcribers.map((token) => token.tokenFCM),
    };
    admin.messaging().sendMulticast(messageToAllSubribers);

    const newNotifications = tokenOfAllSubcribers.map((token) => ({
      uid: token.uid,
      message: messageToAllSubribers,
    }));
    await Notification.create(newNotifications);
  } catch (error) {
    console.log(error);
  }
};

controller.alertAttendance = async (req, res) => {
  const { uid } = req.params;
  const { subject, content } = req.body;
  try {
    const token = await Token.findOne({ uid }).populate("uid");

    const message = {
      data: {
        subject,
        title: "messageAttendance",
        content,
      },
      token: token.tokenFCM,
    };
    const newNotification = {
      uid,
      message,
    };
    //save to DB
    await Notification.create(newNotification);
    await admin.messaging().send(message);
    res.json(newNotification);
  } catch (error) {
    next(error);
  }
};
module.exports = controller;
