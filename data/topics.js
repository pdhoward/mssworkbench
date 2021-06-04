

exports.topics = [
    {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://example.com/product.schema.json",
        "title": "Product",
        "description": "A product from Acme's catalog",
        "type": "object",
        "properties": {
          "productId": {
            "description": "The unique identifier for a product",
            "type": "integer"
          },
          "productName": {
            "description": "Name of the product",
            "type": "string"
          },
          "price": {
            "description": "The price of the product",
            "type": "number",
            "exclusiveMinimum": 0
          },
          "tags": {
            "description": "Tags for the product",
            "type": "array",
            "items": {
              "type": "string"
            },
            "minItems": 1,
            "uniqueItems": true
          },
          "dimensions": {
            "type": "object",
            "properties": {
              "length": {
                "type": "number"
              },
              "width": {
                "type": "number"
              },
              "height": {
                "type": "number"
              }
            },
            "required": [ "length", "width", "height" ]
          },
          "warehouseLocation": {
            "description": "Coordinates of the warehouse where the product is located.",
            "$ref": "https://example.com/geographical-location.schema.json"
          }
        },
        "required": [ "productId", "productName", "price" ]
      },
      {
        "$id": "https://example.com/geographical-location.schema.json",
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "title": "geolocation",
        "description": "A geographical coordinate on a planet (most commonly Earth).",
        "required": [ "latitude", "longitude" ],
        "type": "object",
        "properties": {
          "latitude": {
            "type": "number",
            "minimum": -90,
            "maximum": 90
          },
          "longitude": {
            "type": "number",
            "minimum": -180,
            "maximum": 180
          }
        }
      },
      {
        "$schema": "https://json-schema.org/draft-04/schema#",
        "id": "http://mynet.com/schemas/user.json#",
        "title": "subscriber profile",
        "description": "User profile with connections",
        "type": "object",
        "properties": {
          "id": {
            "description": "positive integer or string of digits",
            "type": ["string", "integer"],
            "pattern": "^[1-9][0-9]*$",
            "minimum": 1
          },
          "name": { "type": "string", "maxLength": 128 },
          "email": { "type": "string", "format": "email" },
          "phone": { "type": "string", "pattern": "^[0-9()\-\.\s]+$" }, 
          "address": {
            "type": "object",
            "additionalProperties": { "type": "string" },
            "maxProperties": 6,
            "required": ["street", "postcode", "city", "country"]
          },
          "personal": {
            "type": "object",
            "properties": {
              "DOB": { "type": "string", "format": "date" },
              "age": { "type": "integer", "minimum": 13 },
              "gender": { "enum": ["female", "male"] }
            },
            "required": ["DOB", "age"],
            "additionalProperties": false
          },
          "connections": {
            "type": "array",
            "maxItems": 150,
            "items": {
              "title": "Connection",
              "description": "User connection schema",
              "type": "object",
              "properties": {
                "id": {
                  "type": ["string", "integer"],
                  "pattern": "^[1-9][0-9]*$",
                  "minimum": 1
                },
                "name": { "type": "string", "maxLength": 128 },
                "since": { "type": "string", "format": "date" },
                "connType": { "type": "string" },
                "relation": {},
                "close": {}
              },
              "oneOf": [
                {
                  "properties": {
                    "connType": { "enum": ["relative"] },
                    "relation": { "type": "string" }
                  },
                  "dependencies": {
                    "relation": ["close"]
                  }
                },
                {
                  "properties": {
                    "connType": { "enum": ["friend", "colleague", "other"] },
                    "relation": { "not": {} },
                    "close": { "not": {} }
                  }
                }
              ],
              "required": ["id", "name", "since", "connType"],
              "additionalProperties": false
            }
          },
          "feeds": {
            "title": "feeds",
            "description": "Feeds user subscribes to",
            "type": "object",
            "patternProperties": {
              "^[A-Za-z]+$": { "type": "boolean" }
            },
            "additionalProperties": false
          },
          "createdAt": { "type": "string", "format": "date-time" }
        }
      },
      {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "title": "InvoiceInputModel",
        "type": "object",
        "properties": {
          "DueDate": { "type": "string" },
          "Balance": { "type": "number" },
          "DocNumber": { "type": "string" },
          "Status": { "type": "string" },
          "Line": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "Description": { "type": "string" },
                "Amount": { "type": "integer" },
                "DetailType": { "type": "string" },
                "ExpenseDetail": {
                  "type": "object",
                  "properties": {
                    "Customer": {
                      "type": "object",
                      "properties": {
                        "value": { "type": "string" },
                        "name": { "type": "string" }
                      }
                    },
                    "Ref": {
                      "type": "object",
                      "properties": {
                        "value": { "type": "string" },
                        "name": { "type": "string" }
                      }
                    },
                    "Account": {
                      "type": "object",
                      "properties": {
                        "value": { "type": "string" },
                        "name": { "type": "string" }
                      }
                    },
                    "LineStatus": { "type": "string" }
                  }
                }
              }
            }
          },
          "Vendor": {
            "type": "object",
            "properties": {
              "value": { "type": "string" },
              "name": { "type": "string" }
            }
          },
          "APRef": {
            "type": "object",
            "properties": {
              "value": { "type": "string" },
              "name": { "type": "string" }
            }
          },
          "TotalAmt": { "type": "number" }
        }
      },
      {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "title": "InvoiceOutputModel",
        "type": "object",
        "properties": {
          "DueDate": { "type": "string" },
          "Balance": { "type": "number" },
          "DocNumber": { "type": "string" },
          "Status": { "type": "string" },
          "Line": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "Description": { "type": "string" },
                "Amount": { "type": "integer" },
                "DetailType": { "type": "string" },
                "Customer": { "type": "string" },
                "Ref": { "type": "string" },
                "Account": { "type": "string" },
                "LineStatus": { "type": "string" }
              }
            }
          },
          "TotalAmt": { "type": "number" }
        }
      },
      {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "title": "EmployeeInputModel",
        "type": "object",
        "properties": {
          "QueryResponse": {
            "type": "object",
            "properties": {
              "maxResults": { "type": "string" },
              "startPosition": { "type": "string" },
              "Employee": {
                "type": "object",
                "properties": {
                  "Organization": { "type": "string" },
                  "Title": { "type": "string" },
                  "GivenName": { "type": "string" },
                  "MiddleName": { "type": "string" },
                  "FamilyName": { "type": "string" },
                  "DisplayName": { "type": "string" },
                  "PrintOnCheckName": { "type": "string" },
                  "Active": { "type": "string" },
                  "PrimaryPhone": {
                    "type": "object",
                    "properties": {
                      "FreeFormNumber": { "type": "string" }
                    }
                  },
                  "PrimaryEmailAddr": {
                    "type": "object",
                    "properties": {
                      "Address": { "type": "string" }
                    }
                  },
                  "EmployeeType": { "type": "string" },
                  "status": { "type": "string" },
                  "Id": { "type": "string" },
                  "SyncToken": { "type": "string" },
                  "MetaData": {
                    "type": "object",
                    "properties": {
                      "CreateTime": { "type": "string" },
                      "LastUpdatedTime": { "type": "string" }
                    }
                  },
                  "PrimaryAddr": {
                    "type": "object",
                    "properties": {
                      "Line1": { "type": "string" },
                      "City": { "type": "string" },
                      "CountrySubDivisionCode": { "type": "string" },
                      "PostalCode": { "type": "string" }
                    }
                  }
                }
              }
            }
          },
          "time": { "type": "string" }
        }
      },
      {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "title": "NewsArticleInputModel",
        "type": "object",
        "properties": {
          "count": { "type": "integer" },
          "items": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "last_updated_date": { "type": "string" },
                "expire_date": { "type": "string" },
                "author_first_name": { "type": "string" },
                "description": { "type": "string" },
                "creation_date": { "type": "string" },
                "title": { "type": "string" },
                "allow_comment": { "type": "string" },
                "author": {
                  "type": "object",
                  "properties": {
                    "last_name": { "type": "string" },
                    "email": { "type": "string" },
                    "first_name": { "type": "string" }
                  }
                },
                "body": { "type": "string" },
                "publish_date": { "type": "string" },
                "version": { "type": "string" },
                "author_last_name": { "type": "string" },
                "parent_id": { "type": "integer" },
                "article_url": { "type": "string" }
              }
            }
          },
          "version": { "type": "integer" }
        }
      }

]