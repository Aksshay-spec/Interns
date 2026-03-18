import { createGoogleMeet } from "../services/googleMeetService.js";

export const createMeetLink = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Date, start time and end time are required",
      });
    }

    // Combine date + time properly
    const startDateTime = new Date(`${date}T${startTime}:00`);
    const endDateTime = new Date(`${date}T${endTime}:00`);

    const meetLink = await createGoogleMeet({
      startDateTime,
      endDateTime,
    });

    return res.status(200).json({
      success: true,
      meetLink,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create Google Meet link",
    });
  }
};