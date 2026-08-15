org_db = {
    "dataset_id": "org",
    "schema_context": "[('date', 'VARCHAR', 'YES', None, None, None), ('campaign', 'VARCHAR', 'YES', None, None, None), ('channel', 'VARCHAR', 'YES', None, None, None), ('category', 'VARCHAR', 'YES', None, None, None), ('region', 'VARCHAR', 'YES', None, None, None), ('customer_segment', 'VARCHAR', 'YES', None, None, None), ('device', 'VARCHAR', 'YES', None, None, None), ('impressions', 'BIGINT', 'YES', None, None, None), ('clicks', 'BIGINT', 'YES', None, None, None), ('conversions', 'BIGINT', 'YES', None, None, None), ('new_customers', 'BIGINT', 'YES', None, None, None), ('returning_customers', 'BIGINT', 'YES', None, None, None), ('cost', 'DOUBLE', 'YES', None, None, None), ('revenue', 'DOUBLE', 'YES', None, None, None), ('ctr', 'DOUBLE', 'YES', None, None, None), ('conversion_rate', 'DOUBLE', 'YES', None, None, None), ('cpc', 'DOUBLE', 'YES', None, None, None), ('roas', 'DOUBLE', 'YES', None, None, None), ('profit', 'DOUBLE', 'YES', None, None, None)]",
    "row_count": 816,
    "columns": [
        {
            "name": "date",
            "type": "VARCHAR"
        },
        {
            "name": "campaign",
            "type": "VARCHAR"
        },
        {
            "name": "channel",
            "type": "VARCHAR"
        },
        {
            "name": "category",
            "type": "VARCHAR"
        },
        {
            "name": "region",
            "type": "VARCHAR"
        },
        {
            "name": "customer_segment",
            "type": "VARCHAR"
        },
        {
            "name": "device",
            "type": "VARCHAR"
        },
        {
            "name": "impressions",
            "type": "BIGINT"
        },
        {
            "name": "clicks",
            "type": "BIGINT"
        },
        {
            "name": "conversions",
            "type": "BIGINT"
        },
        {
            "name": "new_customers",
            "type": "BIGINT"
        },
        {
            "name": "returning_customers",
            "type": "BIGINT"
        },
        {
            "name": "cost",
            "type": "DOUBLE"
        },
        {
            "name": "revenue",
            "type": "DOUBLE"
        },
        {
            "name": "ctr",
            "type": "DOUBLE"
        },
        {
            "name": "conversion_rate",
            "type": "DOUBLE"
        },
        {
            "name": "cpc",
            "type": "DOUBLE"
        },
        {
            "name": "roas",
            "type": "DOUBLE"
        },
        {
            "name": "profit",
            "type": "DOUBLE"
        }
    ]
}

def get_org_db_schema()->str:
    return org_db.get("schema_context")