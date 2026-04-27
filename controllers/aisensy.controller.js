// import {
//   createBusiness,
//   createProject,
//   generateToken,
// } from "../services/aisensy/aisensy.service.js";

// export const onboardClient = async (req, res) => {
//   try {
//     const { name, email, phone, company } = req.body;
//     console.log(req.body);

//     // 1️⃣ Create Business
//     const business = await createBusiness({
//       display_name: name,
//       email,
//       company,
//       contact: phone,
//     });

//     const businessId = business.id;

//     // 2️⃣ Create Project
//     const project = await createProject(businessId, `${name}-project`);

//     const projectId = project.id;

//     // ⚠️ You must define password logic
//     const password = "Temp@123"; // change later

//     res.json({
//       success: true,
//       businessId,
//       projectId,
//     });
//   } catch (err) {
//     res.status(500).json({
//       error: "Onboarding failed",
//       details: err.message,
//     });
//   }
// };
import AisensyClient from "../models/aisensy-client.model.js";
import {
  createBusiness,
  createProject,
} from "../services/aisensy/aisensy.service.js";

export const onboardClient = async (req, res) => {
  try {
    const { name, email, phone, company } = req.body;

    // 1️⃣ Create Business
    const business = await createBusiness({
      display_name: name,
      email,
      company,
      contact: phone,
    });

    const businessId = business.id;

    // 2️⃣ Create Project
    const project = await createProject(businessId, `${name}-project`);

    const projectId = project.id;

    // 3️⃣ Save in DB
    const savedClient = await AisensyClient.create({
      name,
      email,
      phone,
      company,
      businessId,
      projectId,
    });

    res.json({
      success: true,
      data: savedClient,
    });
  } catch (err) {
    console.error("ONBOARD ERROR:", err.response?.data || err.message);

    res.status(500).json({
      error: "Onboarding failed",
      details: err.message,
    });
  }
};
