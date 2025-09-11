import Notification from "../model/notification.model.js";
export const getNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const notification = await notification.find({ to: userId }).populate({
      path: "from",
      select: "username, profileImg",
    });

    await Notification.updateMany({ to: userId }, { read: true });
    res.status(200).json(Notification);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("error in getnotification function", error.message);
  }
};

export const delectNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.deleteMany({ to: user });
    res.status(200).json({ message: "Notification Delected" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("error in delectnotification function", error.message);
  }
};

// export const delectOneNotification = async (req, res) => {
//   try {
//     const notificationId = req.prams.id;
//     const userId = req.user._id;
//     const notification = await Notification.find(notificationId);
//     if (!notification) {
//       res.status(402).json({ error: "Notification is Not Found." });
//     }
//     if (notification.to.tostring() !== userId.tostring()) {
//       res.status(403).json({ error: "You don't delete this notification." });
//     }

//     await Notification.findByIdAndDelete(notificationId);
//     res
//       .status(200)
//       .json({ message: "this notification will delected sucessfully." });
//   } catch (error) {

//   }
// };
