"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { createClient } from "@/lib/supabase/client";

interface Props {
  jobId: string;
}

interface Photo {
  id: string;
  image_url: string;
  category: string;
  caption: string | null;
  created_at: string;
}

export default function JobPhotos({
  jobId,
}: Props) {
  const supabase = createClient();

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);

  const [category, setCategory] =
    useState("Before");

  const [caption, setCaption] =
    useState("");

  const [message, setMessage] =
    useState("");



  async function loadPhotos() {
    const {
      data,
      error,
    } = await supabase
      .from("job_photos")
      .select("*")
      .eq("job_id", jobId)
      .order(
        "created_at",
        {
          ascending: false,
        }
      );


    if (error) {

      console.error(
        "LOAD PHOTOS ERROR:",
        error
      );

      setMessage(
        "Unable to load photos."
      );

      return;
    }


    setPhotos(
      data ?? []
    );
  }



  useEffect(() => {

    void loadPhotos();

  }, [jobId]);





  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    const file =
      e.target.files?.[0];


    if (!file)
      return;



    try {

      setUploading(true);

      setMessage(
        "Uploading photo..."
      );



      // Validate image

      if (
        !file.type.startsWith("image/")
      ) {

        throw new Error(
          "Only image files are allowed."
        );

      }



      // 10MB limit

      if (
        file.size > 10 * 1024 * 1024
      ) {

        throw new Error(
          "Image must be smaller than 10MB."
        );

      }





      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase()
          || "jpg";



      const fileName =
        `${crypto.randomUUID()}.${extension}`;



      const filePath =
        `${jobId}/${fileName}`;





      /*
        Upload to Supabase Storage
      */

      const {
        error: uploadError,
      } =
      await supabase.storage
        .from("job-photos")
        .upload(
          filePath,
          file
        );



      if (uploadError) {

        console.error(
          "STORAGE UPLOAD ERROR:",
          uploadError
        );

        throw uploadError;

      }





      /*
        Create public URL
      */

      const {
        data:urlData,
      } =
      supabase.storage
        .from("job-photos")
        .getPublicUrl(
          filePath
        );



      const imageUrl =
        urlData.publicUrl;





      /*
        Save database record
      */

      const {
        error: dbError,
      } =
      await supabase
        .from("job_photos")
        .insert({

          job_id:
            jobId,

          image_url:
            imageUrl,

          category,

          caption:
            caption || null,

        });




      if (dbError) {

        console.error(
          "DATABASE INSERT ERROR:",
          dbError
        );

        throw dbError;

      }




      setMessage(
        "Photo uploaded successfully."
      );


      setCaption("");


      await loadPhotos();



    } catch(error:any) {


      console.error(
        "FULL PHOTO UPLOAD ERROR:",
        error
      );



      setMessage(
        error?.message ||
        "Upload failed."
      );



    } finally {


      setUploading(false);


      e.target.value = "";

    }

  }







  async function deletePhoto(
    photo: Photo
  ) {


    const confirmDelete =
      confirm(
        "Delete this photo?"
      );


    if (!confirmDelete)
      return;




    try {


      const filePath =
        photo.image_url
          .split(
            "/job-photos/"
          )[1];



      if(filePath){

        const {
          error:storageError
        } =
        await supabase.storage
          .from("job-photos")
          .remove([
            filePath
          ]);



        if(storageError)
          throw storageError;

      }




      const {
        error:dbError
      } =
      await supabase
        .from("job_photos")
        .delete()
        .eq(
          "id",
          photo.id
        );



      if(dbError)
        throw dbError;



      await loadPhotos();



    } catch(error:any){


      console.error(
        "DELETE PHOTO ERROR:",
        error
      );


      setMessage(
        error?.message ||
        "Unable to delete photo."
      );

    }

  }







  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">


      <h2 className="mb-5 text-xl font-semibold">
        Job Photos
      </h2>




      <div className="space-y-4">


        <select
          className="w-full rounded-xl border p-3"
          value={category}
          onChange={(e)=>
            setCategory(
              e.target.value
            )
          }
        >

          <option>
            Before
          </option>

          <option>
            During
          </option>

          <option>
            After
          </option>

        </select>





        <input
          type="text"
          placeholder="Photo caption (optional)"
          value={caption}
          onChange={(e)=>
            setCaption(
              e.target.value
            )
          }
          className="w-full rounded-xl border p-3"
        />






        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="w-full"
        />




        {message && (

          <p className="text-sm text-slate-600">
            {message}
          </p>

        )}



      </div>







      {
        photos.length > 0 && (

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">


            {
              photos.map((photo)=>(


                <div
                  key={photo.id}
                  className="overflow-hidden rounded-xl border"
                >


                  <Image

                    src={
                      photo.image_url
                    }

                    alt="Job photo"

                    width={500}

                    height={400}

                    className="h-48 w-full object-cover"

                  />



                  <div className="p-3">


                    <p className="font-semibold">
                      {photo.category}
                    </p>




                    {
                      photo.caption && (

                        <p className="text-sm text-slate-500">
                          {photo.caption}
                        </p>

                      )
                    }




                    <button
                      onClick={() =>
                        deletePhoto(photo)
                      }
                      className="mt-3 text-sm text-red-600"
                    >

                      Delete

                    </button>


                  </div>


                </div>


              ))
            }


          </div>

        )
      }



    </div>

  );

}