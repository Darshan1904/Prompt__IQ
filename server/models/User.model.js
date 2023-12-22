import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

let profile_imgs_name_list = ["Garfield", "Tinkerbell", "Annie", "Loki", "Cleo", "Angel", "Bob", "Mia", "Coco", "Gracie", "Bear", "Bella", "Abby", "Harley", "Cali", "Leo", "Luna", "Jack", "Felix", "Kiki"];
let profile_imgs_collections_list = ["notionists-neutral", "adventurer-neutral", "fun-emoji"];

const userSchema = mongoose.Schema({

    personal_info: {
        fullname: {
            type: String,
            lowercase: true,
            required: true,
            minlength: [3, 'fullname must be 3 letters long'],
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        },
        password: String,
        username: {
            type: String,
            minlength: [3, 'Username must be 3 letters long'],
            unique: true,
        },
        bio: {
            type: String,
            maxlength: [200, 'Bio should not be more than 200'],
            default: "",
        },
        profile_img: {
            type: String,
            default: () => {
                return `https://api.dicebear.com/6.x/${profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)]}/svg?seed=${profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)]}`
            } 
        },
    },
    social_links: {
        youtube: {
            type: String,
            default: "",
        },
        instagram: {
            type: String,
            default: "",
        },
        facebook: {
            type: String,
            default: "",
        },
        twitter: {
            type: String,
            default: "",
        },
        github: {
            type: String,
            default: "",
        },
        website: {
            type: String,
            default: "",
        }
    },
    account_info:{
        total_posts: {
            type: Number,
            default: 0
        },
        total_reads: {
            type: Number,
            default: 0
        },
    },
    google_auth: {
        type: Boolean,
        default: false
    },
    prompts: {
        type: [ Schema.Types.ObjectId ],
        ref: 'prompts',
        default: [],
    }

}, 
{ 
    timestamps: {
        createdAt: 'joinedAt'
    } 

})

userSchema.pre("save", async function(next) {
    if(!this.isModified("personal_info.password") || !this.personal_info.password) return next();
    this.personal_info.password = await bcrypt.hash(this.personal_info.password, 12);
    next();
});

userSchema.methods.generateAuthToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.personal_info.email,
            username: this.personal_info.username,
            fullname: this.personal_info.fullname,
        }, 
        process.env.JWT_SECRET, 
        {expiresIn: process.env.JWT_EXPIRES_IN}
    );
}

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.personal_info.password);
}

userSchema.methods.updatePassword = async function(newPassword) {
    this.personal_info.password = newPassword;
    return await this.save();
}

const User = mongoose.model("users", userSchema);

export default User;