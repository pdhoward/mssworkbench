exports.data = [
    {
        "id": 64209690,
        "name": "Jane Smith",
        "email": "jane.smith@gmail.com",
        "phone": "07777 888 999",
        "address": {
          "street": "Flat 1, 188 High Street Kensington",
          "postcode": "W8 5AA",
          "city": "London",
          "country": "United Kingdom"
        },
        "personal": {
          "DOB": "1982-08-16",
          "age": 33,
          "gender": "female"
        },
        "connections": [
          {
            "id": "35434004285760",
            "name": "John Doe",
            "connType": "friend",
            "since": "2014-03-25"
          },
          {
            "id": 13418315,
            "name": "James Smith",
            "connType": "relative",
            "relation": "husband",
            "since": "2012-07-03"
          }
        ],
        "feeds": {
          "news": true,
          "sport": true,
          "fashion": false
        },
        "createdAt": "2015-09-22T10:30:06.000Z"
      },
      {
        "productId": 1,
        "productName": "An ice sculpture",
        "price": 12.50,
        "tags": [ "cold", "ice" ],
        "dimensions": {
          "length": 7.0,
          "width": 12.0,
          "height": 9.5
        },
        "warehouseLocation": {
          "latitude": -78.75,
          "longitude": 20.4
        }
      },
      {
        "DueDate": "2013-02-15",
        "Balance": 1990.19,
        "DocNumber": "SAMP001",
        "Status": "Payable",
        "Line": [
          {
            "Description": "Sample Expense",
            "Amount": 500,
            "DetailType": "ExpenseDetail",
            "Customer": "ABC123 (Sample Customer)",
            "Ref": "DEF234 (Sample Construction)",
            "Account": "EFG345 (Fuel)",
            "LineStatus": "Billable"
          }
        ],
        "TotalAmt": 1990.19
      },
      {
        "QueryResponse": {
          "maxResults": "1",
          "startPosition": "1",
          "Employee": {
            "Organization": "false",
            "Title": "Mrs.",
            "GivenName": "Jane",
            "MiddleName": "Lane",
            "FamilyName": "Doe",
            "DisplayName": "Jane Lane Doe",
            "PrintOnCheckName": "Jane Lane Doe",
            "Active": "true",
            "PrimaryPhone": { "FreeFormNumber": "505.555.9999" },
            "PrimaryEmailAddr": { "Address": "janedoe@example.com" },
            "EmployeeType": "Regular",
            "status": "Synchronized",
            "Id": "ABC123",
            "SyncToken": "1",
            "MetaData": {
              "CreateTime": "2015-04-26T19:45:03Z",
              "LastUpdatedTime": "2015-04-27T21:48:23Z"
            },
            "PrimaryAddr": {
              "Line1": "123 Any Street",
              "City": "Any City",
              "CountrySubDivisionCode": "WA",
              "PostalCode": "01234"
            }
          }
        },
        "time": "2015-04-27T22:12:32.012Z"
      },
      {
        "count": 1,
        "items": [
          {
            "last_updated_date": "2015-04-24",
            "expire_date": "2016-04-25",
            "author_first_name": "John",
            "description": "Sample Description",
            "creation_date": "2015-04-20",
            "title": "Sample Title",
            "allow_comment": "1",
            "author": {
              "last_name": "Doe",
              "email": "johndoe@example.com",
              "first_name": "John"
            },
            "body": "Sample Body",
            "publish_date": "2015-04-25",
            "version": "1",
            "author_last_name": "Doe",
            "parent_id": 2345678901,
            "article_url": "http://www.example.com/articles/3456789012"
          }
        ],
        "version": 1
      },
      {
        "count": 1,
        "items": [
          {
            "creation_date": "2015-04-20",
            "title": "Sample Title",
            "author": "John Doe",
            "body": "Sample Body",
            "publish_date": "2015-04-25",
            "article_url": "http://www.example.com/articles/3456789012"
          }
        ],
        "version": 1
      }

]