import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const getImageUrls = async (uid) => {
  const { data, error } = await supabase.storage.from("user").list(uid);

  if (error) {
    console.error("List error:", error.message);
    return [];
  }

  return data.map(
    (file) =>
      supabase.storage.from("user").getPublicUrl(`${uid}/${file.name}`).data
        .publicUrl
  );
};

export const getProfilePic = async (uid) => {
  return supabase.storage.from("user").getPublicUrl(`${uid}/profilepic.jpg`)
    .data.publicUrl;
};

export const upload = async (uid, buffer, fileName) => {
  //const buffer = Buffer.from(base64Data, "base64");

  const { data, error } = await supabase.storage
    .from("user")
    .upload(`${uid}/${fileName}`, buffer, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (error) {
    console.error("Upload error:", error.message);
    return null;
  }

  const postPublicUrl = supabase.storage
    .from("user")
    .getPublicUrl(`${uid}/${fileName}`);
  console.log("Upload successful sdfsdf:", postPublicUrl.data.publicUrl);
  return postPublicUrl.data.publicUrl;
};
