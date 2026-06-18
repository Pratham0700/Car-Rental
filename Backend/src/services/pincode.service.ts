import { Request } from "express";
import axios from "axios";
import https from "https";
import { resBadRequest, resNotFound, resSuccess } from "../utils/shareFunction";
export const pincode = async (req: Request) => {
  try {
    const pin = req.params.pin as string
    const response = await axios.get(
      `https://api.postalpincode.in/pincode/${pin}`,
      {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      },
    );
    const data = await response.data;
    if (data[0].Status === "Success" && data[0].PostOffice.length > 0) {
      const postOffices = data[0].PostOffice;
     const pincodeDetails = {
        pincode: postOffices[0].Pincode,
        city: postOffices[0].District,
        state: postOffices[0].State,
        country: postOffices[0].Country,
        areas: postOffices.map((office: any) => office.Name),
      };
      return resSuccess({ message: "Pincode details retrieved successfully",
         data: pincodeDetails }); //200
    } else {
      return resBadRequest({ message: "Invalid pincode" }); //400
    }
  } catch (error) {
      throw error; //500
  }
};
