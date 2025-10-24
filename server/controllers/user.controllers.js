import User from "../models/user.models.js";


export const getUser=async(req,res)=>{
    const userId=req.userId
    try{
        const user=await User.findById(userId).select('-password')
        if(!user){
            return res.status(404).json({msg:"User not found"})
        }
        return res.status(200).json(user)
    }
    catch(error){
        return res.status(500).json({msg:"Server Error"})
    }
}

export const getProfile=async(req,res)=>{
    try{
        const userName=req.params.userName;
        const user= await User.findOne({userName}).select('-password');
        if(!user){
            return res.status(404).json({msg:"User not found"})
        }
        return res.status(200).json(user);
    }catch(error){
        return res.status(500).json({msg:"Server Error"})
    }
   
    

}

export const editProfile=async(req,res)=>{
    try{
       const{name , userName ,  password, learningStyle}=req.body;
       const user=await User.findById(req.userId)
         if(!user){
            return res.status(404).json({msg:"User not found"})

         }
         //CHECK IF USERNAME IS TAKEN
         if(user.userName !== userName){
            const existingUser=await User.findOne({userName})
            if(existingUser){
                return res.status(400).json({msg:"Username is already taken"})
            }
         }
         
    user.name = name || user.name;
    user.userName = userName || user.userName;
    user.learningStyle = learningStyle || user.learningStyle;
         
         await user.save();
            return res.status(200).json(user)
    }
    catch(error){
        console.log("Error in editProfile:", error);
        return res.status(500).json({msg:"Server Error"})
    }
    
}
export const updatePreferences=async(req,res)=>{
    try{
        const{preferences}=req.body;
        const user=await User.findById(req.userId)
        if(!user){
            return res.status(404).json({msg:"User not found"})
        }
        user.preferences=preferences;
        await user.save();
        return res.status(200).json(user)
    }
    catch(error){
        return res.status(500).json({msg:"Server Error"})
    }
    
}   
export const getBadges = async (req, res) => {
    try {

      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ msg: "User Not Found" });
  
      return res.status(200).json(user.badges); // Return only badges
    } catch (err) {
      return res.status(500).json({ msg: "Could not get badges" });
    }
  };
  
export const addBadges=async(req,res)=>{
    try{
        const { badge } = req.body;
        const user=await User.findById(req.userId)
        if(!user){
            return res.status(404).json({msg:"User Not Found"})
        }
        user.badges.push(badge)
        
        await user.save();
        return res.status(200).json(user)
    }catch(err){
            return res.status(500).json({msg:"Could not add badge"})
        }
    
}
export const trackStudySession = async (req, res) => {
    try {
      const { date } = req.body; // optional date of study session
      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ msg: "User Not Found" });
  
      const today = date ? new Date(date) : new Date();
      user.studyHistory.push(today);
  
      // Update streak
      const lastStudy = user.lastStudyDate || today;
      const diff = Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24));
      user.streak = diff === 1 ? user.streak + 1 : 1;
      user.lastStudyDate = today;
  
      await user.save();
      return res.status(200).json({ streak: user.streak, lastStudyDate: user.lastStudyDate });
    } catch (err) {
      return res.status(500).json({ msg: "Could not track study session" });
    }
  };
  

