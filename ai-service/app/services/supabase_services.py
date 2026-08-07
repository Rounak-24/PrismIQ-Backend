from app.config.supabase import supabase
import os

async def download_file(supabase_file_path:str):
    download_dir = "./public/downloads"
    bucket = os.getenv("SUPABASE_BUCKET")
    filename = supabase_file_path.split("/")[-1]

    local_path = os.path.join(download_dir, filename)

    with open(local_path, "wb+") as f:
        response = supabase.storage.from_(bucket).download(
            path = supabase_file_path
        )

        f.write(response)

    print("downloaded")
    return local_path


