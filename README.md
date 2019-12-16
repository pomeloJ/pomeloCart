# pomeloCart
very simple cart for Javascript
## basic sample[ITEMS]
```javascript
//init
let cart = new pomeloCart;

//add a cart item about id is a1 , price is 123 and quantity is 2
cart.addItem({'id':'a1','price':123,'quantity':2});

//add same item id(a1), this time price is update to 456 , quantity is update to 2+3 = 5
cart.addItem({'id':'a1','price':456,'quantity':3});

//reduce a item quantity, make a negative number
cart.addItem({'id':'a2','quantity':-1});

//edit a item data
cart.editItem({'id':'a3','quantity':5});

//delete a item 
cart.delItem({'id':'a2'});
```
## extra data sample[shipping note]
```javascript
//set shipping data
cart.setShipping({'type':'delivery','name':'常溫宅配','price':60});

//set note data
cart.setNote({'note':'dont come'});
```
## get total or list
```javascript
//get summary about cart
cart.total();
//it will give
```
```JSON
{
    "allPrice": 2280,
    "itemPrice": 2280,
    "itemQuantity": 5,
    "shippingPrice": 0,
    "shippingData": {},
    "note": ""
}
```

```javascript
//get cart list
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
