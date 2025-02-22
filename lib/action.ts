"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify"
import { writeClient } from "@/sanity/lib/write-clients";

export const createPitch = async (state:any , form:FormData) => {
  const session = await auth();

  if (!session) 
    return parseServerActionResponse({ error: "Not signed in.", status: "ERROR"});

  const {title , description, category, link , Pitch} = Object.fromEntries(
    Array.from(form),
  )
  const slug = slugify(title as string, {lower: true, strict: true});

  try {
    const startup = {
      title,
      description,
      category,
      image: link,
      slug: {
        _type:slug,
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
      Pitch
    };

    const result = await writeClient.create({_type: "startup", ...startup});

    return parseServerActionResponse({
      ...result,
      error: '',
      status: 'SUCCESS'
    })
    
  } catch (error) {
    console.log(error);
    
    return parseServerActionResponse({ error: JSON.stringify(error), status: "ERROR",});
  }
}