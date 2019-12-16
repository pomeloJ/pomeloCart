# pomeloCart
very simple cart data processing for Javascript(ES6)

*for demo cart quickly*

*for simple demand*

*for dont't want to think too much*

*for any simple reason*
## CDN JS
for easy just copy and coding

we don't say anymore
```javascript
<script src="https://cdn.ank.uno/github/pomeloJ/pomeloCart/cart.js"></script>
```
## Basic sample[items]
```javascript
//init
let cart = new pomeloCart;

//add a cart item about id with 'a1' , price is 123 and quantity is 2
cart.addItem({'id':'a1','price':123,'quantity':2});

//add same item id [ 'a1' ], now price is updated to 456 , quantity is updated to 2+3 = 5
cart.addItem({'id':'a1','price':456,'quantity':3});

//reduce a item quantity, fill a negative number
cart.addItem({'id':'a2','quantity':-1});

//edit a item data
cart.editItem({'id':'a3','quantity':5});

//delete a item 
cart.delItem({'id':'a2'});
```
## Extra data sample[shipping 、 note]
```javascript
//set shipping data
cart.setShipping({'type':'delivery','name':'常溫宅配','price':60});

//set note data
cart.setNote({'buyNote':'dont come'});
```
## Get total or list
### Get summary about cart
```javascript
cart.total();
//it will give
```
```JSON
{
    "allPrice": 2280,
    "itemPrice": 2280,
    "itemQuantity": 5,
    "shippingPrice": 60,
    "shippingData": {
        "type":"delivery",
        "name":"常溫宅配",
        "price":60
    },
    "note": {
        "buyNote":"dont come"
    }
}
```
### Get cart list
```javascript
cart.list();
//it will give
```
```JSON
[
    {
        "id": "a1",
        "price": 456,
        "quantity": 5,
        "data": false,
        "subtotal": 2280
    },
    {
        "id": "a2",
        "price": 333,
        "quantity": 5,
        "data": false,
        "subtotal": 1665
    }
]
```
## Empty cart
```javascript
//it will clean items,but keep shipping and note
cart.empty();
```

## Import/Export
**by default** *pomeloCart* save cart data in localStorage , so you don't need to think about how to store

**BUT** if you want to export/import data , you can do........
### Export
```javascript
cart.export();
```
it will give String
```JSON
{"idArr":[{"id":"a1","price":456,"quantity":5,"data":false,"subtotal":2280},{"id":"a2","price":333,"quantity":5,"data":false,"subtotal":1665}],"shippingData":{"type":"delivery","name":"常溫宅配","price":60,"data":false},"noteData":{"buyNote":"dont come"}}
```

### Import
```javscript
cart.import(string);
//or you cound init with import string
let cart = new pomeloCart(string);
```

## Add item with data
if you hope item with custom data,you can ....
```javascript
cart.addItem({'id':'a1','price':123,'quantity':2,
    'data':{
        'name':'no cool product',
        'img':'public/owners/img.jpg',
        'desc':'we are not cool enough'
    }
});
```
data column **no limit** any type,just fill it

# Future
* we don't know,maybe discount function or making items more detail.

* we expect to make anything intuitive and simple,maybe just for 71% common situation.

# Star
if this JS helps you, please let us know by giving **star** , thank you.
