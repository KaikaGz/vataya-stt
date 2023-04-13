import { notification } from "antd";

export const callNotification = (type, mess, descrip) => {
  if (type == "success") {
    notification.success({
      message: mess,
      description: descrip,
      // onClick: () => {
      //   console.log("Notification Clicked!");
      // },
    });
  } else if (type == "info") {
    notification.info({
      message: mess,
      description: descrip,
      // onClick: () => {
      //   console.log("Notification Clicked!");
      // },
    });
  } else if (type == "error") {
    notification.error({
      message: mess,
      description: descrip,
      //   console.log("Notification Clicked!");
      // },
    });
  }
};
