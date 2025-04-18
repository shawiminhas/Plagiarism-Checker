import gridfs  # type: ignore


def save_file_to_mongo(file_path, db):
    """
    Save a file to MongoDB GridFS.

    Args:
        file_path: The path of the file to save.
        db: The database to save it to.

    Returns:
        The ID of the saved file in MongoDB.
    Raises:
        Exception: Prints error message to console if any error occurs.
    """
    try:
        fs = gridfs.GridFS(db)
        with open(file_path, "rb") as f:
            file_data = f.read()
            file_id = fs.put(file_data, filename=file_path)
        return file_id
    except Exception as e:
        print(f"Error saving file to MongoDB: {e}")
        return None
