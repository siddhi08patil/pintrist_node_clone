const mongoose = require("mongoose")
const { stringify } = require("uuid")

const postSchema = mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
  },
  title:String,
  description:String,
  image:String,
})

userSchema.plugin(plm)

module.exports=mongoose.model("user",postSchema)
