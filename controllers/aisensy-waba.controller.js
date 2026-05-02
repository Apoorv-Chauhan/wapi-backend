import AisensyClient from "../models/aisensy-client.model.js";
import { User, Workspace } from "../models/index.js";
import { generateWabaLink } from "../services/aisensy/waba.service.js";

export const createWabaLink = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      businessId,
      projectId,
      assistantId,
      website,
      address,
      timezone,
    } = req.body;

    const userId = req.user.id;
    console.log('🔍 Creating WABA link for user:', userId);

    // Get user's AiSensy business ID
    const user = await User.findById(userId);
    if (!user) {
      console.error('❌ User not found:', userId);
      return res.status(404).json({ error: "User not found" });
    }

    console.log('👤 User found:', { 
      name: user.name, 
      email: user.email, 
      aisensy_business_id: user.aisensy_business_id 
    });

    // Use the stored business ID or the provided one
    const finalBusinessId = user.aisensy_business_id || businessId;
    
    if (!finalBusinessId) {
      console.error('❌ No business ID found for user:', userId);
      return res.status(400).json({ 
        error: "No AiSensy business ID found. Please register again or contact support.",
        success: false
      });
    }

    // Get workspace's AiSensy project ID if workspace_id is provided
    let finalProjectId = projectId;
    if (req.body.workspace_id) {
      const workspace = await Workspace.findById(req.body.workspace_id);
      if (workspace?.aisensy_project_id) {
        finalProjectId = workspace.aisensy_project_id;
        console.log('📁 Using workspace project ID:', finalProjectId);
      } else {
        console.log('⚠️ Workspace found but no project ID');
      }
    }

    // Prepare phone data with country code
    const phoneData = phone || {
      code: user.country_code ? parseInt(user.country_code.replace('+', '')) : 91,
      number: user.phone
    };

    console.log('🚀 Generating WABA link with:', {
      businessId: finalBusinessId,
      projectId: finalProjectId,
      name: name || user.name,
      email: email || user.email,
      phone: phoneData
    });

    const response = await generateWabaLink({
      businessId: finalBusinessId,
      projectId: finalProjectId,
      assistantId: assistantId || process.env.AISENSY_ASSISTANT_ID,
      name: name || user.name,
      email: email || user.email,
      phone: phoneData,
      website,
      address,
      timezone,
    });

    console.log('✅ WABA link generated successfully');

    res.json({
      success: true,
      link: response,
    });
  } catch (err) {
    console.error('❌ WABA link generation error:', err.response?.data || err.message);
    res.status(500).json({
      error: "WABA link generation failed",
      details: err.response?.data || err.message,
      success: false
    });
  }
};
