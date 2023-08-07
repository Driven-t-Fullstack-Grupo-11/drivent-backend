import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { bookingRoom, listBooking, changeBooking, getBookingbyRoomId } from "@/controllers";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("", listBooking)
  .post("", bookingRoom)
  .put("/:bookingId", changeBooking)
  .get("/:roomId", getBookingbyRoomId);

export { bookingRouter };
