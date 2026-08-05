import os
import uuid 
import pandas as pd
import duckdb
from typing import TypedDict, Any, List

class DumpedDBoutput(TypedDict):
    dataset_id: str
    row_count: Any
    columns: List[dict[str:Any]]
    schema: str

DATASET_DIR = "./data/datasets"
os.makedirs(DATASET_DIR, exist_ok=True)

async def dump_file_to_db(local_filepath:str)-> DumpedDBoutput:

    try:
        extension = os.path.splitext(local_filepath)[1].lower()
        dataset_id = str(uuid.uuid4())
        db_dir = "./data/datasets"

        db_path = os.path.join(db_dir, f"{dataset_id}.duckdb")

        if extension==".csv":
            dataframe = pd.read_csv(local_filepath)
        else:
            dataframe = pd.read_excel(local_filepath)


        connection = duckdb.connect(db_path)
        connection.register("dataframe", dataframe)

        connection.execute("""
            CREATE TABLE uploaded_data AS
            SELECT *
            FROM dataframe
        """)

        connection.unregister("dataframe")

        schema = connection.execute("""
            DESCRIBE uploaded_data
        """).fetchall()

        row_count = connection.execute("""
            SELECT COUNT(*)
            FROM uploaded_data
        """).fetchone()[0]

        connection.close()

        columns = [
            {
                "name": column[0],
                "type": column[1]
            }
            for column in schema
        ]

        output_data = DumpedDBoutput(
            dataset_id=dataset_id,
            schema=schema,
            row_count=row_count,
            columns=columns
        )

        return output_data

    except Exception as e:
        print("Error occured while dumping file", e)

    finally:
        if os.path.exists(local_filepath):
            os.remove(local_filepath)


async def execute_dataset_query(dataset_id:str, sql:str):
    db_path = os.path.join(DATASET_DIR, f"{dataset_id}.duckdb")

    if not os.path.exists(db_path):
        raise Exception(
            detail="Dataset not found"
        )

    connection = None

    try:
        connection = duckdb.connect(db_path, read_only=True)
        result = connection.execute(sql)

        columns = [
            column[0]
            for column in result.description
        ]
        rows = result.fetchall()

        return [
            dict(zip(columns, row))
            for row in rows
        ]
    
    except Exception as e:
        print("error occured while querying local duckdb", e)

    finally:
        if connection:
            connection.close()
    
        