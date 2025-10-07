import Notification from "../model/notification.model.js";
export const getNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username, profileImg",
    });

    await Notification.updateMany({ to: userId }, { read: true });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("error in getnotification function", error.message);
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.deleteMany({ to: userId });
    res.status(200).json({ message: "Notification Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("error in deleteNotification function", error.message);
  }
};

export const deleteOneNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ error: "Notification is Not Found." });
    }
    if (notification.to.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "You don't delete this notification." });
    }

    await Notification.findByIdAndDelete(notificationId);
    res
      .status(200)
      .json({ message: "this notification will deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("error in deleteOneNotification function", error.message);
  }
};
