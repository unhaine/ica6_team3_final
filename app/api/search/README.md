# Naver Shopping Search API

This API endpoint proxies requests to the Naver Shopping Open API.

## Endpoint

`GET /api/search`

## Parameters

| Name    | Type   | Required | Description                                   |
| ------- | ------ | -------- | --------------------------------------------- |
| `query` | string | Yes      | The search keyword to query for product data. |

## Response

Returns a JSON object containing the search results from Naver.

### Example Success Response

```json
{
  "lastBuildDate": "Mon, 03 Feb 2025 12:00:00 +0900",
  "total": 12345,
  "start": 1,
  "display": 5,
  "items": [
    {
      "title": "Search Result Title",
      "link": "https://search.shopping.naver.com/...",
      "image": "https://shopping-phinf.pstatic.net/...",
      "lprice": "15000",
      "hprice": "",
      "mallName": "Naver Mall",
      "productId": "1234567890",
      "productType": "1",
      "brand": "Brand Name",
      "maker": "Maker Name",
      "category1": "Fashion",
      "category2": "Shoes",
      "category3": "Running",
      "category4": "Nike"
    }
  ]
}
```

## Setup

To use this API, you must set the following environment variables in your `.env` file:

```env
AUTH_NAVER_ID=your_client_id
AUTH_NAVER_SECRET=your_client_secret
```

If these keys are missing, the API will return mock data for testing purposes.
